import React from "react";

import Moment from "react-moment";
import "moment-timezone";
import "./Message.scss";

const Message = ({ messages, user }) => {

  return (
    <>
      {messages.map((message, index) => (
        <div
          className={`message-row ${
            message.fromUid === user.uid ? "my-message" : "other-message"
          }`}
          key={index}
        >
          <div className="message-content">
            <div className="message-text">{message?.messageText}</div>
            <div className="message-time">
              {message.sentAt &&
              <Moment format="dd DD/MM HH:mm">
                {new Date(message?.sentAt.toDate())}
              </Moment>
              }
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Message;
