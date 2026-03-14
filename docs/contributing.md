# Contributing

## Getting started

```bash
git clone https://github.com/finbarr/yolobox.git
cd yolobox
make build
make test
```

## Requirements

- Go 1.23+
- Docker or Podman for runtime and image testing

If you are working on the docs site branch, you also need Node.js to build the VitePress site.

## Development commands

```bash
make build
make test
make lint
make image
make install
```

For docs site work:

```bash
cd docs
npm install
npm run docs:build
```

## Expectations

- follow the repo guidance in `AGENTS.md`
- add tests for code changes
- run the relevant verification before committing
- keep documentation aligned with shipped behavior

## Pull requests

1. create a branch
2. make the change
3. run the relevant verification
4. if you changed docs, build the docs site
5. open a PR with a clear description

## Reporting issues

Include:

- operating system and version
- container runtime and version
- reproduction steps
- expected vs actual behavior

## Versioning

Version comes from `git describe`:

- tagged commit: `v0.1.1`
- later commit: `v0.1.1-3-gead833b`
- local changes add `-dirty`

The Makefile handles version stamping automatically.

## Releasing

```bash
git tag v0.1.2
git push origin master --tags
```

GitHub Actions builds release binaries, creates the GitHub release, and publishes the container image.
