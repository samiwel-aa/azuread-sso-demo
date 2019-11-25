import React, { useState } from "react";
import dotenv from "dotenv";

import { UserAgentApplication } from "msal";
import { Client } from "@microsoft/microsoft-graph-client";
import { ImplicitMSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/ImplicitMSALAuthenticationProvider";

dotenv.config();

const graphScopes = ["openid", "profile"];

const config = {
  auth: {
    clientId: process.env.REACT_APP_SSO_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_SSO_TENANT_ID}`
  }
};

if (!config.auth.clientId) {
  throw new Error(
    "clientId not configured. This can be found in the application page in Azure AD registered applications."
  );
}

if (!process.env.REACT_APP_SSO_TENANT_ID) {
  throw new Error(
    "tenantId not configured. The tenantId can be found in the application page in Azure AD registered applications."
  );
}

const msalApp = new UserAgentApplication(config);

const authProvider = new ImplicitMSALAuthenticationProvider(msalApp, {
  scopes: graphScopes
});

const options = {
  authProvider // An instance created from previous step
};
const client = Client.initWithMiddleware(options);

msalApp.handleRedirectCallback((error, response) => {
  console.log({
    error,
    response
  });
});

export default () => {
  const [token, setAccessToken] = useState(undefined);
  const [claims, setClaims] = useState(undefined);
  const [userDetails, setUserDetails] = useState(undefined);
  const [userPhoto] = useState(undefined);

  const handleClick = () => {
    const loginRequest = {
      scopes: ["openid", "profile"] // optional Array<string>
    };

    msalApp
      .loginPopup(loginRequest)
      .then(response => {
        console.log({ response });
        // TODO there seems to be a bug in MSAL library.
        // The loginPopup function returns a null accessToken.
        // An explicit call to acquireTokenSilent seems to return a valid accessToken but ideally shouldn't be required.

        // Update: the ImplicitMSALAuthenticationProvider calles acquireTokenSilent under the hood.
        msalApp
          .acquireTokenSilent(loginRequest)
          .then(resp => {
            console.log({ resp });
            const { idToken, idTokenClaims, accessToken } = resp;
            console.log({ idToken, idTokenClaims, accessToken });
            setAccessToken(accessToken);
            setClaims(idTokenClaims);

            client
              .api("/me")
              .get()
              .then(res => {
                console.log({ res });
                setUserDetails(res);
              });

            // TODO If the user does not have a photo this will return statusCode 404
            // Otherwise you can call /me/photo/$value to get the image.
            // client
            //   .api("/me/photo")
            //   .get()
            //   .then(res => {
            //     console.log({ res });
            //     setUserPhoto(res);
            //   })
            //   .catch(err => {
            //     console.log({ err });
            //   });
          })
          .catch(err => {
            console.log({ err });
          });
      })
      .catch(err => {
        console.log({ err });
      });
  };

  return (
    <div>
      <h1>Azure AD SSO Test</h1>
      <button type="button" onClick={handleClick}>
        Sign in
      </button>
      {token && (
        <div>
          <h3>access_token</h3>
          <div>{token}</div>
        </div>
      )}
      {claims && (
        <div>
          <h3>id_token claims</h3>
          <pre>{JSON.stringify(claims, null, 4)}</pre>
        </div>
      )}
      {userDetails && (
        <div>
          <h3>user_details</h3>
          <pre>{JSON.stringify(userDetails, null, 4)}</pre>
        </div>
      )}
      {userPhoto && (
        <div>
          <h3>user_photo</h3>
          <pre>userPhoto</pre>
        </div>
      )}
    </div>
  );
};
