import * as React from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DomainEvent } from "@choirpractise/domain";
import { EventEmitterWrapper } from "@choirpractise/application";
import Files from "../pages/Files";
import Header from "./Header";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProtectedRouter from "./ProtectedRouter";
import Register from "../pages/Register";
import SnackBar from "@material-ui/core/Snackbar";
import { hot } from "react-hot-loader/root";
import { useDependency } from "../utils/inversify-provider";

const Alert = (props: AlertProps): React.ReactElement => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const RawApp: React.FC = (): React.ReactElement => {
  const [alertText, setAlertText] = React.useState("");
  const [success, setSuccess] = React.useState(true);
  const events = useDependency(EventEmitterWrapper);

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

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />
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
        <main>
          <ProtectedRouter>
            <Home public path="/app" />
            <Register public path="/app/register" />
            <Login public path="/app/login" />
            <Files path="/app/files" />
            <NotFound public default path="/not-found" />
          </ProtectedRouter>
        </main>
      </Container>
    </React.Fragment>
  );
};

const App = hot(RawApp);

export default App;
