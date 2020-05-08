import React from "react";
import {
  APP_TYPES,
  EventEmitterWrapper,
  Logger
} from "@planv5/application/ports";
import { Container } from "inversify";
import { InversifyProvider } from "../components/utils/InversifyProvider";
import RegisterForm, {
  EMAIL_FIELD_NAME,
  PASSWORD_FIELD_NAME,
  USERNAME_FIELD_NAME
} from "./RegisterForm";
import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { LoginCommand, RegisterUserCommand } from "@planv5/domain/commands";
import { Command, CommandBus } from "@planv5/domain/ports";
import { DOMAIN_TYPES } from "@planv5/domain";


import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

class MockCommandBus implements CommandBus {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute<C extends Command>(command: C): Promise<void> {}
}

describe("Submission", (): void => {
  it("Should result in the command bus receiving a registerUserCommand", (): void => {
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
    const registerForm = mount(
      <InversifyProvider container={container}>
        <RegisterForm />
      </InversifyProvider>
    );

    const usernameField = registerForm
      .find("#username")
      .getDOMNode() as HTMLInputElement;
    usernameField.value = "foobar";

    const emailField = registerForm
      .find("#email")
      .getDOMNode() as HTMLInputElement;
    emailField.value = "a@b.c";

    const passwordField = registerForm
      .find("#password")
      .getDOMNode() as HTMLInputElement;
    passwordField.value = "password";

    registerForm.update();

    registerForm.find("form").simulate("submit");

    commandBus.received().execute(
      Arg.is<RegisterUserCommand>((command: RegisterUserCommand): boolean => {
        if (command instanceof RegisterUserCommand) {
          return (
            command.getName() === "foobar" &&
            command.getEmail() === "a@b.c" &&
            command.getPassword() === "password"
          );
        } else {
          return true;
        }
      })
    );
  });

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
    const registerForm = mount(
      <InversifyProvider container={container}>
        <RegisterForm />
      </InversifyProvider>
    );

    const usernameField = registerForm
      .find("#username")
      .getDOMNode() as HTMLInputElement;
    usernameField.value = "foobar";

    const emailField = registerForm
      .find("#email")
      .getDOMNode() as HTMLInputElement;
    emailField.value = "a@b.c";

    const passwordField = registerForm
      .find("#password")
      .getDOMNode() as HTMLInputElement;
    passwordField.value = "password";

    registerForm.update();

    registerForm.find("form").simulate("submit");

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
