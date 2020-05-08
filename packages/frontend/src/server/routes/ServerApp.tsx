import React from "react";
import App from "../../client/components/App";

import { StaticRouterProps } from "react-router";
import { StaticRouter } from "react-router-dom";

export const ServerApp: React.FC<StaticRouterProps> = properties => 
  <StaticRouter basename="/app" {...properties}>
    <App />
  </StaticRouter>
;
