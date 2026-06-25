# git-secrets

This repository uses `git-secrets` through `pre-commit` to prevent common secrets from being committed.

## Setup

```sh
brew install git-secrets
pre-commit install
pre-commit install --hook-type commit-msg
pre-commit install --hook-type prepare-commit-msg
git secrets --install
git secrets --register-aws
```

## Manual scan

```sh
pre-commit run git-secrets --all-files
```

The pre-commit hook delegates to `tools/git-secrets/pre-commit-scan`, which fails fast when `git-secrets` is not available on `PATH`.
