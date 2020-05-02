import { mock } from "jest-mock-extended";
import { Plan, User } from "@planv5/domain/entities";

import { EventEmitterWrapper } from "../core/EventEmitterWrapper";
import { Logger } from "../ports/logger";
import { AuthenticatedEntityRepository } from "../ports/authenticatedEntityRepository";
import { CurrentLoginSession } from "../ports/currentLoginSession";
import { AddPlanHandler } from "./addPlanHandler";
import { SlugGenerator } from "../ports";
import { AddPlanCommand } from "@planv5/domain/commands";
import { CurrentUserPlansChangedEvent } from "@planv5/domain/events";
import { CommandOutcome } from "@planv5/domain";

describe("AddPlanHandler", (): void => {
  it("Should throw an error if the user is not authenticated", async () => {
    const repo = mock<AuthenticatedEntityRepository<Plan>>();
    const session = mock<CurrentLoginSession>();
    const logger = mock<Logger>();
    const events = mock<EventEmitterWrapper>();
    const slugGenerator = mock<SlugGenerator<Plan>>();

    session.getCurrentUser.mockReturnValue(undefined);
    const handler = new AddPlanHandler(
      repo,
      session,
      logger,
      events,
      slugGenerator
    );
    try {
      await handler.tryHandle(new AddPlanCommand("foo", "bar", 0));
      fail("Expected an error to be thrown");
    } catch {}
  });

  it("Creates a new plan using a slug from the slugGenerator", async () => {
    const repo = mock<AuthenticatedEntityRepository<Plan>>();
    const session = mock<CurrentLoginSession>();
    const logger = mock<Logger>();
    const events = mock<EventEmitterWrapper>();
    const slugGenerator = mock<SlugGenerator<Plan>>();

    session.getCurrentUser.mockReturnValue(
      new User("fooUser", "foo@bar.com", "foobar")
    );

    slugGenerator.getUniqueSlug.mockReturnValue(Promise.resolve("foobarSlug"));

    const command = new AddPlanCommand("fooTitle", "fooDescription", 0);

    const thePlan = new Plan(
      "fooUser",
      "foobarSlug",
      "fooTitle",
      "fooDescription",
      0
    );

    const handler = new AddPlanHandler(
      repo,
      session,
      logger,
      events,
      slugGenerator
    );

    await handler.tryHandle(command);
    expect(repo.saveNew).toHaveBeenCalledWith(thePlan);
  });

  it("Emits a CurrentUserPlansChangedEvent when a plan is created", async () => {
    const repo = mock<AuthenticatedEntityRepository<Plan>>();
    const session = mock<CurrentLoginSession>();
    const logger = mock<Logger>();
    const events = mock<EventEmitterWrapper>();
    const slugGenerator = mock<SlugGenerator<Plan>>();

    session.getCurrentUser.mockReturnValue(
      new User("fooUser", "foo@bar.com", "foobar")
    );

    slugGenerator.getUniqueSlug.mockReturnValue(Promise.resolve("foobarSlug"));

    const command = new AddPlanCommand("fooTitle", "fooDescription", 0);

    const handler = new AddPlanHandler(
      repo,
      session,
      logger,
      events,
      slugGenerator
    );

    const plans = [
      new Plan("fooUser", "fooSlug1", "oldTitle", "oldDescription", 0),
      new Plan("fooUser", "fooSlug2", "oldTitle", "oldDescription", 0)
    ];

    repo.getAllByUser.mockReturnValue(Promise.resolve(plans));

    await handler.tryHandle(command);

    expect(events.emitEvent).toHaveBeenCalledWith(
      new CurrentUserPlansChangedEvent(CommandOutcome.SUCCESS, plans)
    );
  });
});
