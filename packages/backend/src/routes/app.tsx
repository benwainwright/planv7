import * as React from "react";
import {
  TYPES as APP,
  EventEmitterWrapper,
  HANDLERS,
  SimpleCommandBus,
  getHandlerBinder,
} from "@planv7/application";
import { App, InversifyProvider, Theme } from "@planv7/frontend";
import { CommandBus, TYPES as DOMAIN } from "@planv7/domain";
import Koa, { Next } from "koa";
import Router, { RouterContext } from "koa-router";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import AppContext from "../AppContext";
import { Container } from "inversify";
import ReactDOMServer from "react-dom/server";
import { ServerLocation } from "@reach/router";
import indexTemplateLoader from "../application/indexTemplateLoader";

const APP_BASE_URL = "app";

const app = async (
  container: Container
): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Koa.Middleware<any, any>
> => {
  const router = new Router<Koa.DefaultState, AppContext & RouterContext>();
  const getIndexTemplate = await indexTemplateLoader();
  const baseUrlRegex = new RegExp(`\\/${APP_BASE_URL}($|\\/.*)`, "u");

  router.get(
    baseUrlRegex,
    async (context: AppContext & RouterContext, next: Next) => {
      const binder = getHandlerBinder(container, HANDLERS);
      binder(container);

      const sheets = new ServerStyleSheets();
      const reactApp = ReactDOMServer.renderToString(
        sheets.collect(
          <ThemeProvider theme={Theme}>
            <InversifyProvider container={container}>
              <ServerLocation url={context.url}>
                <App />
              </ServerLocation>
            </InversifyProvider>
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
    }
  );

  router.get("/", async (context: RouterContext, next: Next) => {
    context.redirect("/app");
    await next();
  });

  return router.routes();
};

export default app;
