import React, { useContext } from "react";
import { CurrentUserContext } from "../components/utils/CurrentUserContext";

import { Redirect } from "../components/utils/Redirect";
import { RegisterUserCommand } from "@planv5/domain/commands";

import { useDependency } from "../components/utils/InversifyProvider";

import { DOMAIN_TYPES } from "@planv5/domain";
import { CommandBus } from "@planv5/domain/ports";

export const USERNAME_FIELD_NAME = "username";
export const EMAIL_FIELD_NAME = "email";
export const PASSWORD_FIELD_NAME = "password";

const RegisterForm: React.FC<{}> = () => {
  const commandBus = useDependency<CommandBus>(DOMAIN_TYPES.CommandBus);

  const currentUser = useContext(CurrentUserContext);

  const onRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.persist();

    if (event.target instanceof HTMLFormElement) {
      const form = event.target as HTMLFormElement;

      const usernameElement = form.elements.namedItem(
        USERNAME_FIELD_NAME
      ) as HTMLInputElement;

      const emailElement = form.elements.namedItem(
        EMAIL_FIELD_NAME
      ) as HTMLInputElement;

      const passwordElement = form.elements.namedItem(
        PASSWORD_FIELD_NAME
      ) as HTMLInputElement;

      const registerCommand = new RegisterUserCommand(
        usernameElement.value,
        emailElement.value,
        passwordElement.value
      );

      await commandBus.execute(registerCommand);
    }
  };

  const registerForm = 
    <form onSubmit={onRegister}>
      <h2>Register an account</h2>
      <label htmlFor="username">Username</label>
      <input
        name="username"
        id="username"
        type="input"
        placeholder="Enter username"
      />
      <label htmlFor="email">Email address</label>
      <input name="email" id="email" type="email" placeholder="Enter email" />

      <label htmlFor="password">Password</label>
      <input
        name="password"
        id="password"
        type="password"
        placeholder="Password"
      />
      <button type="submit">Submit</button>
    </form>
  ;

  return currentUser ? <Redirect to="/" /> : registerForm;
};

export default RegisterForm;
