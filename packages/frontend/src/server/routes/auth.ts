import { Next } from "koa";
import Router, { RouterContext } from "koa-router";
import { DOMAIN_TYPES , Serialiser } from "@planv5/domain";
import { LoginCommand, RegisterUserCommand } from "@planv5/domain/commands";
import { APP_TYPES, EventEmitterWrapper , Logger } from "@planv5/application/ports";
import { ApplicationError } from "@planv5/application/errors";
import { CommandBus } from "@planv5/domain/ports";

import { SimpleCommandBus, getHandlerBinder } from "@planv5/application";


export const auth = (logger: Logger, handlers: {}) => {
  const router = new Router();
  router.post(
    "/auth",

    async (context: RouterContext, next: Next): Promise<void> => {
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
      const serialiser = context.container.get<Serialiser>(Serialiser);

      try {
        const commandBus = context.container.get<CommandBus>(
          DOMAIN_TYPES.CommandBus
        );

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
          context.response.status = 200;
          context.response.body = "Success!";
        } else {
          throw new ApplicationError("Auth endpoint can only accept register and login commands");
        }
      } catch (error) {
        context.response.status = 403;
        const errorBody = serialiser.serialise(error);
        context.response.body = errorBody || "failed :-(";
      }
    }
  );
  return router.routes();
};
