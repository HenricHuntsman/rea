# Dragon REA: second hosting provider from an iPhone

**State:** The GitLab CI configuration has been committed to the REA development branch. A GitLab account, migrated destination project, and successful GitLab runner check have **not** been verified yet.

## Why GitLab

- The REA GitHub fork remains the working source for draft PR #2 and our experimental edition PR #4.
- A separate GitLab project can hold the Git history and run builds on GitLab-hosted runners.
- A GitLab copy can be browsed from Safari if GitHub is temporarily unavailable.
- GitLab's free GitHub-import flow is a **one-time import**. Automatic *pull mirroring* requires GitLab Premium/Ultimate. Do not assume subsequent GitHub commits transfer themselves.

## Start entirely from iPhone (no desktop required)

1. Open https://gitlab.com in Safari. Sign in or create your own GitLab account.
2. Choose **Create new > New project/repository > Import project > GitHub**.
3. Choose GitHub OAuth, then explicitly authorize GitLab for access to the `HenricHuntsman/rea` repository. Review the requested permissions.
4. Import **only** `HenricHuntsman/rea` into your namespace (suggested name: `dragon-rea`). Do not import the other GitHub repositories.
5. Do not delete, rename or change the existing GitHub repo. Let the import complete, then inspect the project **Repository > Branches** and **CI/CD > Pipelines**.
6. Verify these refs are present:
   - `main` (old pre-upstream-merge default)
   - `sync/upstream-20261018-d205c52` at `d205c528e31897f1f2919b80a4245356b502c703` (draft PR #2)
   - `feature/rea-independent-edition-20261020` at the HEAD commit displayed in GitHub when you import
7. Switch to `feature/rea-independent-edition-20261020`. Its `.gitlab-ci.yml` launches a **preflight audit** and **static TypeScript/lint** check automatically when there is a pipeline event for this branch. If import did not trigger a pipeline, run **Build > Pipelines > New pipeline** on this branch.
8. Optionally trigger `portable-tests` and `package-and-python` manual jobs only when you need a fuller second-host check; these consume more runner minutes.
9. View the commit, branches, and successful pipeline logs from your iPhone. Keep the GitLab backup until the next source update.

**Important:** If GitLab requires you to verify your account or enable hosted runners, complete those account-specific steps in GitLab. Do not paste credentials or access tokens into ChatGPT. No GitLab account actions have been performed by this workflow.

## Safeguards and synchronisation

- GitHub remains the canonical source until you intentionally choose otherwise. Keep REA PR #2 and PR #4 as drafts; no automatic merging.
- **One-time import is not ongoing backup.** After further GitHub commits, manually push the new branches to GitLab from an authenticated cloud Codespace or run a separately reviewed sync workflow. Do not use `git push --mirror` against a project containing GitLab-only work; that can overwrite refs.
- Compare matching commit hashes at the end of every replication. A passing GitLab job is independent evidence for **its own tested SHA**, not a blanket guarantee.
- Keep tokens out of source, workflows and logs. If automating pushes later, use a repository-scoped, expiring GitLab token stored only in a GitHub Actions secret, not a public file.
- GitLab's free-hosted runner allowance is limited; leave heavy jobs manual to conserve it.

## Current edition

- GitHub source: https://github.com/HenricHuntsman/rea
- Independent edition PR: https://github.com/HenricHuntsman/rea/pull/4
- Existing upstream update PR: https://github.com/HenricHuntsman/rea/pull/2
- GitLab pipeline definition: `.gitlab-ci.yml`
- Primary GitHub pipeline: `.github/workflows/dragon-rea-edition.yml`

## References

- GitLab importer: https://docs.gitlab.com/user/project/import/github/
- Compute minutes: https://docs.gitlab.com/ci/pipelines/compute_minutes/
- Pull mirroring limitations: https://docs.gitlab.com/user/project/repository/mirror/pull/
