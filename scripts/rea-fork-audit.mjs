#!/usr/bin/env node
// Independent, read-only REA fork diagnostics. Never prints secrets or remote URLs.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  ["package.json", "file"],
  ["package-lock.json", "file"],
  [".nvmrc", "file"],
  ["README.md", "file"],
  ["LICENSE", "file"],
  ["scripts/rea.mjs", "file"],
  ["src", "directory"],
  ["tests", "directory"],
  ["bridge/ghidra", "directory"],
];

function exec(binary, args, root) {
  const run = spawnSync(binary, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 3000,
    maxBuffer: 131072,
    windowsHide: true,
  });
  return !run.error && run.status === 0 ? (run.stdout || "").trim() : null;
}

function kind(root, name) {
  const path = resolve(root, name);
  if (!existsSync(path)) return null;
  const value = statSync(path);
  return value.isFile() ? "file" : value.isDirectory() ? "directory" : "other";
}

export function collectForkAudit(root = defaultRoot) {
  const base = resolve(root);
  const missing = required
    .filter(([name, expected]) => kind(base, name) !== expected)
    .map(([name]) => name);
  let sourcePackage = null;
  if (kind(base, "package.json") === "file") {
    try {
      const data = JSON.parse(readFileSync(resolve(base, "package.json"), "utf8"));
      sourcePackage = {
        name: data.name || null,
        version: data.version || null,
        nodeEngine: data.engines?.node || null,
        packageManager: data.packageManager || null,
      };
    } catch {
      missing.push("package.json (invalid JSON)");
    }
  }
  const pinned = kind(base, ".nvmrc") === "file"
    ? readFileSync(resolve(base, ".nvmrc"), "utf8").trim()
    : null;
  const revision = exec("git", ["rev-parse", "HEAD"], base);
  const git = {
    available: Boolean(revision),
    revision,
    branch: revision ? exec("git", ["branch", "--show-current"], base) || "(detached)" : null,
  };
  const tools = {
    npm: exec("npm", ["--version"], base) !== null,
    git: exec("git", ["--version"], base) !== null,
    python3: exec("python3", ["--version"], base) !== null,
    ps: exec("ps", ["-p", String(process.pid), "-o", "pid="], base) !== null,
  };
  const warnings = [];
  if (!git.available) warnings.push("Git commit identity could not be checked");
  if (!tools.npm) warnings.push("npm unavailable");
  if (!tools.python3) warnings.push("Python unavailable; some checks may be skipped");
  if (process.platform === "linux" && !tools.ps) {
    warnings.push("ps unavailable on Linux; native REA process checks may fail");
  }
  return {
    schemaVersion: 1,
    edition: "Dragon REA Development Edition",
    editionVersion: "0.1.0-dev",
    upstream: "morluto/rea",
    sourcePackage,
    node: { running: process.version, pinned },
    platform: process.platform,
    git,
    requiredFiles: { checked: required.length, missing },
    tools,
    warnings,
    ok: missing.length === 0,
  };
}

export function formatForkAudit(report) {
  const lines = [
    "REA fork audit: " + (report.ok ? "PASS" : "FAIL"),
    "Edition: " + report.edition + " " + report.editionVersion,
    "Upstream package: " + (report.sourcePackage?.name || "unknown") +
      " " + (report.sourcePackage?.version || "unknown"),
    "Node: " + report.node.running + "; source pin: " + (report.node.pinned || "none"),
    "Revision: " + (report.git.revision || "unavailable"),
    "Required source items found: " +
      (report.requiredFiles.checked - report.requiredFiles.missing.length) +
      "/" + report.requiredFiles.checked,
  ];
  for (const missing of report.requiredFiles.missing) lines.push("MISSING: " + missing);
  for (const warning of report.warnings) lines.push("WARNING: " + warning);
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2);
  let json = false;
  let strict = false;
  let root = defaultRoot;
  let output = null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--json") json = true;
    else if (arg === "--strict") strict = true;
    else if (arg === "--root" || arg === "--output") {
      const value = args[++i];
      if (!value || value.startsWith("--")) throw new Error("Missing value for " + arg);
      if (arg === "--root") root = value;
      else output = value;
    } else if (arg === "--help") {
      process.stdout.write("Usage: node scripts/rea-fork-audit.mjs [--json] [--strict] [--root PATH] [--output FILE]\n");
      return;
    } else throw new Error("Unknown argument: " + arg);
  }
  const report = collectForkAudit(root);
  const result = json ? JSON.stringify(report, null, 2) : formatForkAudit(report);
  if (output) {
    writeFileSync(resolve(output), result + "\n");
    process.stdout.write("Saved requested report.\n");
  } else process.stdout.write(result + "\n");
  if (strict && !report.ok) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    process.stderr.write("REA audit error: " + error.message + "\n");
    process.exitCode = 2;
  }
}
