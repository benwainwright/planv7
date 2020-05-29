import * as React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./Header";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Router } from "@reach/router";
import { hot } from "react-hot-loader/root";

const RawApp: React.FC = (): React.ReactElement => {
  React.useEffect(() => {
    const cssStyles = document.querySelector("#css-server-side");
    if (cssStyles) {
      cssStyles.remove();
    }
  });

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

const App = hot(RawApp);

export default App;
