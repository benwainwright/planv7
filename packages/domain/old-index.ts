import { CommandOutcome } from "./src/commandOutcome";
import { DomainEvent } from "./src/domainEvent";
import { User } from "./src/entities/user";
import { DomainError } from "./src/errors/DomainError";
import { CURRENT_USER_PLANS_CHANGED_EVENT } from "./src/events/currentUserPlansChangedEvent";
import { GetAllUsersEvent } from "./src/events/getAllUsersEvent";
import { USER_LOGIN_STATE_CHANGE_EVENT } from "./src/events/userLoginStateChangeEvent";
import {
  UserRegisteredEvent,
  USER_REGISTERED_EVENT
} from "./src/events/userRegisteredEvent";
import { Response } from "./src/response";
import { SerialisableConstructors, Serialiser } from "./src/utils/serialiser";

export const DOMAIN_TYPES = {
  CommandBus: Symbol.for("CommandBus"),
  Dispatch: Symbol.for("Dispatch"),
  Handler: Symbol.for("Handler")
};

export {
  SerialisableConstructors,
  Serialiser,
  DomainError,
  DomainEvent,
  CommandOutcome,
  UserRegisteredEvent,
  GetAllUsersEvent,
  Response,
  User,
  USER_REGISTERED_EVENT,
  USER_LOGIN_STATE_CHANGE_EVENT,
  CURRENT_USER_PLANS_CHANGED_EVENT
};
