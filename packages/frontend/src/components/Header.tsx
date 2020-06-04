import * as React from "react";

import {
  CommandBus,
  TYPES as DOMAIN,
  LogoutCommand,
} from "@choirpractise/domain";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CurrentUserContext from "../utils/CurrentUserContext";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useDependency } from "../utils/inversify-provider";

const RIGHT_MARGIN_SPACING = 2;

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(RIGHT_MARGIN_SPACING),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  title: {
    flexGrow: 1,
  },
}));

interface HeaderProps {
  title: string;
  className?: string;
  onExpandHeaderClick: () => void;
}

const Header: React.FC<HeaderProps> = (props): React.ReactElement => {
  const classes = useStyles();
  const currentUser = React.useContext(CurrentUserContext);
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const clickLogout = async (): Promise<void> => {
    await commandBus.execute(new LogoutCommand());
  };

  return (
    <AppBar className={`${props.className} appBar`} position="fixed">
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          onClick={props.onExpandHeaderClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h1" className={classes.title}>
          {props.title}
        </Typography>
        {currentUser && (
          <Button color="inherit" onClick={clickLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
