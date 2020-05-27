import {
  ApplicationError,
  Logger,
  Serialiser,
  getHandlerBinder,
} from "@planv7/application";
import {
  CommandBus,
  TYPES as DOMAIN,
  LoginCommand,
  RegisterUserCommand,
} from "@planv7/domain";
import Koa, { Next } from "koa";
import Router, { RouterContext } from "koa-router";
import AppContext from "../AppContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const auth = (logger: Logger, handlers: {}): Koa.Middleware<any, any> => {
  const router = new Router<Koa.DefaultState, AppContext & RouterContext>();
  router.post(
    "/auth",

    async (context: AppContext & RouterContext, next: Next): Promise<void> => {
      const handlerBinder = getHandlerBinder(context.container, handlers);
      handlerBinder(context.container);
      const serialiser = context.container.get<Serialiser>(Serialiser);

      try {
        const commandBus = context.container.get<CommandBus>(DOMAIN.commandBus);
        const command = serialiser.unSerialise(context.request.body);

        if (
          command instanceof LoginCommand ||
          command instanceof RegisterUserCommand
        ) {
          await commandBus.execute(command);
          if (context.authHeader && context.authHeader.getHeader()) {
            context.set(
              "authorization",
              `Bearer ${context.authHeader.getHeader()}`
            );
          }
          /* eslint-disable require-atomic-updates */
          context.response.status = 200;
          context.response.body = "Success!";
        } else {
          throw new ApplicationError(
            "Auth endpoint can only accept register and login commands"
          );
        }
      } catch (error) {
        context.response.status = 403;
        const errorBody = serialiser.serialise(error);
        context.response.body = errorBody || "failed :-(";
        /* eslint-enable require-atomic-updates */
      }
      await next();
    }
  );
  return router.routes();
};

export default auth;
