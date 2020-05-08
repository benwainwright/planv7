import * as React from "react";
import * as ReactDOM from "react-dom";
import { InversifyProvider } from "./components/utils/InversifyProvider";
import { initInjection } from "../injection/configureInjectionForClient";
import { ClientApp } from "./components/ClientApp";

const initReact = async (): Promise<void> => {
  const container = await initInjection();

  ReactDOM.render(
    <InversifyProvider container={container}>
      <ClientApp />
    </InversifyProvider>,
    document.querySelector("#root")
  );
};

initReact();
