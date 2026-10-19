# REA review from iPhone — 20 October 2026

This is a **non-destructive mobile-workflow trial** for `HenricHuntsman/rea`. Its purpose is to keep REA inspection and repair planning accessible while away from the Ubuntu desktop.

## Source of truth

- GitHub fork: https://github.com/HenricHuntsman/rea
- GitHub default branch: `main`
- Existing upstream-sync draft: https://github.com/HenricHuntsman/rea/pull/2
- Pinned upstream-sync branch: `sync/upstream-20261018-d205c52`
- That draft was recorded as 264 commits / 1,070 changed files on 20 October 2026, **not yet qualified by local build, test, or runtime checks**.
- The separate branding-only PR #1 is not part of this review.
- The intended Forgejo destination is a separate `rea-review` repository; its successful creation or import has **not** been verified.

## What this mobile trial establishes

A small documentation change can be created through a connected GitHub account on an isolated review branch without merging or altering `main`. This does **not** prove the REA application builds or the Forgejo runner works.

## Review queue (not yet executed)

- [ ] Preserve source refs, tags, and local-only changes before copying to Forgejo.
- [ ] Compare source SHAs in `main` and PR #2 against the imported Forgejo mirror.
- [ ] Review the large upstream diff in digestible batches: changes to CI/workflows, dependencies, CLI/agent integration, Ghidra/IDA bridges, and Linux behavior.
- [ ] Verify the actual package manager and Node.js prerequisites recorded in the current revision; run `npm ci` on an isolated runner.
- [ ] Run `npm run check:fast`, `npm run test:fast`, and `npm run build` on an isolated Linux runner; capture exact failures.
- [ ] Only after fast checks pass, evaluate broader `check:pr` and integration/tool-specific tests.
- [ ] Review and adapt GitHub Actions workflows for Forgejo instead of assuming full compatibility.
- [ ] Keep PR #2 draft and unmerged until test evidence and owner review are complete.

## Safety limits

- Do not force-push, rewrite history, or auto-merge upstream.
- Do not expose a home runner's Docker socket or secrets to untrusted pull request code.
- Prefer a private Tailscale Serve connection for access to localhost-only Forgejo; **do not** use a public Funnel exposure.
- Do not treat this checklist or a green review bot status as proof that binaries, dependencies, or platform integration work.

## Mobile usage

Open this repository and the draft PR in Safari or the GitHub iPhone app. Use the connected GitHub account from ChatGPT to examine files and stage reviewed edits on separate branches. The home Forgejo server must be independently reachable and authenticated before remote browser access can be considered working.
