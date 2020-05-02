import { inject, injectable } from "inversify";

import {
  AddPlanCommand,
  CommandOutcome,
  CurrentUserPlansChangedEvent,
  Plan,
} from "@planv7/domain";

import { ApplicationError } from "../ApplicationError";
import CurrentLoginSession from "./../ports/CurrentLoginSession";
import AuthenticatedEntityRepository from "../ports/authenticatedEntityRepository";
import HandlerBase from "../core/HandlerBase";
import { APP_TYPES } from "../ports/types";
import { EventEmitterWrapper, Logger, SlugGenerator } from "../ports";

@injectable()
export default class AddPlanHandler extends HandlerBase<AddPlanCommand> {
  private readonly planRepository: AuthenticatedEntityRepository<Plan>;
  private readonly session: CurrentLoginSession;
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;
  private readonly slugGenerator: SlugGenerator<Plan>;
  public constructor(
    @inject(APP_TYPES.PlanRepository)
    planRepository: AuthenticatedEntityRepository<Plan>,
    @inject(APP_TYPES.CurrentLoginSession) session: CurrentLoginSession,
    @inject(APP_TYPES.Logger) logger: Logger,
    @inject(APP_TYPES.EventEmitterWrapper)
    applicationEvents: EventEmitterWrapper,
    @inject(APP_TYPES.SlugGenerator)
    slugGenerator: SlugGenerator<Plan>
  ) {
    super();
    this.planRepository = planRepository;
    this.session = session;
    this.logger = logger;
    this.applicationEvents = applicationEvents;
    this.slugGenerator = slugGenerator;
  }

  public getCommandInstance(): AddPlanCommand {
    return new AddPlanCommand();
  }

  protected async execute(command: AddPlanCommand): Promise<void> {
    this.logger.verbose("Executing AddPlanHandler");
    const user = this.session.getCurrentUser();

    if (!user) {
      throw new ApplicationError("User must be authenticated...");
    }

    const plan = new Plan(
      user.getName(),
      "",
      command.getTitle(),
      command.getDescription(),
      command.getHoursPerWeek()
    );

    this.logger.verbose("Generating slug");
    const slug = await this.slugGenerator.getUniqueSlug(plan);

    const planWithSlug = new Plan(
      user.getName(),
      slug,
      command.getTitle(),
      command.getDescription(),
      command.getHoursPerWeek()
    );

    await this.planRepository.saveNew(planWithSlug);
    this.logger.verbose("Plan saved");

    const newPlans = await this.planRepository.getAllByUser(user);
    this.logger.verbose("Emitting plans changed event");
    this.applicationEvents.emitEvent(
      new CurrentUserPlansChangedEvent(CommandOutcome.SUCCESS, newPlans)
    );
  }
}
