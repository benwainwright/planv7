import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  LoginCommand,
  RegisterUserCommand,
} from "@choirpractise/domain";
import Form, { FormData } from "../components/Form";
import CurrentUserContext from "../utils/CurrentUserContext";
import { ProtectedRouterComponentProps } from "../components/ProtectedRouter";
import Redirect from "../utils/Redirect";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const EMAIL = "email";
const PASSWORD = "password";
const VERIFY_PASSWORD = "verifyPassword";

const Register: React.FC<ProtectedRouterComponentProps> = () => {
  const currentUser = React.useContext(CurrentUserContext);
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const handleSubmit = async (data: FormData): Promise<void> => {
    await commandBus.execute(
      new RegisterUserCommand(data[USERNAME], data[EMAIL], data[PASSWORD])
    );

    await commandBus.execute(new LoginCommand(data[USERNAME], data[PASSWORD]));
  };

  const registerForm =  (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        Register!
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          name={USERNAME}
          id={USERNAME}
          label="Username"
          inputProps={{ "data-testid": USERNAME }}
        />
        <TextField
          fullWidth
          name={EMAIL}
          id={EMAIL}
          label="Email"
          inputProps={{ "data-testid": EMAIL }}
        />
        <TextField
          fullWidth
          name={PASSWORD}
          id={PASSWORD}
          label="Password"
          type="password"
          inputProps={{ "data-testid": PASSWORD }}
        />
        <TextField
          fullWidth
          name={VERIFY_PASSWORD}
          id={VERIFY_PASSWORD}
          inputProps={{ "data-testid": VERIFY_PASSWORD }}
          type="password"
          label="Verify Password"
        />
      </Form>
    </React.Fragment>
  );

  return currentUser ? <Redirect to="/app" /> : registerForm;
};

export default Register;
