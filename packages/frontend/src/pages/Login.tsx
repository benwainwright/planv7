import * as React from "react";
import { CommandBus, TYPES as DOMAIN, LoginCommand } from "@planv7/domain";
import Form, { FormData } from "../components/Form";
import { RouteComponentProps } from "@reach/router";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const PASSWORD = "password";

const Login: React.FC<RouteComponentProps> = () => {
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const handleSubmit = async (data: FormData): Promise<void> => {
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
          name={PASSWORD}
          label="Password"
          inputProps={{ "data-testid": PASSWORD }}
        />
      </Form>
    </React.Fragment>
  );
};

export default Login;
