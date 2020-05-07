import {
  TYPES as APP,
  EventEmitterWrapper,
  Logger,
  Serialiser,
} from "@planv7/application";

import {
  Command,
  CommandBus,
  TYPES as DOMAIN,
  DomainError,
  DomainEvent,
} from "@planv7/domain";
import { inject, injectable } from "inversify";

import WebSocket from "ws";

@injectable()
export default class WebsocketConnection {
  private commandBus: CommandBus;
  private serialiser: Serialiser;
  private appEvents: EventEmitterWrapper;
  private logger: Logger;
  private socket: WebSocket;

  public constructor(
    @inject(WebSocket) socket: WebSocket,

    @inject(DOMAIN.commandBus)
    commandBus: CommandBus,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(APP.eventEmitterWrapper)
    events: EventEmitterWrapper,

    @inject(APP.logger)
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

  public onAppEvent(event: DomainEvent): void {
    this.logger.verbose(`Sending event ${event.toString()}`);
    const eventString = this.serialiser.serialise<DomainEvent>(event);
    this.socket.send(eventString);
  }

  public async onMessage(data: WebSocket.Data): Promise<void> {
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
