import * as React from "react";
import {
  TYPES as APP,
  CurrentLoginSession,
  EventEmitterWrapper,
} from "@planv7/application";
import { User, UserLoginStateChangeEvent } from "@planv7/domain";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import CurrentUserContext from "../utils/CurrentUserContext";
import Header from "./Header";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Router } from "@reach/router";
import { useDependency } from "../utils/inversify-provider";

const App: React.FC = (): React.ReactElement => {
  const session = useDependency<CurrentLoginSession>(APP.currentLoginSession);
  const events = useDependency<EventEmitterWrapper>(APP.eventEmitterWrapper);
  const [user, setUser] = React.useState<User | undefined>(
    session.getCurrentUser()
  );

  React.useEffect(() => {
    events.onEvent((event) => {
      if (event instanceof UserLoginStateChangeEvent) {
        setUser(event.getUser());
      }
    });

    const cssStyles = document.querySelector("#css-server-side");
    if (cssStyles) {
      cssStyles.remove();
    }
  });

  return (
    <CurrentUserContext.Provider value={user}>
      <CssBaseline />
      <Header />
      <Container>
        <main>
          <Router>
            <Home path="/app" />
            <Register path="/app/register" />
            <Login path="/app/login" />
          </Router>
        </main>
      </Container>
    </CurrentUserContext.Provider>
  );
};

export default App;
