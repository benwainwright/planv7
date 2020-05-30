import * as Domain from "@choirpractise/domain";
import * as constants from "../constants";

import {
  TYPES as APP,
  CurrentLoginSession,
  Dispatch,
  EventEmitterWrapper,
  LoginSessionDestroyer,
  Serialiser,
  SimpleCommandBus,
} from "@choirpractise/application";

import {
  AuthorisingDispatcher,
  TYPES as FRAMEWORK,
  JwtClientLoginSession,
  WebsocketClient,
} from "@choirpractise/framework";

import { Container } from "inversify";

const bindDependencies = (container: Container, publicKey: string): void => {
  container
    .bind<CurrentLoginSession & LoginSessionDestroyer>(APP.currentLoginSession)
    .to(JwtClientLoginSession)
    .inSingletonScope();

  container
    .bind<LoginSessionDestroyer>(APP.loginSessionDestroyer)
    .toService(APP.currentLoginSession);

  container
    .bind<Serialiser>(Serialiser)
    .toConstantValue(new Serialiser(Domain));

  container
    .bind<EventEmitterWrapper>(EventEmitterWrapper)
    .to(EventEmitterWrapper)
    .inSingletonScope();

  container
    .bind<string>(FRAMEWORK.appWebsocketUrl)
    .toConstantValue(constants.APP_WEBSOCKET_PATH);

  container.bind<Dispatch>(APP.dispatch).to(AuthorisingDispatcher);

  container
    .bind<string>(FRAMEWORK.authEndpoint)
    .toConstantValue(constants.AUTH_ENDPOINT);

  container
    .bind<WebsocketClient>(FRAMEWORK.websocketClient)
    .to(WebsocketClient)
    .inSingletonScope();

  container.bind<string>(FRAMEWORK.jwtPublicKey).toConstantValue(publicKey);

  container
    .bind<Domain.CommandBus>(Domain.TYPES.commandBus)
    .to(SimpleCommandBus)
    .inSingletonScope();
};

export default bindDependencies;
