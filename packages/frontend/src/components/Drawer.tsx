import * as React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { DRAWER_WIDTH } from "../constants";
import Divider from "@material-ui/core/Divider";
import MuiDrawer from "@material-ui/core/Drawer";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    zIndex: 1,
    width: DRAWER_WIDTH,
    backgroundColor: theme.palette.background.paper
  },
}));

interface DrawerProps {
  mobileOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  width?: string;
}

const Drawer: React.FC<DrawerProps> = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <nav className={`${classes.drawer} drawer`}>
      <MuiDrawer
      elevation={2}
        classes={{ paper: classes.drawerPaper }}
        variant={isDesktop ? "permanent" : "temporary"}
        anchor="left"
        onClose={props.onClose}
        open={isDesktop ? true : props.mobileOpen}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className={classes.toolbar} />
        <Divider />
        {props.children}
      </MuiDrawer>
    </nav>
  );
};

export default Drawer;
