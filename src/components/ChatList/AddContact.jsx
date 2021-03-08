import React, { useEffect, useState, useContext } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from '@material-ui/core/Button'

const AddContact = ({ onClose, open, users, handleToggle, handleClose, checked, addContact }) => {
  

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select the contacts to add</DialogTitle>
      <List dense>
        {users.length !== 0 ? (
          users.map((user) => (
            <ListItem key={user.uid}>
              <ListItemAvatar>
                <Avatar alt="" src="" />
              </ListItemAvatar>
              <ListItemText primary={user.name} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  onChange={handleToggle(user)}
                  checked={checked.indexOf(user) !== -1}
                  //   inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))
          
        ) : (
          <h4 style={{ textAlign: "center" }}>No users</h4>
        )}
      </List>
      <Button onClick={addContact} variant="contained" color="primary" style={{ margin: '10px'}}>Add Contact</Button>
    </Dialog>
  );
};

export default AddContact;
