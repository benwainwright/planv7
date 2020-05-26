import * as React from "react";
import * as ReactDOM from "react-dom";

import { HANDLERS, getHandlerBinder } from "@planv7/application";
import App from "./components/App";
import { Container } from "inversify";
import { InversifyProvider } from "./utils/inversify-provider";
import Theme from "./components/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import bindDependencies from "./bootstrap/bindDependencies";
import initialisePublicKey from "./bootstrap/initialisePublicKey";
import initialiseLogger from "./bootstrap/initialiserLogger";

const renderApp = (): void => {
  const container = new Container();
  const key = initialisePublicKey();
  const logger = initialiseLogger(container);
  logger.info("Loading client application");

  logger.info("Binding dependencies");
  bindDependencies(container, key);

  logger.info("Binding handlers");
  getHandlerBinder(container, HANDLERS);

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
