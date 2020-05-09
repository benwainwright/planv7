import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./Header";
import Home from "../pages/Home";
import Register from "../pages/Register";
import { Router } from "@reach/router";

const App: React.FC = (): React.ReactElement => {
  React.useEffect(() => {
    const cssStyles = document.querySelector("#css-server-side");
    if (cssStyles) {
      cssStyles.remove();
    }
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />
      <main>
        <Router>
          <Home path="/app" />
          <Register path="/app/register" />
        </Router>
      </main>
    </React.Fragment>
  );
};

export default App;
