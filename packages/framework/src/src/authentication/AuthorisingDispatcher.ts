import { CommandOutcome , Serialiser } from "@planv5/domain";
import { inject, injectable } from "inversify";
import axios from "axios";

import { FRAMEWORK_TYPES } from "../../types";
import { WebsocketClient } from "../WebsocketClient";
import {
  APP_TYPES,
  CurrentLoginSession,
  Dispatch,
  EventEmitterWrapper
} from "@planv5/application/ports";
import { UserLoginStateChangeEvent } from "@planv5/domain/events";
import { Command } from "@planv5/domain/ports";

export const AuthEndpoint = Symbol("AuthEndpoint");

@injectable()
export class AuthorisingDispatcher implements Dispatch {
  private webSocketClient: WebsocketClient;
  private serialiser: Serialiser;
  private userSession: CurrentLoginSession;
  private authEndpoint: string;
  private events: EventEmitterWrapper;

  public constructor(
    @inject(FRAMEWORK_TYPES.WebsocketClient) webSocketClient: WebsocketClient,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(APP_TYPES.CurrentLoginSession)
    session: CurrentLoginSession,

    @inject(AuthEndpoint)
    endpoint: string,

    @inject(APP_TYPES.EventEmitterWrapper)
    events: EventEmitterWrapper
  ) {
    this.webSocketClient = webSocketClient;
    this.serialiser = serialiser;
    this.userSession = session;
    this.authEndpoint = endpoint;
    this.events = events;
  }

  public async dispatch(command: Command): Promise<void> {
    const user = this.userSession.getCurrentUser();

    if (user) {
      await this.webSocketClient.dispatch(command);
    } else {
      const toSend = this.serialiser.serialise(command);

      try {
        const response = await axios({
          method: "POST",
          url: this.authEndpoint,
          headers: { "Content-Type": "application/json" },
          data: toSend
        });

        this.userSession.setCurrentUserFromHttpResponse(response);
        this.events.emitEvent(
          new UserLoginStateChangeEvent(
            CommandOutcome.SUCCESS,
            this.userSession.getCurrentUser()
          )
        );
      } catch(error) {
        const data = typeof error.response.data !== 'string'? JSON.stringify(error.response.data) : error.response.data;
        const receivedError = this.serialiser.unSerialise(data);
        if(receivedError && receivedError instanceof Error) {
          this.events.emitError(receivedError);
        }
      }
    }
  }
}
