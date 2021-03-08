import React, { useState, useEffect, useContext } from "react";
import ChatList from "../components/ChatList/ChatList";
import MessagesContainer from "../components/Messages/Messages";
import { Auth } from "../context/AuthContext";
import MessageHome from "../components/Messages/MessageHome";
import { useHistory } from "react-router-dom";

import { useUiStore, useUiDispatch } from "../context/uiContex";

import "./ChatContainer.scss";

const ChatContainer = () => {
  let history = useHistory();
  const { user } = useContext(Auth);
  const [showMessages, setShowMessages] = useState(false);
  const [room, setRoom] = useState("");
  const [toUserUid, setToUserUid] = useState("");

  useEffect(() => {
    if (user === null) {
      history.push("/");
    }
  }, [history, user]);

  return (
    <>
      <ChatList
        setShowMessages={setShowMessages}
        setRoom={setRoom}
        toUserUid={toUserUid}
        setToUserUid={setToUserUid}
      />
      {showMessages ? (
        <MessagesContainer
          setShowMessages={setShowMessages}
          roomId={room}
          toUserUid={toUserUid}
        />
      ) : (
        <MessageHome />
      )}
    </>
  );
};

export default ChatContainer;
