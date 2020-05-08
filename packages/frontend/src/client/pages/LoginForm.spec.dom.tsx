import React from "react";
import {
  APP_TYPES,
  EventEmitterWrapper,
  Logger
} from "@planv5/application/ports";
import { Container } from "inversify";
import LoginForm from "./LoginForm";
import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { LoginCommand } from "@planv5/domain/commands";
import { Command, CommandBus } from "@planv5/domain/ports";
import { DOMAIN_TYPES, DomainEvent } from "@planv5/domain";
import { InversifyProvider } from "../components/utils/InversifyProvider";

import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

class MockCommandBus implements CommandBus {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute<C extends Command>(command: C): Promise<void> {}
}

describe("Submission", (): void => {
  it("Should result in the command bus receviing a loginCommand", (): void => {
    const commandBus = Substitute.for<MockCommandBus>();
    const container = new Container();
    const logger = Substitute.for<Logger>();
    const events = new EventEmitterWrapper(logger);
    container
      .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
      .toConstantValue(commandBus);
    container
      .bind<EventEmitterWrapper>(APP_TYPES.EventEmitterWrapper)
      .toConstantValue(events);
    const loginForm = mount(
      <InversifyProvider container={container}>
        <LoginForm />
      </InversifyProvider>
    );

    const usernameField = loginForm
      .find("#username")
      .getDOMNode() as HTMLInputElement;
    usernameField.value = "foobar";

    const passwordField = loginForm
      .find("#password")
      .getDOMNode() as HTMLInputElement;
    passwordField.value = "password";

    loginForm.update();

    loginForm.find("form").simulate("submit");

    commandBus.received().execute(
      Arg.is<LoginCommand>((command: LoginCommand): boolean => {
        if (command instanceof LoginCommand) {
          return (
            command.getUsername() === "foobar" &&
            command.getPassword() === "password"
          );
        } else {
          return true;
        }
      })
    );
  });
});
