import React, { useEffect, useState } from "react";

import db from "../../firebaseConfig";

import Moment from "react-moment";
import "moment-timezone";

import "./ChatItem.scss";
import Avatar from "@material-ui/core/Avatar";

const ChatItem = ({
  roomId,
  name,
  showChatMessages,
  setRoom,
  toUserUid,
  setToUserUid,
}) => {
  const [latestMessage, setLatestMessage] = useState([]);

  //Get latest message
  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .doc(roomId)
      .collection("roomMessages")
      .orderBy("sentAt", "desc")
      .limit(1)
      .onSnapshot((snapshot) => {
        setLatestMessage(snapshot.docs.map((doc) => doc.data()));
      });

    //Set toUser uid to use then to delete the rooms object from users and contacts collection
    setToUserUid(toUserUid);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className="chat"
      onClick={() => {
        showChatMessages();
        setRoom(roomId);
      }}
    >
      <Avatar className="profile-img" />
      <div className="name-container">
        <div className="contact-name">{name}</div>
        <div className="latest-message">{latestMessage[0]?.messageText}</div>
      </div>

      <div className="time-latest-message">
        {latestMessage[0]?.sentAt ? (
          <Moment format="HH:mm">
            {new Date(latestMessage[0]?.sentAt.toDate())}
          </Moment>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ChatItem;
