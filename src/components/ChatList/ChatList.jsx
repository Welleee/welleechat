import React, { useState, useEffect, useContext } from "react";
import ChatItem from "./ChatItem";

import "./ChatList.scss";
import NewChatIcon from "@material-ui/icons/Chat";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import ContactsDialog from "./ContactsDialog";
import { Auth } from "../../context/AuthContext";
// import { useChatStore } from "../../context/ChatContext";
// import { useChatDispatch } from "../../context/ChatContext";
import { useUiDispatch } from "../../context/uiContex";
import { auth } from "../../firebaseConfig";

import db from "../../firebaseConfig";

const ChatList = ({ setShowMessages, setRoom, toUserUid, setToUserUid }) => {
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContactValue, setSelectedContactValue] = useState();
  const { user } = useContext(Auth);
  const [contacts, setContacts] = useState([]);
  // const { userRooms } = useChatStore();
  const uiDispatch = useUiDispatch();

  useEffect(() => {
    if (user) {
      //Get the chats
      const unsubscribe = db
        .collection("rooms")
        .doc(user.uid)
        .collection("userRooms")
        .onSnapshot((snapshot) => {
          setChats(snapshot.docs.map((doc) => doc.data()));
        });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  //Contacts dialog
  const handleClickOpen = () => {
    setOpen(true);

    //Get user's contacts
    db.collection("contacts")
      .doc(user.uid)
      .collection("userContacts")
      .get()
      .then((snapshot) => {
        setContacts(snapshot.docs.map((doc) => doc.data()));
      });
  };

  const addUserRoom = (roomId, value) => {
    //FROM USER
    db.collection("users")
      .doc(user.uid)
      .update({
        rooms: {
          [roomId]: true,
        },
      });

    //TO USER
    db.collection("users")
      .doc(value.uid)
      .update({
        rooms: {
          [roomId]: true,
        },
      });
  };

  const addContactRoom = (roomId, value) => {
    //FROM USER
    db.collection("contacts")
      .doc(user.uid)
      .collection("userContacts")
      .doc(value.uid)
      .update({
        rooms: {
          [roomId]: true,
        },
      });

    //TO USER
    db.collection("contacts")
      .doc(value.uid)
      .collection("userContacts")
      .doc(user.uid)
      .update({
        rooms: {
          [roomId]: true,
        },
      });
  };

  const addRoom = (roomId, value) => {
    //FROM USER
    db.collection("rooms")
      .doc(user.uid)
      .collection("userRooms")
      .doc(roomId)
      .set({
        uid: value.uid,
        name: value.name,
        rooms: {
          [roomId]: true,
        },
      });

    //TO USER
    db.collection("rooms")
      .doc(value.uid)
      .collection("userRooms")
      .doc(roomId)
      .set({
        uid: user.uid,
        name: user.displayName,
        rooms: {
          [roomId]: true,
        },
      });
  };

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedContactValue(value);
    // console.log(value);

    if (value) {
      let roomIdFromFirebase = "";
      let exists = false;
      //Create the roomId with both uId
      let roomId =
        value.uid > user.uid ? value.uid + user.uid : user.uid + value.uid;

      await db
        .collection("rooms")
        .doc(user.uid)
        .collection("userRooms")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.exists) {
            exists = true;
            querySnapshot.forEach((doc) => {
              roomIdFromFirebase = doc.id;
            });
          }
        });

      //If the room collection exists
      if (exists) {
        //Check if the roomId already exists
        //If it is not then add a new room
        if (roomIdFromFirebase !== roomId) {
          setRoom(roomId);

          //Add room obj in the users document
          addUserRoom(roomId, value);

          //Add room obj in the contacts document
          addContactRoom(roomId, value);

          //Add chat room
          addRoom(roomId, value);

          showChatMessages(true);
        }
      } else {
        setRoom(roomId);

        //Add room obj in the users document
        addUserRoom(roomId, value);

        //Add room obj in the contacts document
        addContactRoom(roomId, value);

        //Add chat room
        addRoom(roomId, value);

        showChatMessages(true);
      }
    }
  };

  const showChatMessages = () => {
    setShowMessages(true);
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <>
      <div id="profile-container">
        {/* <input type="text" placeholder="Search conversation" /> */}
        <Avatar />
        <div className="icons">
          <IconButton onClick={handleClickOpen}>
            <NewChatIcon />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </div>
        <ContactsDialog
          selectedContactValue={selectedContactValue}
          open={open}
          onClose={handleClose}
          contacts={contacts}
        />
      </div>

      <div id="chats-list">
        {chats.map((room, index) => (
          <ChatItem
            key={index}
            roomId={Object.keys(room.rooms)[0]}
            name={room.name}
            showChatMessages={showChatMessages}
            setRoom={setRoom}
            toUserUid={room.uid}
            setToUserUid={setToUserUid}
          />
        ))}
      </div>
    </>
  );
};

export default ChatList;
