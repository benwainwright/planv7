import { Command } from "@planv5/domain/ports";
import { DomainEvent , Serialiser } from "@planv5/domain";

import {
  APP_TYPES,
  Dispatch,
  EventEmitterWrapper
} from "@planv5/application/ports";
import { inject, injectable } from "inversify";

export const DispatchEndpoint = Symbol("DispatchEndpoint");
export const HTTP_RESPONSE_EVENT = "HttpResponseEvent";

@injectable()
export class FetchDispatch<C extends Command> implements Dispatch {
  private events: EventEmitterWrapper;
  private endpoint: string;
  private serialiser: Serialiser;

  public constructor(
    @inject(APP_TYPES.EventEmitterWrapper)
    applicationEvents: EventEmitterWrapper,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(DispatchEndpoint)
    endpoint: string
  ) {
    this.events = applicationEvents;
    this.endpoint = endpoint;
    this.serialiser = serialiser;
  }

  public async dispatch(command: C): Promise<void> {
    const body = this.serialiser.serialise(command);
    const response = await this.promisifyFetch(this.endpoint, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body
    });
    this.events.emit(response.identifier(), response);
  }

  private async promisifyFetch(
    request: RequestInfo,
    init: RequestInit | undefined
  ): Promise<DomainEvent> {
    return new Promise<DomainEvent>((resolve, reject): void => {
      fetch(request, init)
        .then(
          async (response: Response): Promise<void> => {
            this.events.emit(HTTP_RESPONSE_EVENT, response);
            if (response.ok) {
              resolve(
                this.serialiser.unSerialise<DomainEvent>(await response.text())
              );
            } else {
              reject(response);
            }
          }
        )
        .catch((error): void => {
          reject(error);
        });
    });
  }
}
