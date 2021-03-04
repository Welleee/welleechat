import React from "react";

import Logo from "../../assets/images/logo.png";
import "./Messages.scss";

const MessageHome = () => {
  return (
    <div id="messages-home">
      <img src={Logo} alt="" width="180" height="180" />
      <h1>Welcome to Wellee Chat</h1>
      <span>Select a conversation or start a new one!</span>
    </div>
  );
};

export default MessageHome;
