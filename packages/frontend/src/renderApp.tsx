import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import { Container } from "inversify";
import Theme from "./components/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import bindDependencies from "./bootstrap/bindDependencies";
import initialisePublicKey from "./bootstrap/initialisePublicKey";

const renderApp = async (): Promise<void> => {
  const container = new Container();
  const key = initialisePublicKey();
  await bindDependencies(container, key);

  ReactDOM.hydrate(
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>,
    document.querySelector("#root")
  );
};

export default renderApp;
