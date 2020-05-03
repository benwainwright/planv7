import WebSocket from "ws";
import { APP_TYPES , EventEmitterWrapper, Logger } from "@planv5/application/ports";

import { inject, injectable } from "inversify";
import { DOMAIN_TYPES, DomainError, DomainEvent , Serialiser } from "@planv5/domain";
import { Command, CommandBus } from "@planv5/domain/ports";


export const JwtToken = Symbol.for("JwtToken");

@injectable()
export class WebsocketConnection {
  private commandBus: CommandBus;
  private serialiser: Serialiser;
  private appEvents: EventEmitterWrapper;
  private logger: Logger;
  private socket: WebSocket;

  constructor(
    @inject(WebSocket) socket: WebSocket,

    @inject(DOMAIN_TYPES.CommandBus)
    commandBus: CommandBus,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(APP_TYPES.EventEmitterWrapper)
    events: EventEmitterWrapper,

    @inject(APP_TYPES.Logger)
    logger: Logger
  ) {
    this.serialiser = serialiser;
    this.commandBus = commandBus;
    this.logger = logger;
    this.appEvents = events;
    this.onAppEvent = this.onAppEvent.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.socket = socket;

    this.appEvents.onEvent<DomainEvent>(this.onAppEvent);
    socket.on("message", this.onMessage);
  }

  private onAppEvent(event: DomainEvent) {
    this.logger.verbose(`Sending event ${event.toString()}`);
    const eventString = this.serialiser.serialise<DomainEvent>(event);
    this.socket.send(eventString);
  }

  private async onMessage(data: WebSocket.Data) {
    const command = this.serialiser.unSerialise<Command>(data as string);
    try {
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        `Received error when executing ${command.toString()}: ${error}`
      );
      const errorString = this.serialiser.serialise<DomainError>(error);
      this.socket.send(errorString);
    }
  }
}
