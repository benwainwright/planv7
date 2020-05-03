import {
  CommandOutcome,
  CurrentUserPlansChangedEvent,
  GetMyPlansCommand,
  Plan,
} from "@planv7/domain";

import { inject, injectable } from "inversify";

import { TYPES } from "../ports/types";
import { ApplicationError } from "../ApplicationError";
import AuthenticatedEntityRepository from "../ports/AuthenticatedEntityRepository";
import CurrentLoginSession from "./../ports/CurrentLoginSession";

import HandlerBase from "../core/HandlerBase";

import { EventEmitterWrapper, Logger } from "../ports";

@injectable()
export default class GetMyPlansHandler extends HandlerBase<GetMyPlansCommand> {
  private readonly planRepository: AuthenticatedEntityRepository<Plan>;
  private readonly session: CurrentLoginSession;
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;

  public constructor(
    @inject(TYPES.PlanRepository)
    planRepository: AuthenticatedEntityRepository<Plan>,
    @inject(TYPES.CurrentLoginSession) session: CurrentLoginSession,
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.EventEmitterWrapper)
    applicationEvents: EventEmitterWrapper
  ) {
    super();
    this.planRepository = planRepository;
    this.session = session;
    this.logger = logger;
    this.applicationEvents = applicationEvents;
  }

  public getCommandInstance(): GetMyPlansCommand {
    return new GetMyPlansCommand();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async execute(command: GetMyPlansCommand): Promise<void> {
    const user = this.session.getCurrentUser();

    if (!user) {
      throw new ApplicationError("User must be authenticated...");
    }
    const currentPlans = await this.planRepository.getAllByUser(user);

    const event = new CurrentUserPlansChangedEvent(
      CommandOutcome.SUCCESS,
      currentPlans
    );
    this.applicationEvents.emitEvent(event);
  }
}
