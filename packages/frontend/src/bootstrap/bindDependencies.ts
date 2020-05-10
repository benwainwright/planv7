import * as Domain from "@planv7/domain";
import * as constants from "../constants";

import {
  TYPES as APP,
  CurrentLoginSession,
  Dispatch,
  EventEmitterWrapper,
  LoginSessionDestroyer,
  Serialiser,
} from "@planv7/application";

import {
  AuthorisingDispatcher,
  TYPES as FRAMEWORK,
  JwtClientLoginSession,
  WebsocketClient,
} from "@planv7/framework";

import { Container } from "inversify";

const bindDependencies = async (
  container: Container,
  publicKey: string
): Promise<void> => {
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
    .bind<EventEmitterWrapper>(APP.eventEmitterWrapper)
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
};

export default bindDependencies;
