import React from "react";
import Plans from "./Plans";
import PlanCard from "../components/PlanCard";
import { act } from "react-dom/test-utils";
import {
  APP_TYPES,
  EventEmitterWrapper,
  Logger
} from "@planv5/application/ports";
import { CurrentUserPlansChangedEvent } from "@planv5/domain/events";
import { Substitute } from "@fluffy-spoon/substitute";
import { InversifyProvider } from "../components/utils/InversifyProvider";
import Adapter from "enzyme-adapter-react-16";
import { ReactWrapper, configure, mount } from "enzyme";
import { Container } from "inversify";
import { Command, CommandBus } from "@planv5/domain/ports";
import { CommandOutcome, DOMAIN_TYPES, User } from "@planv5/domain";
import { CurrentUserContext } from "../components/utils/CurrentUserContext";
import { Plan } from "@planv5/domain/entities";

configure({ adapter: new Adapter() });

class MockCommandBus implements CommandBus {
  public async execute<C extends Command>(_command: C): Promise<void> {}
}

describe("The plans page", () => {
  let plansPage: ReactWrapper<{}>;
  let events: EventEmitterWrapper;

  beforeEach(() => {
    const commandBus = Substitute.for<MockCommandBus>();
    const container = new Container();
    const logger = Substitute.for<Logger>();
    const user = Substitute.for<User>();
    user.getName().returns("foo");
    events = new EventEmitterWrapper(logger);

    container
      .bind<EventEmitterWrapper>(APP_TYPES.EventEmitterWrapper)
      .toConstantValue(events);

    container
      .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
      .toConstantValue(commandBus);

    plansPage = mount(
      <CurrentUserContext.Provider value={user}>
        <InversifyProvider container={container}>
          <Plans />
        </InversifyProvider>
      </CurrentUserContext.Provider>
    );
  });

  it("Should stop displaying the loading spinner when the plans have been loaded", () => {
    act(() => {
      const event = new CurrentUserPlansChangedEvent(
        CommandOutcome.SUCCESS,
        []
      );
      events.emitEvent(event);
    });
    plansPage.update();
    expect(plansPage.find(".spinner-border").exists()).toBeFalsy();
  });

  it("Should not render any plancards if there aren't any plans", () => {
    act(() => {
      const event = new CurrentUserPlansChangedEvent(
        CommandOutcome.SUCCESS,
        []
      );
      events.emitEvent(event);
    });

    plansPage.update();
    expect(plansPage.find(".card").exists()).toBeFalsy();
  });

  it("Should display some plancards if some were returned", () => {
    act(() => {
      const event = new CurrentUserPlansChangedEvent(CommandOutcome.SUCCESS, [
        new Plan("foo", "bar", "baz", "bash", 1)
      ]);
      events.emitEvent(event);
    });

    plansPage.update();
    expect(plansPage.find(PlanCard).exists()).toEqual(true);
  });

  describe("create button", () => {
    it("Should add an editable plan to the list", () => {
      act(() => {
        const event = new CurrentUserPlansChangedEvent(
          CommandOutcome.SUCCESS,
          []
        );
        events.emitEvent(event);
      });

      plansPage.update();

      act(() => {
        plansPage.find("button.create-button").simulate("click");
      });

      plansPage.update();
      expect(plansPage.find(PlanCard).exists()).toEqual(true);
    });
  });
});
