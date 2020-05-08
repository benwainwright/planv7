import { PRODUCTION_MODE_STRING } from "../constants";
import Koa, { Context, Next } from "koa";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import Router, { RouterContext } from "koa-router";
import { ServerApp } from "./ServerApp";
import { InversifyProvider } from "../../client/components/utils/InversifyProvider";
import { CurrentUserContext } from "../../client/components/utils/CurrentUserContext";

import { indexTemplateLoader } from "../indexTemplate";

const reactCdnPath =
  process.env.NODE_ENV === PRODUCTION_MODE_STRING
    ? "https://unpkg.com/react@16/umd/react.production.min.js"
    : "https://unpkg.com/react@16/umd/react.development.js";

const reactDomCdnPath =
  process.env.NODE_ENV === PRODUCTION_MODE_STRING
    ? "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
    : "https://unpkg.com/react-dom@16/umd/react-dom.development.js";

const fontAwesomeCdnPath =
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

const getIndexTemplate = indexTemplateLoader(
  [reactCdnPath, reactDomCdnPath],
  [fontAwesomeCdnPath]
);

import { DOMAIN_TYPES } from "@planv5/domain";
import { CommandBus } from "@planv5/domain/ports";
import {
  APP_TYPES,
  CurrentLoginSession,
  EventEmitterWrapper
} from "@planv5/application/ports";

import { SimpleCommandBus, getHandlerBinder } from "@planv5/application";

export const configureAppRoute = async (handlers: {}) => {
  const router = new Router();
  router.get(/\/app($|\/.*)/, async (context: RouterContext, next: Next) => {
    context.container
      .bind<EventEmitterWrapper>(APP_TYPES.EventEmitterWrapper)
      .to(EventEmitterWrapper)
      .inSingletonScope();

    context.container
      .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
      .to(SimpleCommandBus)
      .inSingletonScope();

    const handlerBinder = getHandlerBinder(context.container, handlers);
    handlerBinder(context.container);

    const session = context.container.get<CurrentLoginSession>(
      APP_TYPES.CurrentLoginSession
    );

    const currentUser = await session.getCurrentUser();
    context.set("Content-Type", "text/html");

    const routerContext: {} = {};
    const app = ReactDOMServer.renderToString(
      <CurrentUserContext.Provider value={currentUser}>
        <InversifyProvider container={context.container}>
          <ServerApp
            basename="/app"
            location={context.url}
            context={routerContext}
          />
        </InversifyProvider>
      </CurrentUserContext.Provider>
    );

    const indexFile = await getIndexTemplate();

    const renderedPage = indexFile.replace(
      '<div id="root"></div>',
      `<div id="root">${app}</div>`
    );

    context.body = renderedPage;
    await next();
  });

  router.get("/", async (context: RouterContext, next: Next) => {
    context.redirect("/app");
    await next();
  });

  return router.routes();
};
