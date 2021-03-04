import React, { useEffect, useState, createContext } from "react";
import { auth } from "../firebaseConfig";

import CircularProgress from '@material-ui/core/CircularProgress'

export const Auth = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setShowChild(true);
    });
  }, []);

  if (!showChild) {
    return <CircularProgress />;
  } else {
    return <Auth.Provider value={{ user }}>{children}</Auth.Provider>;
  }
};
