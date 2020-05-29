import * as React from "react";
import * as ReactDOM from "react-dom";

import { HANDLERS, getHandlerBinder } from "@planv7/application";
import ClientRootComponent from "./components/ClientRootComponent";
import { Container } from "inversify";
import { InversifyProvider } from "./utils/inversify-provider";
import Theme from "./components/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import bindDependencies from "./bootstrap/bindDependencies";
import initialiseLogger from "./bootstrap/initialiseLogger";
import initialisePublicKey from "./bootstrap/initialisePublicKey";

const bootstrapContainer = (): Container => {
  const container = new Container();

  const key = initialisePublicKey();
  const logger = initialiseLogger(container);
  logger.info("Logger initialised");
  logger.info("Loading client application");

  logger.info("Binding dependencies");
  bindDependencies(container, key);

  logger.info("Binding handlers");
  const binder = getHandlerBinder(container, HANDLERS);
  binder(container);
  return container;
};

const renderApp = (): void => {
  const container = bootstrapContainer();
  ReactDOM.hydrate(
    <ThemeProvider theme={Theme}>
      <InversifyProvider container={container}>
        <ClientRootComponent />
      </InversifyProvider>
    </ThemeProvider>,
    document.querySelector("#root")
  );
};

export default renderApp;
