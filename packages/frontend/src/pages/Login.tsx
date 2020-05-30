import * as React from "react";
import { CommandBus, TYPES as DOMAIN, LoginCommand } from "@choirpractise/domain";
import Form, { FormData } from "../components/Form";
import CurrentUserContext from "../utils/CurrentUserContext";
import Redirect from "../utils/Redirect";
import { RouteComponentProps } from "@reach/router";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const PASSWORD = "password";

const Login: React.FC<RouteComponentProps> = () => {
  const currentUser = React.useContext(CurrentUserContext);
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const handleSubmit = async (data: FormData): Promise<void> => {
    await commandBus.execute(new LoginCommand(data[USERNAME], data[PASSWORD]));
  };

  const loginForm = (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        Register
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          name={USERNAME}
          id={USERNAME}
          label="Username"
          type="password"
          inputProps={{ "data-testid": USERNAME }}
        />
        <TextField
          fullWidth
          name={PASSWORD}
          id={PASSWORD}
          label="Password"
          type="password"
          inputProps={{ "data-testid": PASSWORD }}
        />
      </Form>
    </React.Fragment>
  );

  return currentUser ? <Redirect to="/app" /> : loginForm;
};

export default Login;
