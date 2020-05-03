import "reflect-metadata";
import { inject, injectable } from "inversify";
import { EventEmitter } from "events";
import Logger from "../ports/Logger";
import { Serialisable } from "@planv7/domain";
import TYPES from "../ports/TYPES";

/**
 * Wrapper class to workaround the fact that directly
 * injecting a raw EventEmitter gives me testing headaches
 * for some unknown reason (see: https://github.com/inversify/InversifyJS/issues/984)
 */

const APP_EVENT_NAME = "appEvent";
const APP_ERROR_NAME = "appError";

@injectable()
export default class EventEmitterWrapper {
  private readonly logger: Logger;
  private readonly events = new EventEmitter();

  public constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  public emitEvent<T extends Serialisable>(event: T): void {
    this.logger.verbose(`Emitting event ${event.toString()}`);
    this.events.emit(APP_EVENT_NAME, event);
  }

  public emitError<T extends Error>(error: T): void {
    this.logger.verbose(`Emitting error ${error.toString()}`);
    this.events.emit(APP_ERROR_NAME, error);
  }

  public onEvent<T extends Serialisable>(callback: (event: T) => void): void {
    this.logger.verbose("Adding event listener");
    this.events.on(APP_EVENT_NAME, callback);
  }

  public onError<T extends Error>(callback: (error: T) => void): void {
    this.logger.verbose("Adding error listener");
    this.events.on(APP_ERROR_NAME, callback);
  }
}
