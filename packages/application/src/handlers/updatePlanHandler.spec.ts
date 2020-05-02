import { mock } from "jest-mock-extended";
import { UpdatePlanHandler } from "./updatePlanHandler";
import { UpdatePlanCommand } from "@planv5/domain/commands";

import { Logger } from "../ports/logger";
import { AuthenticatedEntityRepository } from "../ports/authenticatedEntityRepository";
import { CurrentLoginSession } from "../ports/currentLoginSession";
import { Plan, User } from "@planv5/domain/entities";
import { EventEmitterWrapper } from "../core/EventEmitterWrapper";
import { CommandOutcome } from "@planv5/domain";
import { CurrentUserPlansChangedEvent } from "@planv5/domain/events";

describe("Update plan handler", () => {
  it("Should throw an error if the user is not authenticated", async () => {
    const repo = mock<AuthenticatedEntityRepository<Plan>>();
    const session = mock<CurrentLoginSession>();
    const logger = mock<Logger>();
    const events = mock<EventEmitterWrapper>();

    session.getCurrentUser.mockReturnValue(undefined);

    const handler = new UpdatePlanHandler(repo, session, logger, events);
    try {
      await handler.tryHandle(
        new UpdatePlanCommand("foo", "bar", "baz", 0, [])
      );
      fail("Expected an error to be thrown");
    } catch {}
  });

  it("Throw an error if this plan doesn't belong to this user", async () => {
    const repo = mock<AuthenticatedEntityRepository<Plan>>();
    const session = mock<CurrentLoginSession>();
    const logger = mock<Logger>();
    const events = mock<EventEmitterWrapper>();

    session.getCurrentUser.mockReturnValue(
      new User("foobar", "foo@bar.com", "foobar")
    );

    repo.getByFieldAndUser.mockReturnValue(Promise.resolve(undefined));

    const handler = new UpdatePlanHandler(repo, session, logger, events);
    try {
      await handler.tryHandle(
        new UpdatePlanCommand("foo", "bar", "baz", 0, [])
      );
      fail("Expected an error to be thrown");
    } catch {}
  });

  it("Updates the plan with the new values when a plan matches", async () => {
    const repo = mock<AuthenticatedEntityRepository<Plan>>();
    const session = mock<CurrentLoginSession>();
    const logger = mock<Logger>();
    const events = mock<EventEmitterWrapper>();

    session.getCurrentUser.mockReturnValue(
      new User("fooUser", "foo@bar.com", "foobar")
    );
    const command = new UpdatePlanCommand(
      "fooSlug",
      "newTitle",
      "newDescription",
      0,
      []
    );
    repo.getByFieldAndUser.mockReturnValue(
      Promise.resolve(
        new Plan("fooUser", "fooSlug", "oldTitle", "oldDescription", 0)
      )
    );

    const handler = new UpdatePlanHandler(repo, session, logger, events);
    await handler.tryHandle(command);
    expect(repo.updateExisting).toHaveBeenCalledWith(
      new Plan("fooUser", "fooSlug", "newTitle", "newDescription", 0)
    );
  });

  it("Emits a CurrentUserPlansChangedEvent when a plan is updated", async () => {
    const repo = mock<AuthenticatedEntityRepository<Plan>>();
    const session = mock<CurrentLoginSession>();
    const logger = mock<Logger>();
    const events = mock<EventEmitterWrapper>();

    session.getCurrentUser.mockReturnValue(
      new User("fooUser", "foo@bar.com", "foobar")
    );

    const command = new UpdatePlanCommand(
      "fooSlug",
      "newTitle",
      "newDescription",
      0,
      []
    );

    repo.getByFieldAndUser.mockReturnValue(
      Promise.resolve(
        new Plan("fooUser", "fooSlug", "oldTitle", "oldDescription", 0)
      )
    );

    const plans = [
      new Plan("fooUser", "fooSlug1", "oldTitle", "oldDescription", 0),
      new Plan("fooUser", "fooSlug2", "oldTitle", "oldDescription", 0)
    ];

    repo.getAllByUser.mockReturnValue(Promise.resolve(plans));

    const handler = new UpdatePlanHandler(repo, session, logger, events);
    await handler.tryHandle(command);
    expect(events.emitEvent).toHaveBeenCalledWith(
      new CurrentUserPlansChangedEvent(CommandOutcome.SUCCESS, plans)
    );
  });
});
