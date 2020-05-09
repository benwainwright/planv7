import * as React from "react";
import { App, Theme } from "@planv7/frontend";
import Koa, { Next } from "koa";
import Router, { RouterContext } from "koa-router";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import ReactDOMServer from "react-dom/server";
import { ServerLocation } from "@reach/router";
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
    const sheets = new ServerStyleSheets();
    const reactApp = ReactDOMServer.renderToString(
      sheets.collect(
        <ThemeProvider theme={Theme}>
          <ServerLocation url={context.url}>
            <App />
          </ServerLocation>
        </ThemeProvider>
      )
    );

    const indexTemplate = getIndexTemplate();

    const renderedPage = indexTemplate
      .replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
      .replace(
        '<style id="css-server-side"></style>',
        `<style id="css-server-side">${sheets.toString()}</style>`
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
