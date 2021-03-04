import React, { useState, useEffect, useContext } from "react";
import ChatItem from "./ChatItem";

import "./ChatList.scss";
import NewChatIcon from "@material-ui/icons/Chat";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import ContactsDialog from "./ContactsDialog";
import { Auth } from "../../context/AuthContext";
import { auth } from "../../firebaseConfig";

import db from "../../firebaseConfig";

const ChatList = ({ setShowMessages, setRoom, toUserUid, setToUserUid }) => {
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContactValue, setSelectedContactValue] = useState();
  const { user } = useContext(Auth);
  const [contacts, setContacts] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (user) {
      //Get the chats
      const unsubscribe = db
        .collection("rooms")
        .doc(user.uid)
        .collection("userRooms")
        .orderBy("lastMessageAt", "desc")
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

  //Add a room to the collection (parameters: roomId, selected value from the contacts modal
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

    if (value) {
      let roomsIdFromFirebase = [];
      //Create the roomId with both uId
      let roomId =
        value.uid > user.uid ? value.uid + user.uid : user.uid + value.uid;

      await db
        .collection("rooms")
        .doc(user.uid)
        .collection("userRooms")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              roomsIdFromFirebase.push(doc.id);
            }
          });
        });

      //Check if the roomId already exists
      //If it is not then add a new room
      if (roomsIdFromFirebase.includes(roomId)) {
        setRoom(roomId);

        //Show chat container with chat messages
        showChatMessages(true);

        //Set activeId for the active class
        setActiveId(roomId);
        //Set user used for DELETE ROOMS OBJECT FROM CONTACTS COLLECTION
        setToUserUid(value.uid);
      } else {
        setRoom(roomId);

        //Add room obj in the users document
        addUserRoom(roomId, value);

        //Add room obj in the contacts document
        addContactRoom(roomId, value);

        //Add chat room
        addRoom(roomId, value);

        //Show chat container with chat messages
        showChatMessages(true);
        //Set activeId for the active class
        setActiveId(roomId);
        //Set user used for DELETE ROOMS OBJECT FROM CONTACTS COLLECTION
        setToUserUid(value.uid);
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
          <Tooltip title="Start a new conversation">
            <IconButton onClick={handleClickOpen}>
              <NewChatIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sign Out">
            <IconButton onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
        <ContactsDialog
          selectedContactValue={selectedContactValue}
          open={open}
          onClose={handleClose}
          contacts={contacts}
        />
      </div>

      <div id="chats-list">
        {chats.length === 0 ? (
          <h2>There is no chat conversations. Start adding one!</h2>
        ) : (
          chats.map((room, index) =>
            room.lastMessage ? (
              <ChatItem
                key={index}
                roomId={Object.keys(room.rooms)[0]}
                name={room.name}
                lastMessage={room.lastMessage}
                lastMessageAt={room.lastMessageAt}
                showChatMessages={showChatMessages}
                setRoom={setRoom}
                toUserUid={room.uid}
                setToUserUid={setToUserUid}
                setActiveId={setActiveId}
                activeId={activeId}
              />
            ) : (
              ""
            )
          )
        )}
      </div>
    </>
  );
};

export default ChatList;
