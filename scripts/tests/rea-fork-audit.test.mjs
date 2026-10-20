import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { collectForkAudit, formatForkAudit } from "../rea-fork-audit.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "rea-fork-audit-"));
  for (const p of ["scripts", "src", "tests", "bridge/ghidra"]) {
    mkdirSync(join(root, p), { recursive: true });
  }
  for (const p of [
    "package-lock.json",
    "README.md",
    "LICENSE",
    "scripts/rea.mjs",
  ]) {
    writeFileSync(join(root, p), "");
  }
  writeFileSync(join(root, ".nvmrc"), "24.18.0\n");
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "rea-agents",
      version: "6.5.0",
      engines: { node: ">=22" },
      packageManager: "npm@11.16.0",
    }),
  );
  return root;
}

test("complete fixture passes without network or node_modules", () => {
  const root = fixture();
  try {
    const report = collectForkAudit(root);
    assert.equal(report.ok, true);
    assert.deepEqual(report.requiredFiles.missing, []);
    assert.equal(report.sourcePackage?.name, "rea-agents");
    assert.equal(report.node.pinned, "24.18.0");
    assert.match(formatForkAudit(report), /REA fork audit: PASS/);
    assert.equal(
      JSON.stringify(report).includes(root),
      false,
      "no workspace path leak",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("empty source tree produces missing-files report", () => {
  const root = mkdtempSync(join(tmpdir(), "rea-fork-empty-"));
  try {
    const report = collectForkAudit(root);
    assert.equal(report.ok, false);
    assert.ok(report.requiredFiles.missing.includes("package.json"));
    assert.ok(report.requiredFiles.missing.includes("src"));
    assert.match(formatForkAudit(report), /REA fork audit: FAIL/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("invalid package metadata is detected", () => {
  const root = fixture();
  try {
    writeFileSync(join(root, "package.json"), "{bad-json");
    const report = collectForkAudit(root);
    assert.equal(report.ok, false);
    assert.ok(
      report.requiredFiles.missing.includes("package.json (invalid JSON)"),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
