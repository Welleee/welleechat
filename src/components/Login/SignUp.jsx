import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import db from "../../firebaseConfig";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  const signUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        db.collection("users").doc(data.user.uid).set({
          name: name,
          uid: data.user.uid,
          email: email,
        });
        history.push("/chats");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="auth">
      <Card>
        <CardContent>
          <div className="auth-container">
            <h2>Sign Up</h2>
            <TextField
              className="name"
              variant="outlined"
              label="Chat Name"
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
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
              <Button variant="contained" color="primary" onClick={signUp}>
                Sign Up
              </Button>
            </CardActions>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
