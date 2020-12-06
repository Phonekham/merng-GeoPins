import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";
import { gql } from "@apollo/client";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  {
    me {
      _id
      name
      email
      picture
    }
  }
`;

const Login = ({ classes }) => {
  const onSuccess = async (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken },
    });
    console.log(client);

    const data = await client.request(ME_QUERY);
    console.log({ data });
  };

  return (
    <GoogleLogin
      clientId="1072323787876-rh2ouk6thv0jg4mt2btbl5ljsjjnm705.apps.googleusercontent.com"
      onSuccess={onSuccess}
      isSignedIn={true}
    />
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default withStyles(styles)(Login);
