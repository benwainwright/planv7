import {
  AuthenticatedEntityRepository,
  CurrentLoginSession,
  EventEmitterWrapper,
  Logger,
} from "../ports";

import {
  CommandOutcome,
  CurrentUserPlansChangedEvent,
  Plan,
  UpdatePlanCommand,
} from "@planv7/domain";

import { inject, injectable } from "inversify";
import { ApplicationError } from "../ApplicationError";

import HandlerBase from "../core/HandlerBase";
import TYPES from "../ports/TYPES";

@injectable()
export default class UpdatePlanHandler extends HandlerBase<UpdatePlanCommand> {
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

  public getCommandInstance(): UpdatePlanCommand {
    return new UpdatePlanCommand();
  }

  protected async execute(command: UpdatePlanCommand): Promise<void> {
    this.logger.verbose("Executing UpdatePlanHandler");
    const user = this.session.getCurrentUser();

    if (!user) {
      throw new ApplicationError("User must be authenticated...");
    }

    const currentPlan = await this.planRepository.getByFieldAndUser(
      user,
      "slug",
      command.getSlug()
    );
    this.logger.verbose("Found existing plan");

    if (!currentPlan) {
      throw new ApplicationError(
        `Could not find plan with slug '${command.getSlug()}'`
      );
    }

    this.planRepository.updateExisting(
      new Plan(
        user.getName(),
        command.getSlug(),
        command.getTitle(),
        command.getDescription(),
        command.getHoursPerWeek(),
        command.getDeadlines()
      )
    );
    this.logger.verbose("Plan updated");

    this.logger.verbose("Emitting plans changed event");
    const newPlans = await this.planRepository.getAllByUser(user);
    this.applicationEvents.emitEvent(
      new CurrentUserPlansChangedEvent(CommandOutcome.SUCCESS, newPlans)
    );
  }
}
