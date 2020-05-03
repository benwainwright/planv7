import {
  TYPES as APP,
  Dispatch,
  EventEmitterWrapper,
  Serialiser,
} from "@planv7/application";
import { Command, DomainEvent } from "@planv7/domain";
import { inject, injectable } from "inversify";

import TYPES from "./TYPES";

@injectable()
export default class FetchDispatch<C extends Command> implements Dispatch {
  public static readonly httpResponseEvent = "HttpResponseEvent";

  private events: EventEmitterWrapper;
  private endpoint: string;
  private serialiser: Serialiser;

  public constructor(
    @inject(APP.eventEmitterWrapper)
    applicationEvents: EventEmitterWrapper,

    @inject(Serialiser)
    serialiser: Serialiser,

    @inject(TYPES.dispatchEndpoint)
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
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
