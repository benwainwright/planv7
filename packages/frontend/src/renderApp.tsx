import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import Container from "@material-ui/core/Container";
import Theme from "./components/Theme";
import { ThemeProvider } from "@material-ui/core/styles";

const renderApp = (): void => {
  ReactDOM.hydrate(
    <Container maxWidth="md" className="App">
      <ThemeProvider theme={Theme}>
        <App />
      </ThemeProvider>
    </Container>,
    document.querySelector("#root")
  );
};

export default renderApp;
