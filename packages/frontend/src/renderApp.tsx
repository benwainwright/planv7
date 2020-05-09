import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import Theme from "./components/Theme";
import { ThemeProvider } from "@material-ui/core/styles";

const renderApp = (): void => {
  ReactDOM.hydrate(
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>,
    document.querySelector("#root")
  );
};

export default renderApp;
