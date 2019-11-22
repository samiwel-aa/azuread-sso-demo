import React from "react";

import { UserAgentApplication } from "msal";

const config = {
  auth: {
    clientId: "24b24a4a-81e6-49ff-827f-81fa696794cc",
    authority:
      "https://login.microsoftonline.com/52da6ceb-c432-45d8-9cee-97902996ced9/oauth2/v2.0/authorize"
  }
};

const msalApp = new UserAgentApplication(config);

msalApp.handleRedirectCallback((error, response) => {
  console.log({
    error,
    response
  });
});

const handleClick = () => {
  const loginRequest = {
    scopes: ["user.read", "mail.send"] // optional Array<string>
  };

  msalApp
    .loginPopup(loginRequest)
    .then(response => {
      console.log({ response });
    })
    .catch(err => {
      console.log({ err });
    });
};

export default () => (
  <div>
    <h1>Azure AD SSO Test</h1>
    <button type="button" onClick={handleClick}>
      Sign in
    </button>
  </div>
);
