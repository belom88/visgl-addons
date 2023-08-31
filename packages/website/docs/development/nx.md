---
sidebar_position: 1
---

# Nx commands

The repository is monorepo built on [Nx](https://nx.dev/getting-started/intro). It contains a list of packages for developing and testing libraries.

## Clone the repository

```bash
git clone git@github.com:belom88/visgl.git
```

## Install dependencies

```bash
yarn
```

## VehicleLayer library

The VehicleLayer library (packages/vehicle-layer) is npm library. Is is possible to run `build`, `publish`, `lint` and `test` tasks.

### Build VehicleLayer

```bash
nx run vehicle-layer:build
```

### Lint VehicleLayer

Check code quality with linter

```bash
nx run vehicle-layer:lint
```

### Test VehicleLayer

Run unit tests

```bash
nx run vehicle-layer:test
```

### Publish VehicleLayer

TBD

## Testing app

The Testing App (packages/vehicle-layer-test-app) is developed to do manual testing of `VehicleLayer`. At this moment it is not intended to publish in production.

### Serve Testing App

Run application in a web browser for debug

```bash
nx run vehicle-layer-test-app:serve:development
```

### Lint Testing App

Check code quality with linter

```bash
nx run vehicle-layer-test-app:lint
```

### Test Testing App

Run unit tests

```bash
nx run vehicle-layer-test-app:test
```

### Testing App E2E

The "Testing App E2E" is a [cypress](https://www.cypress.io) testing app with e2e tests for "Testing App"

### Run Tesing APP e2e tests

```bash
nx run vehicle-layer-test-app-e2e:e2e
```

### Lint Testing App E2E

Check code quality with linter

```bash
nx run vehicle-layer-test-app-e2e:lint
```

## Global commands

### Check code format

```bash
nx format:check
```
