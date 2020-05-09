import * as React from "react";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "@reach/router";
import MenuIcon from "@material-ui/icons/Menu";
import NavigationButton from "./NavigationButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const RIGHT_MARGIN_SPACING = 2;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(RIGHT_MARGIN_SPACING),
  },

  title: {
    flexGrow: 1,
  },
}));

const Header: React.FC = (): React.ReactElement => {
  const classes = useStyles();
  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Planner App
          </Typography>

          <NavigationButton to="/app">Home</NavigationButton>
          <NavigationButton to="/app/register">Register</NavigationButton>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
