import * as React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { navigate } from "@reach/router";

interface MenuListButtonProps {
  text: string;
  to: string;
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
    <ListItemText primary={props.text} />
  </ListItem>
);

export default DrawerItem;
