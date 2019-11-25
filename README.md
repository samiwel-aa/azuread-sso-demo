# azuread-sso-demo

This is a simple proof of concept (PoC) project to demo Azure AD Single Sign-On (SSO) using the [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js) library and query user information using the Microsoft Graph API via [microsoft-graph-client](https://www.npmjs.com/package/@microsoft/microsoft-graph-client).

## Getting started

Set the `clientId` and `tenantId` environment variables by modifying the [.env](./.env) file in the project root.

These values can be found on the Application registration page within Azure AD, under the registered applications page.

```bash
PORT=3002 yarn start
```

**Note: the port can be anything, but care must be taken to ensure that a corresponding redirect URL must be set up for the application within Azure AD**
