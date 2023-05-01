# Donation Management

Donation Management service for Benevolent. This server handles the configuration of the different organizations, as well as the setup for the different payment providers, and the receipts generation.

## Requirements

- Node v18.16+
- Docker
- Docker compose

## Get started

Once you have cloned the repository, install the Node dependencies by running

```
npm install
```

The best way to run and develop on the service, is to use Docker Compose.

In order to get the service to start, run `npm run docker:start`. The following will happen:

1. Docker images will be downloaded for all dependencies (Can be done manually with `npm run docker:pull`)
2. Docker image will be built for current service (Can be done manually with `npm run docker:build`)
3. DB Migrations will be run (Can be done manually with `npm run migrate:lates`)
4. Service will start with a watcher on files under `src`

### Ports

- HTTP Server: `8300`
- Node debug: `18300`

### Node debugger

By default, while in development in the container, you may attach your IDE's debugger to Node by using port 18300.

VSCode is already configured to attach to the container's debugger.

## Tests

This project will have many levels of tests. For now, it will only have Unit tests, but API and Integration tests are planned to be added in the future.

### Unit tests

Unit tests are located very close to the code they test. They have the same filename, expect for the extension, which is `.spec.ts`.

You can run unit tests by running `npm test`. You may run the Unit tests in watch mode with `npm run test:dev`

## Database

This project uses [CockroachDB](https://www.cockroachlabs.com/docs/) for its database. It uses [Knex.js](https://knexjs.org/guide/) to create DB Queries and Migrations.

The Database schema in use is kept up-to-date and documented in `docs/db-diagram.md` in the Mermaid format.

### Run migrations

In order to run migrations locally, run the `npm run migrate:latest` command, while the CockroachDB container is up and running. The latest migrations will be applied.

### Revert migrations

Testing migration rollback is important. Run the `npm run migrate:rollback` command, while the CockroachDB container is up and running. The last batch of migrations will be reverted.

### Create a migration

Creating a migration can be done by running `npm run migrate:make -- "name_of_my_migration"`.

:warning: **Don't forget that migrations should be forward and backwards compatible.**
