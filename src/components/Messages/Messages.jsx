import React, { useEffect, useState } from "react";
import Message from "./Message";

import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/Delete";
import SendButton from "@material-ui/icons/Send";
import ConfirmDialog from "../Helpers/ConfirmDialog";

import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from '@material-ui/core/Tooltip'

import firebase from "firebase";
import db from "../../firebaseConfig";

import "./Messages.scss";

const Messages = ({ user, roomId, setShowMessages, toUserUid }) => {
  const [chatName, setChatName] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    //Get the messages
    if (roomId) {
      const unsubscribe = db
        .collection("messages")
        .doc(roomId)
        .collection("roomMessages")
        .orderBy("sentAt", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });

      //Get the name of the participant to set the chat title
      db.collection("rooms")
        .doc(user.uid)
        .collection("userRooms")
        .doc(roomId)
        .get()
        .then((doc) => {
          setChatName(doc.data().name);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("messages").doc(roomId).collection("roomMessages").add({
      messageText: inputMessage,
      fromUid: user.uid,
      sentAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    //Set to true the messages field and the time from the lastMessage
    db.collection("rooms")
      .doc(user.uid)
      .collection("userRooms")
      .doc(roomId)
      .update({
        lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessage: inputMessage,
      });

    db.collection("rooms")
      .doc(toUserUid)
      .collection("userRooms")
      .doc(roomId)
      .update({
        lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessage: inputMessage,
      });

    setInputMessage("");
  };

  const deleteChat = (roomId) => {
    //DELETE MESSAGES
    db.collection("messages")
      .doc(roomId)
      .collection("roomMessages")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });

    //DELETE FROM USER ROOM
    db.collection("rooms")
      .doc(user.uid)
      .collection("userRooms")
      .doc(roomId)
      .get()
      .then((snapshot) => {
        snapshot.ref.delete();
      });

    //DELETE ROOMS OBJECT FROM CONTACTS COLLECTION
    db.collection("contacts")
      .doc(user.uid)
      .collection("userContacts")
      .doc(toUserUid)
      .update({
        rooms: firebase.firestore.FieldValue.delete(),
      });

    //DELETE ROOMS OBJECT FROM USERS COLLECTION
    db.collection("users").doc(user.uid).update({
      rooms: firebase.firestore.FieldValue.delete(),
    });

    setOpenConfirmDialog(false);
    setShowMessages(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <>
      {/* Div Title */}
      <div id="title-container">
        <span>{chatName}</span>
        <Tooltip title="Delete conversation">
          <IconButton onClick={() => setOpenConfirmDialog(true)}>
            <TrashIcon />
          </IconButton>
        </Tooltip>
        <ConfirmDialog
          open={openConfirmDialog}
          handleClose={handleCloseConfirmDialog}
          handleAgree={() => deleteChat(roomId)}
        />
      </div>

      {/* Div Messages */}
      <div id="messages-container">
        {messages.length === 0 ? (
          <CircularProgress className="spinner" />
        ) : (
          <Message messages={messages} user={user} />
        )}
      </div>

      {/* Div Form Message */}
      <div id="conversation-form-container">
        <form onSubmit={sendMessage}>
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            type="text"
            id="inputSend"
            placeholder="Type a message.."
            ref={(sendInput) => sendInput && sendInput.focus()}
          />
          <IconButton onClick={sendMessage}>
            <SendButton type="submit" />
          </IconButton>
        </form>
      </div>
    </>
  );
};

export default Messages;
