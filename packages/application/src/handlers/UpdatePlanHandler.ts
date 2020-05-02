import { inject, injectable } from "inversify";
import { HandlerBase } from "../core/handlerBase";
import { UpdatePlanCommand } from "@planv5/domain/commands";
import {
  AuthenticatedEntityRepository,
  CurrentLoginSession,
  EventEmitterWrapper,
  Logger
} from "../ports";
import { APP_TYPES } from "../ports/types";
import { Plan } from "@planv5/domain/entities";
import { ApplicationError } from "../errors";
import { CommandOutcome } from "@planv5/domain";
import { CurrentUserPlansChangedEvent } from "@planv5/domain/events";

@injectable()
export class UpdatePlanHandler extends HandlerBase<UpdatePlanCommand> {
  private readonly planRepository: AuthenticatedEntityRepository<Plan>;
  private readonly session: CurrentLoginSession;
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;
  public constructor(
    @inject(APP_TYPES.PlanRepository)
    planRepository: AuthenticatedEntityRepository<Plan>,
    @inject(APP_TYPES.CurrentLoginSession) session: CurrentLoginSession,
    @inject(APP_TYPES.Logger) logger: Logger,
    @inject(APP_TYPES.EventEmitterWrapper)
    applicationEvents: EventEmitterWrapper
  ) {
    super();
    this.planRepository = planRepository;
    this.session = session;
    this.logger = logger;
    this.applicationEvents = applicationEvents;
  }

  public getCommandInstance() {
    return new UpdatePlanCommand();
  }

  protected async execute(command: any): Promise<void> {
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
