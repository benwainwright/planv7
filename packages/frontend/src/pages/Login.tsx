import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  LoginCommand,
} from "@choirpractise/domain";
import Form, { FormData } from "../components/Form";
import Input from "../components/form-controls/Input";
import Page from "../components/Page";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter/ProtectedRouter";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const PASSWORD = "password";

const Login: React.FC<ProtectedRouterPageComponentProps> = (props) => {
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const handleSubmit = async (data: FormData): Promise<void> => {
    await commandBus.execute(new LoginCommand(data[USERNAME], data[PASSWORD]));
  };

  return (
    <Page title={props.title}>
      <Form onSubmit={handleSubmit}>
        <Input name={USERNAME} label="Username" />
        <Input name={PASSWORD} label="Password" type="password" />
      </Form>
    </Page>
  );
};

export default Login;
