import * as React from "react";

import {
  CommandBus,
  TYPES as DOMAIN,
  LogoutCommand,
} from "@choirpractise/domain";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CurrentUserContext from "../utils/CurrentUserContext";

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

interface HeaderProps {
  children: React.ReactNode;
  title: string;
}

const Header: React.FC<HeaderProps> = (props): React.ReactElement => {
  const classes = useStyles();
  const currentUser = React.useContext(CurrentUserContext);
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const clickLogout = async (): Promise<void> => {
    await commandBus.execute(new LogoutCommand());
  };

  return (
    <header className="appBar">
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h1" className={classes.title}>
            {props.title}
          </Typography>
          {props.children}
          {currentUser && (
            <Button color="inherit" onClick={clickLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
