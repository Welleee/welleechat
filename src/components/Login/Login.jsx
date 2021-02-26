import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { auth, provider } from "../../firebaseConfig";

import { Auth } from "../../context/AuthContext"
// import { actionTypes } from "../../context/Reducer";
// import { useStateValue } from "../../context/StateProvider";

import "./Login.scss";

const Login = () => {
  // const [{}, dispatch] = useStateValue();
  let history = useHistory();
  const { user } = useContext(Auth);

  useEffect(() => {
    if (user) {
      history.push("/chats");
    }
  }, [history, user]);

  const signIn = async () => {
    await auth
      .signInWithPopup(provider)
      .then((result) => {
        // dispatch({
        //   type: actionTypes.SET_USER,
        //   user: result.user,
        // });
        console.log(result);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-text"></div>
        <button onClick={signIn}>Sign In With Google</button>
      </div>
    </div>
  );
};

export default Login;
