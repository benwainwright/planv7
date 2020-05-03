import { Command , Serializable } from "@planv5/domain/ports";
import {
  APP_TYPES,
  Dispatch,
  EventEmitterWrapper
, Logger } from "@planv5/application/ports";

import { Serialiser } from "@planv5/domain";

import { inject, injectable } from "inversify";

const OPEN_READYSTATE = 1;

export const WAIT_TIMEOUT = 2000;

export const AppWebsocketUrl = Symbol.for("AppWebsocketUrl");
export const AuthEndpoint = Symbol("AuthEndpoint");

@injectable()
export class WebsocketClient implements Dispatch {
  private socket: WebSocket | undefined;
  private serialiser: Serialiser;
  private logger: Logger;
  private url: string;
  private events: EventEmitterWrapper;

  constructor(
    @inject(AppWebsocketUrl)
    url: string,

    @inject(APP_TYPES.EventEmitterWrapper)
    events: EventEmitterWrapper,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(APP_TYPES.Logger)
    logger: Logger
  ) {
    this.serialiser = serialiser;
    this.logger = logger;
    this.url = url;
    this.events = events;
  }

  public close() {
    if (this.socket) {
      this.logger.info(`Closing connection`);
      this.socket.close();
      this.socket.onopen = null;
      this.socket = undefined;
    }
  }

  public async dispatch<C extends Command>(command: C): Promise<void> {
    const message = this.serialiser.serialise(command);
    await this.sendMessage(message);
  }

  private async sendMessage(data: any): Promise<void> {
    await this.openSocketIfNotOpen();
    if (this.socket) {
      this.socket.send(data);
    }
  }

  private async onError(): Promise<void> {
    this.logger.info("Error received - reconnecting");
    this.socket = undefined;
    await this.openSocketIfNotOpen();
  }

  private onMessage(message: MessageEvent): void {
    this.logger.debug(`Received: '${message.data.toString()}`);
    try {
      const messageObject = this.serialiser.unSerialise<Serializable>(
        message.data
      );
      if (messageObject instanceof Error) {
        this.logger.info(
          `Error received from server: ${messageObject.toString()}`
        );
        this.events.emitError(messageObject);
        this.logger.warning(messageObject.toString());
      } else {
        this.logger.info(
          `Event received from server: ${messageObject.toString()}`
        );
        this.events.emitEvent(messageObject);
      }
    } catch (error) {
      this.logger.warning(
        `Wasn't able to unserialise message: '${message.data} for reason: '${error}'`
      );
    }
  }

  public async openSocketIfNotOpen(): Promise<void> {
    if (!this.socket || this.socket.readyState !== OPEN_READYSTATE) {
      this.logger.info("Establishing socket connection");
      this.socket = new WebSocket(this.url);
      try {
        await this.waitForSocketToOpen();
      } catch (error) {
        // Timeout
        await this.openSocketIfNotOpen();
        return;
      }
      this.socket.onerror = this.onError.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
      this.logger.info("Socket connection established");
    }
  }

  private async waitForSocketToOpen(): Promise<void> {
    if (this.socket) {
      if (this.socket.readyState === OPEN_READYSTATE) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve, reject) => {
        if (this.socket) {
          this.logger.info("Waiting for socket connection to open");

          const timeout = setTimeout(() => {
            if (this.socket) {
              this.logger.info(`Connection timed out`);
              this.close();
              reject();
            }
          }, WAIT_TIMEOUT);

          this.socket.onopen = event => {
            clearTimeout(timeout);
            resolve();
          };
        }
      });
    }
  }
}
