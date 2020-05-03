import {
  APP_TYPES,
  EventEmitterWrapper,
  Logger
, LoginSessionDestroyer } from "@planv5/application/ports";

import { CommandOutcome, User } from "@planv5/domain";
import { AxiosResponse } from "axios";
import { UserLoginStateChangeEvent } from "@planv5/domain/events";
import { FRAMEWORK_TYPES } from "@planv5/framework/types";
import { inject, injectable } from "inversify";
import { COOKIE_EXPIRY, JWT_TOKEN_NAME } from "../constants";
import { Cookies } from "./Cookies";
import { JwtLoginSession } from "./JwtLoginSession";
import { WebsocketClient } from "../WebsocketClient";

@injectable()
export class JwtClientLoginSession extends JwtLoginSession
  implements LoginSessionDestroyer {
  private readonly events: EventEmitterWrapper;
  private token: string | undefined = undefined;
  private currentUser: User | undefined;
  private publicKey: string;
  private readonly socketClient: WebsocketClient;

  public constructor(
    @inject(APP_TYPES.EventEmitterWrapper) events: EventEmitterWrapper,
    @inject(FRAMEWORK_TYPES.JwtPublicKey)
    publicKey: string,
    @inject(APP_TYPES.Logger) logger: Logger,
    @inject(FRAMEWORK_TYPES.WebsocketClient) socketClient: WebsocketClient
  ) {
    super(logger);
    this.events = events;
    this.publicKey = publicKey;
    this.socketClient = socketClient;
    this.events.onEvent(this.onUserLogin.bind(this));
  }

  public getToken(): string | undefined {
    if (!this.token) {
      this.load();
    }

    return this.token;
  }

  public async killSession(): Promise<void> {
    this.token = undefined;
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
    this.token = Cookies.get(document.cookie, JWT_TOKEN_NAME) || undefined;
    if (this.token) {
      this.currentUser = this.verifyAndDecodeToken(
        this.token || "",
        this.publicKey
      );
    }
  }

  private save(): void {
    if (this.token) {
      Cookies.set(JWT_TOKEN_NAME, this.token, COOKIE_EXPIRY);
    }
  }

  private onUserLogin(event: UserLoginStateChangeEvent): void {
    if (event instanceof UserLoginStateChangeEvent) {
      if (event.getOutcome() === CommandOutcome.SUCCESS) {
        this.currentUser = event.getUser();
        this.save();
      }
    }
  }
}
