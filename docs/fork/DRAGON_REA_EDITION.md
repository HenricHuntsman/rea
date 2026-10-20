# Dragon REA Development Edition

**Status: experimental, not an official REA release.** This independently maintained development edition is derived from [REA by morluto](https://github.com/morluto/rea). Keep original author credits and the MIT license notices. The `0.1.0-dev` value in `fork/edition.json` identifies only this fork's development layer; it is **not** a published npm version.

## What we added

- A **read-only fork audit**, useful from an iPhone-connected cloud Codespace, GitHub-hosted runner or local Linux terminal.
- Dependency-free tests for the audit tool.
- A scoped cloud workflow, separate from upstream's extensive CI.
- A safe place to review and repair features without merging into the default branch.

## Work from iPhone

Open [the REA fork](https://github.com/HenricHuntsman/rea) in Safari or the GitHub app. In Codespaces, choose branch `feature/rea-independent-edition-20261020` and run:

```sh
node scripts/rea-fork-audit.mjs
node scripts/rea-fork-audit.mjs --json
node --test scripts/tests/rea-fork-audit.test.mjs
```

The audit reports source completeness, package and Node versions, Git revision and selected tool prerequisites. It does not expose environment variables, credentials, remote URLs or personal directories. To export a report, explicitly run:

```sh
node scripts/rea-fork-audit.mjs --json --output rea-fork-audit.json
```

It does **not** run the full REA application or prove all engines work.

## Upgrade and testing plan

1. Preserve existing `main` and feature/design branches.
2. Maintain upstream-sync [draft PR #2](https://github.com/HenricHuntsman/rea/pull/2) separately. This branch began from its pinned `d205c528e31897f1f2919b80a4245356b502c703` commit.
3. Run offline fork audit and source tests through isolated GitHub-hosted Ubuntu runners.
4. Review TypeScript, dependencies, Linux runtime, native interfaces, Ghidra, and workflow changes in focused batches.
5. Document specific failing commands, commit IDs, environment versions and logs; change code only once failures are reproduced.
6. Keep the independent-edition PR a draft until tests and review are complete. Do not merge it automatically.

## Forgejo

The local Forgejo service previously ran on `127.0.0.1:3000`. Its remote connectivity is not verified. GitHub Codespaces and GitHub Actions can perform cloud development immediately; Forgejo mirroring is a separate operation requiring an authenticated network path and a verified destination. Do not expose the home server or Docker socket publicly.

## Current limits

This edition is a working **developer tooling increment**, not a completed independent binary reverse-engineering suite, native integration or published installer. Cloud check results are source-revision-specific and should not be generalized to every platform.
