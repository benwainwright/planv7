import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import { Container } from "inversify";
import { InversifyProvider } from "./utils/inversify-provider";
import Theme from "./components/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import bindDependencies from "./bootstrap/bindDependencies";
import initialisePublicKey from "./bootstrap/initialisePublicKey";

const renderApp = (): void => {
  const container = new Container();
  const key = initialisePublicKey();
  bindDependencies(container, key);

  ReactDOM.hydrate(
    <ThemeProvider theme={Theme}>
      <InversifyProvider container={container}>
        <App />
      </InversifyProvider>
    </ThemeProvider>,
    document.querySelector("#root")
  );
};

export default renderApp;
