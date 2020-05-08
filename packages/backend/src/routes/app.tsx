import * as React from "react";
import ReactDOMServer from "react-dom/server";

import indexTemplateLoader from "../application/indexTemplateLoader";
import Router, { RouterContext } from "koa-router";

const APP_BASE_URL = "app";

const app = () => {
  const router = new Router();

  const baseUrlRegex = new RegExp(`/\\/${APP_BASE_URL}($|\\/.*)/`, "u");

  router.get(baseUrlRegex, async (context: RouterContext, next: Next) => {
    const reactApp = ReactDOMServer.renderToString();
  });
};

export default app;
