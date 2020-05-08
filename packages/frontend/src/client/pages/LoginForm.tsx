import React, { useContext } from "react";
import { DOMAIN_TYPES } from "@planv5/domain";
import { CommandBus } from "@planv5/domain/ports";
import { LoginCommand } from "@planv5/domain/commands";
import { useDependency } from "../components/utils/InversifyProvider";
import { CurrentUserContext } from "../components/utils/CurrentUserContext";
import { Redirect } from "../components/utils/Redirect";

export const USERNAME_FIELD_NAME = "username";
export const PASSWORD_FIELD_NAME = "password";

const LoginForm: React.FC<{}> = () => {
  const commandBus = useDependency<CommandBus>(DOMAIN_TYPES.CommandBus);
  const currentUser = useContext(CurrentUserContext);

  const onLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (event.target instanceof HTMLFormElement) {
      const form = event.target as HTMLFormElement;

      const usernameElement = form.elements.namedItem(
        USERNAME_FIELD_NAME
      ) as HTMLInputElement;

      const passwordElement = form.elements.namedItem(
        PASSWORD_FIELD_NAME
      ) as HTMLInputElement;

      if (commandBus) {
        const loginCommand = new LoginCommand(
          usernameElement.value,
          passwordElement.value
        );
        await commandBus.execute(loginCommand);
      }
    }
  };

  return currentUser ? 
    <Redirect to="/" />
   : 
    <form onSubmit={onLogin}>
      <h2>Login</h2>
      <label htmlFor="username">Username</label>
      <input
        name="username"
        id="username"
        type="input"
        placeholder="Enter username"
      />

      <label htmlFor="password">Password</label>
      <input
        name="password"
        id="password"
        type="password"
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  ;
};

export default LoginForm;
