import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  LoginCommand,
  RegisterUserCommand,
} from "@choirpractise/domain";
import Form, { FormData } from "../components/Form";
import Input from "../components/form-controls/Input";
import Page from "../components/Page";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter/ProtectedRouter";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const EMAIL = "email";
const PASSWORD = "password";
const VERIFY_PASSWORD = "verifyPassword";

const Register: React.FC<ProtectedRouterPageComponentProps> = (props) => {
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const handleSubmit = async (data: FormData): Promise<void> => {
    await commandBus.execute(
      new RegisterUserCommand(
        data.values[USERNAME],
        data.values[EMAIL],
        data.values[PASSWORD]
      )
    );

    await commandBus.execute(
      new LoginCommand(data.values[USERNAME], data.values[PASSWORD])
    );
  };

  return (
    <Page title={props.title}>
      <Form onSubmit={handleSubmit}>
        <Input name={USERNAME} label="Username" />
        <Input name={EMAIL} label="Email" />
        <Input name={PASSWORD} label="Password" type="password" />
        <Input name={VERIFY_PASSWORD} type="password" label="Verify Password" />
      </Form>
    </Page>
  );
};

export default Register;
