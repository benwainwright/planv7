import {
  CommandOutcome,
  CurrentUserPlansChangedEvent,
  GetMyPlansCommand,
  Plan,
} from "@planv7/domain";

import { EventEmitterWrapper, Logger } from "../ports";
import { inject, injectable } from "inversify";

import ApplicationError from "../ApplicationError";
import AuthenticatedEntityRepository from "../ports/AuthenticatedEntityRepository";
import CurrentLoginSession from "./../ports/CurrentLoginSession";
import HandlerBase from "../core/HandlerBase";
import TYPES from "../ports/TYPES";

@injectable()
export default class GetMyPlansHandler extends HandlerBase<GetMyPlansCommand> {
  private readonly planRepository: AuthenticatedEntityRepository<Plan>;
  private readonly session: CurrentLoginSession;
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;

  public constructor(
    @inject(TYPES.planRepository)
    planRepository: AuthenticatedEntityRepository<Plan>,
    @inject(TYPES.currentLoginSession) session: CurrentLoginSession,
    @inject(TYPES.logger) logger: Logger,
    @inject(EventEmitterWrapper)
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
