import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  LoginCommand,
  RegisterUserCommand,
} from "@choirpractise/domain";
import Form, { FormData } from "../components/Form";
import Input from "../components/form-controls/Input"
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter/ProtectedRouter";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const EMAIL = "email";
const PASSWORD = "password";
const VERIFY_PASSWORD = "verifyPassword";

const Register: React.FC<ProtectedRouterPageComponentProps> = () => {
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const handleSubmit = async (data: FormData): Promise<void> => {
    await commandBus.execute(
      new RegisterUserCommand(data[USERNAME], data[EMAIL], data[PASSWORD])
    );

    await commandBus.execute(new LoginCommand(data[USERNAME], data[PASSWORD]));
  };

  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        Register!
      </Typography>
      <Form onSubmit={handleSubmit}>
          <Input
            name={USERNAME}
            label="Username"
          />
          <Input
            name={EMAIL}
            label="Email"
          />
          <Input
            name={PASSWORD}
            label="Password"
            type="password"
          />
          <Input
            name={VERIFY_PASSWORD}
            type="password"
            label="Verify Password" />
      </Form>
    </React.Fragment>
  );
};

export default Register;
