import { App } from "@planv7/frontend";
import React from "react";

import { StaticRouter } from "react-router-dom";
import { StaticRouterProps } from "react-router";

const ServerApp: React.FC<StaticRouterProps> = (props) => (
  <StaticRouter basename="/app" {...props}>
    <App compiler="Webpack" framework="React" />
  </StaticRouter>
);

export default ServerApp;
