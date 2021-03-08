import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { auth, provider } from "../../firebaseConfig";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { Auth } from "../../context/AuthContext";
import db from "../../firebaseConfig";
import Logo from "../../assets/images/logo.png";
// import { actionTypes } from "../../context/Reducer";
// import { useStateValue } from "../../context/StateProvider";

import "./Login.scss";

const Login = () => {
  // const [{}, dispatch] = useStateValue();
  let history = useHistory();
  const { user } = useContext(Auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      history.push("/chats");
    }
  }, [history, user]);

  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // console.log("login successful", user);
        history.push("/chats");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  };

  const signInWithGoogle = async () => {
    await auth
      .signInWithPopup(provider)
      .then((result) => {
        db.collection("users").doc(result.user.uid).set({
          name: result.user.displayName,
          uid: result.user.uid,
          email: result.user.email,
          profileImg: result.user.photoURL,
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="auth">
      <Card>
        <CardContent>
          <div className="auth-container">
            <img width="200" height="200" src={Logo}></img>
            <TextField
              className="email"
              variant="outlined"
              label="Email"
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              className="password"
              variant="outlined"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <CardActions>
              <Button variant="contained" onClick={signIn}>
                Sign In
              </Button>
              <Button variant="contained" color="primary" href="/signup">
                Sign Up
              </Button>
            </CardActions>
            {/* <Button variant="contained" onClick={signInWithGoogle}>
              Sign In With Google
            </Button> */}
            <div className="google-btn" onClick={signInWithGoogle}>
              <div className="google-icon-wrapper">
                <img
                  className="google-icon"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                />
              </div>
              <p className="btn-text">
                <b>Sign in with Google</b>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
