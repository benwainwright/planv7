import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";

const renderApp = (): void => {
  ReactDOM.hydrate(
    <App compiler="Typescript" framework="React" />,
    document.querySelector("#root")
  );
};

export default renderApp;
