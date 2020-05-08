import * as React from "react";
import Koa, { Next } from "koa";
import Router, { RouterContext } from "koa-router";
import { App } from "@planv7/frontend";
import ReactDOMServer from "react-dom/server";
import indexTemplateLoader from "../application/indexTemplateLoader";

const APP_BASE_URL = "app";

const app = async (): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Koa.Middleware<any, Router.IRouterParamContext<any, {}>>
> => {
  const router = new Router();
  const getIndexTemplate = await indexTemplateLoader();
  const baseUrlRegex = new RegExp(`\\/${APP_BASE_URL}($|\\/.*)`, "u");

  router.get(baseUrlRegex, async (context: RouterContext, next: Next) => {
    const reactApp = ReactDOMServer.renderToString(
      <App compiler="Typescript" framework="React" />
    );

    const indexTemplate = getIndexTemplate();

    const renderedPage = indexTemplate.replace(
      '<div id="root"></div>',
      `<div id="root">${reactApp}</div>`
    );

    context.set("Content-Type", " text/html");
    context.body = renderedPage;

    await next();
  });

  router.get("/", async (context: RouterContext, next: Next) => {
    context.redirect("/app");
    await next();
  });

  return router.routes();
};

export default app;
