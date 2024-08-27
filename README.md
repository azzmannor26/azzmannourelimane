<p align="center">
<h1 align="center" tabindex="-1" class="heading-element" dir="auto">
NestJs & prisma Template
</h1></p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

This project template is built using the [NestJS](https://github.com/nestjs/nest) framework, which is a progressive Node.js framework for building efficient and scalable server-side applications. It leverages TypeScript for a robust development experience and integrates seamlessly with [Prisma](https://www.prisma.io/), an intuitive database toolkit for TypeScript and Node.js.

The template is designed to provide a solid foundation for building modern backend applications with best practices in mind, including clean architecture, dependency injection, and modularization. It is pre-configured with [Docker](https://www.docker.com/) support, making it easy to get up and running with minimal setup. Additionally, it includes support for [JWT authentication](https://jwt.io/), testing with Jest, code quality checks, and more.

## Description

**NestJS Framework**: Leveraging NestJS's modular architecture, this template promotes separation of concerns and code reusability.<br><br>
**Prisma ORM**: A type-safe ORM for seamless database interactions, simplifying database management and migrations.<br><br>
**Docker Integration**: Fully set up Docker configurations to containerize your application and database for consistent and isolated environments.<br><br>
**JWT Authentication**: Pre-configured authentication and authorization using JWT, providing a secure method for protecting your APIs.<br><br>
**TypeScript**: Leverage TypeScript for a more reliable and less error-prone development process with advanced type checking.<br>
**Code Quality Tools**: Incorporates ESLint, Prettier, and other tools to enforce coding standards and format consistency.<br><br>
**Modular Design**: Clean, scalable code structure with modules for different application areas, promoting better organization and easier maintenance.<br><br>

## Installation

```bash
$ yarn install
```

## Run Docker

```bash
$ docker-compose up
```

## Prisma

```bash
# DB Migration
$ prisma migrate dev --name init

# Run prisma studio
$ prisma studio

#Run Data load
$ yarn data:load

#Run Data reset
$ yarn data:reset

```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## App Health Check

Before pushing changes, perform the following checks:

```bash
# Build the app and its dependencies only
yarn build

# Check coding rules
yarn lint

# Format the .ts files
yarn format

# Check used and unused dependencies
yarn depcheck

# Checking for Unused Functions and Imports
yarn deadcode

```

## Project Structure

```
📦backend
 ┣ 📂prisma
 ┃ ┣ 📂migrations
 ┃ ┃ ┗ 📜migration_lock.toml
 ┃ ┣ 📜schema.prisma
 ┃ ┣ 📜seed-reset.ts
 ┃ ┗ 📜seed.ts
 ┣ 📂src
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂role
 ┃ ┃ ┃ ┣ 📜role.guard.ts
 ┃ ┃ ┃ ┗ 📜roles.decorator.ts
 ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┣ 📜auth.guard.ts
 ┃ ┃ ┣ 📜auth.module.ts
 ┃ ┃ ┣ 📜auth.service.ts
 ┃ ┃ ┗ 📜jwt.strategy.ts
 ┃ ┣ 📂core
 ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┗ 📜jwt.config.ts
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜paginated-output.dto.ts
 ┃ ┃ ┃ ┗ 📜pagination.dto.ts
 ┃ ┃ ┣ 📂enums
 ┃ ┃ ┃ ┣ 📜controller.enum.ts
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜role-name.enum.ts
 ┃ ┃ ┃ ┣ 📜swagger.enum.ts
 ┃ ┃ ┃ ┗ 📜user-status.enum.ts
 ┃ ┃ ┣ 📂error
 ┃ ┃ ┃ ┣ 📜error-code.enum.ts
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂interface
 ┃ ┃ ┃ ┣ 📜change-pass-response.interface.ts
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┣ 📜jwt-config.interface.ts
 ┃ ┃ ┃ ┗ 📜user-response.interface.ts
 ┃ ┃ ┗ 📂messages
 ┃ ┃ ┃ ┣ 📜error.enum.ts
 ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┗ 📜success.enum.ts
 ┃ ┣ 📂libs
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┣ 📂exceptions
 ┃ ┃ ┃ ┃ ┗ 📜all-exceptions.filter.ts
 ┃ ┃ ┃ ┗ 📂interceptors
 ┃ ┃ ┃ ┃ ┗ 📜transform.interceptor.ts
 ┃ ┃ ┣ 📂prisma
 ┃ ┃ ┃ ┣ 📜prisma.module.ts
 ┃ ┃ ┃ ┗ 📜prisma.service.ts
 ┃ ┃ ┗ 📜libs.module.ts
 ┃ ┣ 📂modules
 ┃ ┃ ┗ 📂user
 ┃ ┃ ┃ ┣ 📂controllers
 ┃ ┃ ┃ ┃ ┗ 📜user.controller.ts
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┣ 📜change-password.dto.ts
 ┃ ┃ ┃ ┃ ┣ 📜create-users.dto.ts
 ┃ ┃ ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┃ ┃ ┣ 📜login-user.dto.ts
 ┃ ┃ ┃ ┃ ┣ 📜register-user.dto.ts
 ┃ ┃ ┃ ┃ ┣ 📜update-current-user.dto.ts
 ┃ ┃ ┃ ┃ ┣ 📜update-users.dto.ts
 ┃ ┃ ┃ ┃ ┗ 📜user-filter.dto.ts
 ┃ ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┃ ┗ 📜services.ts
 ┃ ┃ ┃ ┗ 📜user.model.ts
 ┃ ┣ 📜app.controller.ts
 ┃ ┣ 📜app.module.ts
 ┃ ┣ 📜app.service.ts
 ┃ ┗ 📜main.ts
 ┣ 📂test
 ┃ ┣ 📜app.e2e-spec.ts
 ┃ ┗ 📜jest-e2e.json
 ┣ 📜.DS_Store
 ┣ 📜.depcheckrc.yaml
 ┣ 📜.dockerignore
 ┣ 📜.env
 ┣ 📜.env.postgresql
 ┣ 📜.eslintrc.js
 ┣ 📜.gitignore
 ┣ 📜.gitlab-ci.yml
 ┣ 📜.prettierrc
 ┣ 📜Dockerfile
 ┣ 📜README.md
 ┣ 📜docker-compose.yml
 ┣ 📜nest-cli.json
 ┣ 📜package.json
 ┣ 📜tsconfig.build.json
 ┣ 📜tsconfig.json
 ┗ 📜yarn.lock
```

## Author

- GitHub [@MedKHaldoun](https://www.github.com/MedKHaldoun)
- GitLab [@MedKHaldoun](https://www.github.com/MedKHaldoun)
