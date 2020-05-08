import { AuthEndpoint , AuthorisingDispatcher ,
  JwtClientLoginSession,
  TEST_PUBLIC_KEY,
  WebsocketClient,
  WinstonConfig,
  WinstonLogger
} from "@planv5/framework";
import { API_URL, APP_WEBSOCKET_PATH } from "../constants";
import { Container } from "inversify";
import "reflect-metadata";
import {
  APP_TYPES,
  CurrentLoginSession,
  Dispatch
, Logger, LoginSessionDestroyer } from "@planv5/application/ports";
import { DOMAIN_TYPES, DomainError, Serialiser } from "@planv5/domain";

import { ApplicationError } from "@planv5/application/errors";

import * as commands from "@planv5/domain/commands";
import * as events from "@planv5/domain/events";
import * as entities from "@planv5/domain/entities";
import { FRAMEWORK_TYPES } from "@planv5/framework/types";
import { EventEmitterWrapper, SimpleCommandBus , container as initialContainer } from "@planv5/application";
import { CommandBus } from "@planv5/domain/ports";

import { format, transports } from "winston";


export const initInjection = async (
  container?: Container
): Promise<Container> => {
  container = container || initialContainer;
  container
    .bind<Logger>(APP_TYPES.Logger)
    .to(WinstonLogger)
    .inSingletonScope();

  container
    .bind<CurrentLoginSession & LoginSessionDestroyer>(
      APP_TYPES.CurrentLoginSession
    )
    .to(JwtClientLoginSession)
    .inSingletonScope();

  container
    .bind<LoginSessionDestroyer>(APP_TYPES.LoginSessionDestroyer)
    .toService(APP_TYPES.CurrentLoginSession);

  const loggingConfig = new WinstonConfig(process.env.APP_LOG_LEVEL || "info", [
    new transports.Console({
      format: format.simple()
    })
  ]);

  container.bind<WinstonConfig>(WinstonConfig).toConstantValue(loggingConfig);

  let jwtPublicKey = process.env.JWT_PUBLIC_KEY;

  if (!jwtPublicKey && process.env.NODE_ENV === "production") {
    throw new Error(`Must specify JWT_PUBLIC_KEY on production build`);
  } else {
    jwtPublicKey = TEST_PUBLIC_KEY;
  }

  container
    .bind<string>(FRAMEWORK_TYPES.JwtPublicKey)
    .toConstantValue(jwtPublicKey);

  const serialiseableConstructors = {
    ...commands,
    ...events,
    ...entities,
    DomainError,
    ApplicationError
  };

  container
    .bind<Serialiser>(Serialiser)
    .toConstantValue(new Serialiser(serialiseableConstructors));

  container
    .bind<WebsocketClient>(FRAMEWORK_TYPES.WebsocketClient)
    .to(WebsocketClient)
    .inSingletonScope();

  container.bind<Dispatch>(APP_TYPES.Dispatch).to(AuthorisingDispatcher);

  container
    .bind<string>(FRAMEWORK_TYPES.AppWebsocketUrl)
    .toConstantValue(APP_WEBSOCKET_PATH);

  container.bind<string>(AuthEndpoint).toConstantValue("http://localhost/auth");

  container
    .bind<EventEmitterWrapper>(APP_TYPES.EventEmitterWrapper)
    .to(EventEmitterWrapper)
    .inSingletonScope();

  container
    .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
    .to(SimpleCommandBus)
    .inSingletonScope();

  return container;
};
