import * as React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { navigate } from "@reach/router";

interface MenuListButtonProps {
  text: string;
  to: string;
  icon: React.ReactElement
}

const DrawerItem: React.FC<MenuListButtonProps> = (props) => (
  <ListItem
    button
    key={props.text}
    onClick={async (): Promise<void> => {
      await navigate(props.to);
    }}
    color="inherit"
  >
    <ListItemIcon>{props.icon}</ListItemIcon>
    <ListItemText primary={props.text} />
  </ListItem>
);

export default DrawerItem;
