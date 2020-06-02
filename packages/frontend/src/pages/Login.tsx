import * as React from "react";
import { CommandBus, TYPES as DOMAIN, LoginCommand } from "@choirpractise/domain";
import Form, { FormData } from "../components/Form";
import Input from "../components/form-controls/Input"
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter/ProtectedRouter";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const USERNAME = "username";
const PASSWORD = "password";

const Login: React.FC<ProtectedRouterPageComponentProps> = () => {
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const handleSubmit = async (data: FormData): Promise<void> => {
    await commandBus.execute(new LoginCommand(data[USERNAME], data[PASSWORD]));
  };

  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        Login
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Input
          name={USERNAME}
          label="Username"
        />
        <Input
          name={PASSWORD}
          label="Password"
          type="password"
        />
      </Form>
    </React.Fragment>
  );
};

export default Login;
