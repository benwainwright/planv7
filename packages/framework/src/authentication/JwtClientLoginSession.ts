import {
  TYPES as APP,
  EventEmitterWrapper,
  Logger,
  LoginSessionDestroyer,
} from "@planv7/application";
import { COOKIE_EXPIRY, JWT_TOKEN_NAME } from "../constants";
import {
  CommandOutcome,
  User,
  UserLoginStateChangeEvent,
} from "@planv7/domain";
import { inject, injectable } from "inversify";

import { AxiosResponse } from "axios";
import Cookies from "./Cookies";
import JwtLoginSession from "./JwtLoginSession";
import TYPES from "../TYPES";
import WebsocketClient from "../WebsocketClient";

@injectable()
export default class JwtClientLoginSession extends JwtLoginSession
  implements LoginSessionDestroyer {
  private readonly events: EventEmitterWrapper;
  private token = "";
  private currentUser?: User;
  private publicKey: string;
  private readonly socketClient: WebsocketClient;

  public constructor(
    @inject(APP.eventEmitterWrapper) events: EventEmitterWrapper,
    @inject(TYPES.jwtPublicKey)
    publicKey: string,
    @inject(APP.logger) logger: Logger,
    @inject(TYPES.websocketClient) socketClient: WebsocketClient
  ) {
    super(logger);
    this.events = events;
    this.publicKey = publicKey;
    this.socketClient = socketClient;
    this.events.onEvent(this.onUserLogin.bind(this));
  }

  public getToken(): string {
    if (!this.token) {
      this.load();
    }

    return this.token;
  }

  public killSession(): void {
    this.token = "";
    this.currentUser = undefined;
    Cookies.delete(JWT_TOKEN_NAME);
    this.socketClient.close();

    this.events.emitEvent(
      new UserLoginStateChangeEvent(CommandOutcome.SUCCESS)
    );
  }

  public setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  public getCurrentUser(): User | undefined {
    if (!this.currentUser) {
      this.load();
    }

    if (this.token) {
      return this.currentUser;
    }
    return undefined;
  }

  public setCurrentUserFromHttpResponse(response: AxiosResponse): void {
    const authHeader = response.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const parts = authHeader.split(" ");
      if (parts.length > 1) {
        this.token = parts[1];
        this.save();
      }
    }
  }

  private load(): void {
    this.token = Cookies.get(document.cookie, JWT_TOKEN_NAME);
    if (this.token) {
      this.currentUser = this.verifyAndDecodeToken(this.token, this.publicKey);
    }
  }

  private save(): void {
    if (this.token) {
      Cookies.set(JWT_TOKEN_NAME, this.token, COOKIE_EXPIRY);
    }
  }

  private onUserLogin(event: UserLoginStateChangeEvent): void {
    if (
      event instanceof UserLoginStateChangeEvent &&
      event.getOutcome() === CommandOutcome.SUCCESS
    ) {
      this.currentUser = event.getUser();
      this.save();
    }
  }
}
