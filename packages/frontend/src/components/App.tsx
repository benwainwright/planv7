import * as React from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ProtectedRouter, Routes } from "./ProtectedRouter";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import DescriptionIcon from "@material-ui/icons/Description";
import { DomainEvent } from "@choirpractise/domain";
import Drawer from "./Drawer";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import { EventEmitterWrapper } from "@choirpractise/application";
import Files from "../pages/Files";
import Header from "./Header";
import Home from "../pages/Home";
import HomeIcon from "@material-ui/icons/Home";
import Login from "../pages/Login";
import Redirect from "../utils/Redirect";
import Register from "../pages/Register";
import SnackBar from "@material-ui/core/Snackbar";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { hot } from "react-hot-loader/root";
import { makeStyles } from "@material-ui/core/styles";
import { useDependency } from "../utils/inversify-provider";

const Alert = (props: AlertProps): React.ReactElement => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  header: {
    zIndex: 1000,
  },
  content: {
    flexGrow: 1,
    marginTop: "6rem",
  },
}));

const RawApp: React.FC = (): React.ReactElement => {
  const [alertText, setAlertText] = React.useState("");
  const [success, setSuccess] = React.useState(true);
  const events = useDependency(EventEmitterWrapper);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    events.onError((error: Error) => {
      setAlertText(error.message);
      setSuccess(false);
    });

    events.onEvent((event: DomainEvent) => {
      const message = event.getUserMessage();
      if (message) {
        setAlertText(message);
        setSuccess(true);
      }
    });

    const cssStyles = document.querySelector("#css-server-side");
    if (cssStyles) {
      cssStyles.remove();
    }
  });

  const handleClose = (): void => {
    setAlertText("");
  };

  const classes = useStyles();

  const handleToggleDrawer = (): void => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <section className={classes.root}>
      <ProtectedRouter>
        <CssBaseline />
        <Drawer onClose={handleToggleDrawer} mobileOpen={mobileOpen}>
          <div>Placeholder</div>
        </Drawer>
        <Header
          onExpandHeaderClick={handleToggleDrawer}
          className={classes.header}
          title="Choirpractise"
        />
        <SnackBar
          className="alert"
          autoHideDuration={3000}
          open={Boolean(alertText)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleClose}
        >
          <Alert
            role="alert"
            severity={success ? "success" : "error"}
            onClose={handleClose}
          >
            {alertText}
          </Alert>
        </SnackBar>
        <Container>
          <main className={classes.content}>
            <Routes>
              <Home
                public
                icon={<HomeIcon />}
                title="Choirpractise"
                path="/app"
              />
              <Register
                onlyPublic
                icon={<EmojiPeopleIcon />}
                title="Register"
                path="/app/register"
              />
              <Login
                icon={<VpnKeyIcon />}
                onlyPublic
                title="Login"
                path="/app/login"
              />
              <Files
                icon={<DescriptionIcon />}
                title="Files"
                path="/app/files"
              />
              <Redirect public default to="/app" />
            </Routes>
          </main>
        </Container>
      </ProtectedRouter>
    </section>
  );
};

const App = hot(RawApp);

export default App;
