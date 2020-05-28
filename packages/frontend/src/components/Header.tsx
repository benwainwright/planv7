import * as React from "react";

import { CommandBus, TYPES as DOMAIN, LogoutCommand } from "@planv7/domain";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CurrentUserContext from "../utils/CurrentUserContext";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import NavigationButton from "./NavigationButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useDependency } from "../utils/inversify-provider";

const RIGHT_MARGIN_SPACING = 2;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "2rem",
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
  const currentUser = React.useContext(CurrentUserContext);
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const clickLogout = async (): Promise<void> => {
    await commandBus.execute(new LogoutCommand());
  };

  return (
    <header>
      <AppBar className={classes.root} position="static">
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
          {!currentUser && (
            <NavigationButton to="/app/register">Register</NavigationButton>
          )}
          {!currentUser && (
            <NavigationButton to="/app/login">Login</NavigationButton>
          )}
          {currentUser && <Button onClick={clickLogout}>Logout</Button>}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
