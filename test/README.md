# JAMStack E-Commerce Example Tests

This is an example how to run end-to-end tests for the website using Cypress.

## Setting Up the Website

In order to run the tests against the local development server you have to start
up that server first. In the project root directory run the following command.

```bash
yarn dev
```

In order to run the tests against the locally generated site you have to build
the site first and then run a local server hosting the `dist` directory. In the
project root directory run the following commands.

```bash
yarn generate
yarn start
```

In order to test the site on a real web domain you have to set the environment
variable `CYPRESS_BASE_URL` to the base URL to be tested.

```bash
export CYPRESS_BASE_URL=https://jamstack-ecommerce-example.netlify.app
```

## Running the Tests

Before running the tests for the very first time you must install the Node.js
dependencies.

```bash
yarn install
```

In order to run the tests in the terminal only (without any GUI) you should run
the following command.

```bash
yarn cypress run
```

If you want to open the Cypress GUI and run the tests from there you can execute
the following command.

```bash
yarn cypress open
```
