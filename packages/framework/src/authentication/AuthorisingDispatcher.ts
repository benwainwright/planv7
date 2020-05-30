import {
  TYPES as APP,
  CurrentLoginSession,
  Dispatch,
  EventEmitterWrapper,
  Serialiser,
} from "@choirpractise/application";
import {
  Command,
  CommandOutcome,
  UserLoginStateChangeEvent,
} from "@choirpractise/domain";
import { inject, injectable } from "inversify";

import TYPES from "../TYPES";
import WebsocketClient from "../WebsocketClient";
import axios from "axios";

@injectable()
export default class AuthorisingDispatcher implements Dispatch {
  private webSocketClient: WebsocketClient;
  private serialiser: Serialiser;
  private userSession: CurrentLoginSession;
  private authEndpoint: string;
  private events: EventEmitterWrapper;

  public constructor(
    @inject(TYPES.websocketClient) webSocketClient: WebsocketClient,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(APP.currentLoginSession)
    session: CurrentLoginSession,

    @inject(TYPES.authEndpoint)
    endpoint: string,

    @inject(EventEmitterWrapper)
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
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { "Content-Type": "application/json" },
          data: toSend,
        });

        this.userSession.setCurrentUserFromHttpResponse(response);
        this.events.emitEvent(
          new UserLoginStateChangeEvent(
            CommandOutcome.SUCCESS,
            this.userSession.getCurrentUser()
          )
        );
      } catch (error) {
        const data =
          typeof error.response.data !== "string"
            ? JSON.stringify(error.response.data)
            : error.response.data;
        const receivedError = this.serialiser.unSerialise(data);
        if (receivedError instanceof Error) {
          this.events.emitError(receivedError);
        }
      }
    }
  }
}
