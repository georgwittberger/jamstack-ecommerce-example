<p style="text-align:center;">
  <img src="https://dummyimage.com/600x400/666/fff" alt="Dummy"
    width="600" height="400" style="max-width:600px;height:auto;" />
</p>

# JAMStack E-Commerce Example

This is a showcase of an e-commerce website built with the JAMStack using
[Nuxt.js](https://nuxtjs.org) as the web application framework and
[Salesforce](https://www.salesforce.com/) as the data storage for products and
orders as well as for user authentication.

- [JAMStack E-Commerce Example](#jamstack-e-commerce-example)
  - [Example Features](#example-features)
  - [JAMStack Architecture](#jamstack-architecture)
  - [Running the Showcase](#running-the-showcase)
    - [Prerequisites](#prerequisites)
    - [Setting Up Salesforce](#setting-up-salesforce)
      - [Setting Up the Test User and Profile](#setting-up-the-test-user-and-profile)
      - [Setting Up the Integration User](#setting-up-the-integration-user)
      - [Setting Up the Lightning Community](#setting-up-the-lightning-community)
      - [Setting Up the Connected App](#setting-up-the-connected-app)
    - [Running the Content Update Script](#running-the-content-update-script)
    - [Running the API Server](#running-the-api-server)
    - [Running the Web Application](#running-the-web-application)
  - [License](#license)

## Example Features

- **Pre-Generated Static HTML Files:** All pages that make up the website are
  pre-generated at build time. This even includes one product detail page for
  each product. These static HTML files can be served by any web server or
  Content Delivery Network (CDN).
- **Pre-fetched Product Content:** Content for products is pre-fetched from
  Salesforce using a dedicated Node.js script. This script should be executed
  before the static HTML files are generated. It fetches product data via the
  Salesforce REST API and stores the content locally as JSON files. They will be
  used to generate the pages and are also included in the Git repository.
- **Authentication via Salesforce:** Visitors can authenticate with their
  Salesforce customer community user via the OpenID Connect protocol. This
  requires only a minimal Lightning Community configuration and a Connected App
  in Salesforce.
- **Client-Side Shopping Cart:** All items added to the shopping cart are stored
  client-side in the browser's local storage. No server communication required.
  Visitors can still close the browser and have their cart content restored when
  accessing the page again (with same browser on same device).
- **Order Transmission to Salesforce:** Orders are sent to Salesforce using the
  Salesforce REST API. For security reasons this API is not directly accessed by
  the browser. Communication works via a little API server acting as a gateway.

## JAMStack Architecture

<p>
  <img src="https://dummyimage.com/600x400/666/fff" alt="Dummy"
    width="600" height="400" style="width:100%;height:auto;" />
</p>

Since the pages accessed by the website visitors are not generated dynamically
when they are requested but pre-generated and served as static HTML files, the
process of rolling out new features and content looks a little bit different
than in "traditional" web applications.

1. **Local Development:** Development of new features can be done locally.

   Nuxt.js comes with very effective tools to support a great developer
   experience like a dev server with hot module replacement and live reload.

   Content for products is stored in the Git repository alongside with the
   source code, so developers can make use of real product data during
   implementation and testing.

   API endpoints should be stubbed using some mock server, e.g.
   [WireMock](http://wiremock.org/) or
   [mockserver](https://github.com/namshi/mockserver), in order to work
   independently from real external systems. For OpenID Connect authentication
   consider setting up [KeyCloak](https://www.keycloak.org/) locally.

   _Note: This example project does not include any mock server._

2. **Pre-Fetching Content:** Everytime new or updated product data has to be
   published on the website the pre-fetched content JSON files must be updated
   in the Git repository before a new version of static HTML files is generated.

   The special Node.js content script will connect to Salesforce and fetch the
   most recent data via the Salesforce REST API. The content JSON files are
   updated accordingly and can be committed to the Git repository.

   It is completely up to you where and when this script is executed. For
   example, it can run on a CI server like [Travis CI](https://travis-ci.org/)
   trigged by a web hook or serverless function.

3. **Publishing Static HTML Files:** Every commit in the Git repository
   represents a certain implementation and content state of the website which
   can potentially be published.

   The build process transforms the source code into optimized chunks and
   generates the static HTML files by computing all accessible routes for the
   implemented page components and the pre-fetched content files.

   Finally, all generated website files can be published to any web server or
   Content Delivery Network, e.g. [Netlify](https://www.netlify.com/).

4. **Dynamic Enhancement via APIs:** Statically generated HTML does not mean
   that the website cannot include any dynamic features. These features like the
   shopping cart or personal user content are simply executed client-side when
   the web application has loaded in the browser.

   Dynamic data can be fetched by sending API requests from the browser.
   Visitors can authenticate using standard protocols like OAuth 2.0 and OpenID
   Connect to allow the website to present individual content.

## Running the Showcase

### Prerequisites

- [Node.js](https://nodejs.org/) 12.x or higher
- [Yarn](https://yarnpkg.com/) package manager
- Salesforce organization, e.g free
  [Developer Edition](https://developer.salesforce.com/signup)

### Setting Up Salesforce

#### Setting Up the Test User and Profile

Why? It enables the login with a real customer user in the Lightning Community.

1. Open Salesforce Setup and navigate to "Communities". Make sure that
   communities are enabled.
2. In the Salesforce Setup navigate to "Profiles".
3. Clone the profile "Customer Community User" to create a custom profile
   specifically for users of the new community. For example, call it "Example
   Customer User".
4. Open the Sales Cloud to create an Account and Contact for testing purposes.
   On the Contact view select the quick action "Enable Customer User".
   - Set the "User License" to "Customer Community".
   - Assign the profile created in the previous step.
   - Enter your own e-mail address to receive the welcome e-mail message once
     the user is added as member to the community.

#### Setting Up the Integration User

Why? It allows the API server and content script to connect to Salesforce with a
specific technical user which allows for individual access control.

1. Open Salesforce Setup and navigate to "Users".
2. Create a new user.
   - Set the "User License" to "Salesforce"
   - Assign the profile "System Administrator".
   - Give the user some name like "Integration".
   - Enter your own e-mail address in order to receive the registration e-mail.
3. Confirm the verification e-mail and complete the user registration by
   entering a new password.
4. Log in to Salesforce with that integration user.
5. In the user menu next to the Setup icon select "Settings".
6. Navigate to "Reset My Security Token" and click the button "Reset Security
   Token". You should receive the new token via e-mail.

#### Setting Up the Lightning Community

Why? It is required to display the login page during the OpenID Connect
authentication flow.

1. Open Salesforce Setup and navigate to "All Communities".
2. Click the button "New Community" and choose the template "Build Your Own".
   Give it some arbitrary name and preferrably leave the URL blank.
3. Open the "Workspace" of the new community and go to "Administration".
4. In the "Settings" section activate the community.
5. Temporarily switch back to Salesforce Setup at "All Communities" and open the
   "Builder" of the new community. Click the "Publish" button.
6. Back in the "Workspace" of the community go to the "Emails" section and enter
   your own e-mail address in the "Sender" configuration. Make sure to confirm
   the e-mail message which is sent to you.
7. Activate the checkbox "Send welcome email".
8. In the "Members" section assign the profile previously created for customer
   community users (e.g. "Example Customer User"). You should receive a welcome
   e-mail message for the test user created before. Complete the user
   registration by entering a new password.

#### Setting Up the Connected App

Why? It is required for the OpenID Connect authentication for website visitors
and allows the API server and content script to connect to Salesforce in a
secure way.

1. Open Salesforce Setup and navigate to the "App Manager".
2. Click the button "New Connected App" and enter the following data.
   - Connected App Name: (Choose anything you like, e.g. "Local OIDC")
   - API Name: (Choose anything you like, e.g. "Local_OIDC")
   - Contact Email: (Your e-mail address)
   - Enable OAuth Setting: Activated
   - Callback URL: <http://localhost:3000/login/callback>
   - Selected OAuth Scoped:
     - Access your basic information (id, profile, email, address, phone)
     - Allow access to your unique identifier (openid)
     - Perform requests on your behalf at any time (refresh_token,
       offline_access)
   - Require Secret for Web Server Flow: Deactivated
3. From the Connected App View copy the "Consumer Key" and the "Consumer Secret"
   for later use in configuration parameters.
4. Click the button "Manage" and then "Edit Policies".
5. Set the "Permitted Users" field to "Admin approved users are pre-authorized".
6. In the "Profiles" panel click the button "Manage Profiles" and assign both
   the profile previously created for customer community users (e.g. "Example
   Customer User") and the profile for the integration user (e.g. "System
   Administrator").

### Running the Content Update Script

This step is optional because the Git repository already contains some example
products for demonstration. You should have some records for the Product2 object
in your Salesforce organization and these products must have Price Book Entries
in some Price Book used for the content update.

1. Open a terminal in the directory `content-scripts`.
2. Set the following environment variables.

   | Name                       | Description                                                                  |
   | -------------------------- | ---------------------------------------------------------------------------- |
   | SALESFORCE_INSTANCE_URL    | Base URL of the Salesforce instance (pattern `https://xx##.salesforce.com` ) |
   | SALESFORCE_API_VERSION     | Salesforce API version to use                                                |
   | SALESFORCE_TOKEN_ENDPOINT  | OAuth 2.0 token endpoint of the Salesforce instance                          |
   | SALESFORCE_CLIENT_ID       | Consumer Key of the Connected App (copied before from App view)              |
   | SALESFORCE_CLIENT_SECRET   | Consumer Secret of the Connected App (copied before from App view)           |
   | SALESFORCE_USERNAME        | Username of the integration user                                             |
   | SALESFORCE_PASSWORD        | Password of the integration user + security token (simply concat the two)    |
   | SALESFORCE_PRICE_BOOK_NAME | Optional. Price book to use. Default: "Standard Price Book"                  |

   Example:

   ```bash
   SALESFORCE_INSTANCE_URL=https://eu25.salesforce.com
   SALESFORCE_API_VERSION=49.0
   SALESFORCE_TOKEN_ENDPOINT=https://login.salesforce.com/services/oauth2/token
   SALESFORCE_CLIENT_ID=3MVG9...ru7XA
   SALESFORCE_CLIENT_SECRET=17DAD...0110F
   SALESFORCE_USERNAME=integration@georg.wittberger.force.com
   SALESFORCE_PASSWORD=abcde...KiQ9n
   ```

   _Tip: You can put these variable assignments in a file called `.env` in the
   directory `content-scripts` for development and testing._

3. Install the Node.js dependencies.

   ```bash
   yarn install
   ```

4. Run the script to update the products JSON files in the directory
   `content/products`.

   ```bash
   yarn start
   ```

### Running the API Server

1. Open a terminal in the directory `api`.
2. Set the following environment variables.

   | Name                         | Description                                                                  |
   | ---------------------------- | ---------------------------------------------------------------------------- |
   | PORT                         | Local server port to listen on. Default: 3000                                |
   | SALESFORCE_INSTANCE_URL      | Base URL of the Salesforce instance (pattern `https://xx##.salesforce.com` ) |
   | SALESFORCE_API_VERSION       | Salesforce API version to use                                                |
   | SALESFORCE_USERINFO_ENDPOINT | OAuth 2.0 user info endpoint of the Salesforce Lightning Community           |
   | SALESFORCE_TOKEN_ENDPOINT    | OAuth 2.0 token endpoint of the Salesforce instance (not community)          |
   | SALESFORCE_CLIENT_ID         | Consumer Key of the Connected App (copied before from App view)              |
   | SALESFORCE_CLIENT_SECRET     | Consumer Secret of the Connected App (copied before from App view)           |
   | SALESFORCE_USERNAME          | Username of the integration user                                             |
   | SALESFORCE_PASSWORD          | Password of the integration user + security token (simply concat the two)    |
   | SALESFORCE_PRICE_BOOK_NAME   | Optional. Price book to use. Default: "Standard Price Book"                  |
   | SECURITY_CORS_ORIGIN         | Base URL of the web application allowed to access the server.                |

   Example:

   ```bash
   PORT=4000
   SALESFORCE_INSTANCE_URL=https://eu25.salesforce.com
   SALESFORCE_API_VERSION=49.0
   SALESFORCE_USERINFO_ENDPOINT=https://georgwittberger-developer-edition.eu25.force.com/services/oauth2/userinfo
   SALESFORCE_TOKEN_ENDPOINT=https://login.salesforce.com/services/oauth2/token
   SALESFORCE_CLIENT_ID=3MVG9...ru7XA
   SALESFORCE_CLIENT_SECRET=17DAD...0110F
   SALESFORCE_USERNAME=integration@georg.wittberger.force.com
   SALESFORCE_PASSWORD=abcde...KiQ9n
   SECURITY_CORS_ORIGIN=http://localhost:3000
   ```

   _Tip: You can put these variable assignments in a file called `.env` in the
   directory `api` for development and testing._

3. Install the Node.js dependencies.

   ```bash
   yarn install
   ```

4. Run the server.

   ```bash
   yarn start
   ```

### Running the Web Application

1. Open a terminal in the project root directory.
2. Set the following environment variables.

   | Name                      | Description                                                            |
   | ------------------------- | ---------------------------------------------------------------------- |
   | API_URL                   | Base URL of the API server                                             |
   | OAUTH2_AUTHORIZE_ENDPOINT | OAuth 2.0 authorization endpoint of the Salesforce Lightning Community |
   | OAUTH2_USERINFO_ENDPOINT  | User info endpoint of the API server                                   |
   | OAUTH2_TOKEN_ENDPOINT     | OAuth 2.0 token endpoint of the Salesforce Lightning Community         |
   | OAUTH2_CLIENT_ID          | Consumer Key of the Connected App (copied before from App view)        |
   | OAUTH2_SCOPES             | OAuth 2.0 scopes to request during authentication, comma-separated     |

   Example:

   ```bash
   API_URL=http://localhost:4000
   OAUTH2_AUTHORIZE_ENDPOINT=https://georgwittberger-developer-edition.eu25.force.com/services/oauth2/authorize
   OAUTH2_USERINFO_ENDPOINT=http://localhost:4000/userinfo
   OAUTH2_TOKEN_ENDPOINT=https://georgwittberger-developer-edition.eu25.force.com/services/oauth2/token
   OAUTH2_CLIENT_ID=3MVG9...ru7XA
   OAUTH2_SCOPES=openid,id,refresh_token
   ```

   _Tip: You can put these variable assignments in a file called `.env` in the
   project root directory for development and testing._

3. Install the Node.js dependencies.

   ```bash
   yarn install
   ```

4. Either launch the development server which offers live reload ...

   ```bash
   yarn dev
   ```

5. ... or generate the static HTML files first and then serve these files from
   the `dist` directory.

   ```bash
   yarn generate
   yarn start
   ```

6. Open your browser on <http://localhost:3000>

## License

[MIT License](https://opensource.org/licenses/MIT)
