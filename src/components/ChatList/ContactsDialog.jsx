import React from "react";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";


const ContactsDialog = (props) => {
  const { onClose, selectedContactValue, open, contacts } = props;

  const handleClose = () => {
    onClose(selectedContactValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Select the contact</DialogTitle>
      <List>
        {contacts &&
          contacts.map((contact) => (
            <ListItem
              button
              onClick={() => handleListItemClick(contact)}
              key={contact.uid}
            >
              <ListItemAvatar>
                <Avatar className="">
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={contact.name} />
            </ListItem>
          ))}
      </List>
    </Dialog>
  );
};

export default ContactsDialog;
