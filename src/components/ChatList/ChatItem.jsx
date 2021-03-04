import React, { useEffect, useState } from "react";

import db from "../../firebaseConfig";

import Moment from "react-moment";
import moment from "moment";
import "moment-timezone";

import "./ChatItem.scss";
import Avatar from "@material-ui/core/Avatar";

const ChatItem = ({
  roomId,
  name,
  lastMessage,
  lastMessageAt,
  showChatMessages,
  setRoom,
  toUserUid,
  setToUserUid,
  setActiveId,
  activeId
}) => {

  const showSentAtDate = (sentTime) => {
    const sentAt = new Date(sentTime.toDate());
    const yesterday = moment().add(-1, "day").endOf("day");
    const moreThanYesterday = moment().add(-2, "day").endOf("day");
    if (sentAt > yesterday) {
      return <Moment format="HH:mm">{sentAt}</Moment>;
    } else if (sentAt < moreThanYesterday) {
      return <Moment format="DD/MM/yy">{sentAt}</Moment>;
    } else {
      return "yesterday";
    }
  };

  return (
    <div
      className={`chat ${activeId === roomId ? 'active' : ''}`}
      onClick={() => {
        showChatMessages();
        setRoom(roomId);
        setActiveId(roomId); //To set the active classname
        setToUserUid(toUserUid); //To use then to delete the rooms object from users and contacts collection
      }}
    >
      <Avatar className="profile-img" />
      <div className="name-container">
        <div className="contact-name">{name}</div>
        <div className="latest-message">{lastMessage}</div>
      </div>

      <div className="time-latest-message">
        {lastMessageAt
          ? showSentAtDate(lastMessageAt)
          : ""}
      </div>
    </div>
  );
};

export default ChatItem;
