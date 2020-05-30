import {
  TYPES as APP,
  Dispatch,
  EventEmitterWrapper,
  Logger,
  Serialiser,
} from "@choirpractise/application";
import { Command, Serialisable } from "@choirpractise/domain";

import { inject, injectable } from "inversify";

import TYPES from "./TYPES";

const OPEN_READYSTATE = 1;

@injectable()
export default class WebsocketClient implements Dispatch {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  public static readonly waitTimeout = 2000;

  private socket?: WebSocket;
  private serialiser: Serialiser;
  private logger: Logger;
  private url: string;
  private events: EventEmitterWrapper;

  public constructor(
    @inject(TYPES.appWebsocketUrl)
    url: string,

    @inject(EventEmitterWrapper)
    events: EventEmitterWrapper,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(APP.logger)
    logger: Logger
  ) {
    this.serialiser = serialiser;
    this.logger = logger;
    this.url = url;
    this.events = events;
  }

  public close(): void {
    if (this.socket) {
      this.logger.info(`Closing connection`);
      this.socket.close();
      this.socket = undefined;
    }
  }

  public async dispatch<C extends Command>(command: C): Promise<void> {
    const message = this.serialiser.serialise(command);
    await this.sendMessage(message);
  }

  private async sendMessage(
    data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ): Promise<void> {
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
      const messageObject = this.serialiser.unSerialise<Serialisable>(
        message.data
      );
      if (messageObject instanceof Error) {
        this.events.emitError(messageObject);
        this.logger.warning(messageObject.message.toString());
      } else {
        this.logger.info(
          `Event received from server: ${String(messageObject)}`
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
      this.socket.addEventListener("error", this.onError.bind(this));
      this.socket.addEventListener("message", this.onMessage.bind(this));
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
              reject(new Error("Connection timed out..."));
            }
          }, WebsocketClient.waitTimeout);

          this.socket.addEventListener("open", (): void => {
            clearTimeout(timeout);
            resolve();
          });
        }
      });
    }
  }
}
