import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";
import Typography from "@material-ui/core/Typography";

import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../client";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken },
      });

      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: true });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = (err) => {
    console.log("Err logging in", err);
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        butt
        style={{ color: "rgb(66,133,244)" }}
      >
        Welecome
      </Typography>
      <GoogleLogin
        clientId="1072323787876-rh2ouk6thv0jg4mt2btbl5ljsjjnm705.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
        buttonText="Login With Google"
        onFailure={onFailure}
        theme="dark"
      />
    </div>
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
