import * as constants from "./constants";
import * as http from "http";
import initialiseServer, { InitialisationResult } from "./initialiseServer";
import { Configuration } from "webpack";
import Koa from "koa";
import koaWebpack from "koa-webpack";

const configureServerHmr = (
  initialisationResult: InitialisationResult,
  koaWebpackMiddleware: Koa.Middleware
): void => {
  if (module.hot) {
    module.hot.accept("./initialiseServer", async () => {
      const app = initialisationResult.koaApp;
      const callback = app?.callback();
      const server = http.createServer(callback);
      if (callback) {
        server.removeListener("request", callback);
      }
      const reinitialiseServer = require("./initialiseServer").default;
      const newInitialisationResult = await reinitialiseServer();
      newInitialisationResult.koaApp.use(koaWebpackMiddleware);
      const newCallback = newInitialisationResult.koaApp.callback();
      server.on("request", newCallback);
    });
  }
};

const configureClientHmr = async (
  initialisationResult: InitialisationResult
): Promise<Koa.Middleware> => {
  /* eslint-disable @typescript-eslint/no-require-imports */
  /* eslint-disable @typescript-eslint/no-var-requires */
  const config: Configuration = require("../webpack/webpack.config.hmr.client");
  /* eslint-enable @typescript-eslint/no-var-requires */
  /* eslint-enable @typescript-eslint/no-require-imports */

  const options: koaWebpack.Options = {
    config,
  };

  const koaWebpackOutput = await koaWebpack(options);

  initialisationResult.koaApp?.use(koaWebpackOutput);
  initialisationResult.cleanupHandlers?.push(() => koaWebpackOutput.close());

  return koaWebpackOutput;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  try {
    const result = await initialiseServer();

    const server = await new Promise<http.Server>((resolve) => {
      resolve(result.koaApp?.listen(constants.SERVER_PORT));
    });

    result.cleanupHandlers?.forEach((handler) =>
      server.addListener("close", handler)
    );

    result.logger?.info(`Listening on port ${constants.SERVER_PORT}`);

    if (process.env.HOT_RELOADING && process.env.NODE_ENV !== "production") {
      const middleware = await configureClientHmr(result);
      configureServerHmr(result, middleware);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
})();
