import React from "react";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

const ContactsDialog = (props) => {
  const { onClose, selectedContactValue, open, contacts } = props;

  const handleClose = () => {
    onClose(selectedContactValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select the contact</DialogTitle>
      <List>
        {contacts.length !== 0 ? (
          contacts.map((contact) => (
            <ListItem
              button
              onClick={() => handleListItemClick(contact)}
              key={contact.uid}
            >
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={contact.name} />
            </ListItem>
          ))
        ) : (
          <h4 style={{ textAlign: "center" }}>No contacts</h4>
        )}
      </List>
    </Dialog>
  );
};

export default ContactsDialog;
