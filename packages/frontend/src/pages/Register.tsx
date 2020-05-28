import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  LoginCommand,
  RegisterUserCommand,
} from "@planv7/domain";
import Form, { FormData } from "../components/Form";
import { RouteComponentProps } from "@reach/router";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const EMAIL = "email";
const PASSWORD = "password";
const VERIFY_PASSWORD = "verifyPassword";

const Register: React.FC<RouteComponentProps> = () => {
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
        Register
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          name={USERNAME}
          label="Username"
          inputProps={{ "data-testid": USERNAME }}
        />
        <TextField
          fullWidth
          name={EMAIL}
          label="Email"
          inputProps={{ "data-testid": EMAIL }}
        />
        <TextField
          fullWidth
          name={PASSWORD}
          label="Password"
          type="password"
          inputProps={{ "data-testid": PASSWORD }}
        />
        <TextField
          fullWidth
          name={VERIFY_PASSWORD}
          inputProps={{ "data-testid": VERIFY_PASSWORD }}
          type="password"
          label="Verify Password"
        />
      </Form>
    </React.Fragment>
  );
};

export default Register;
