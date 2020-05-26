import * as React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { RouteComponentProps } from "@reach/router";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "1rem",
  },
}));

const handleChange = (
  setValue: React.Dispatch<React.SetStateAction<string>>,
  event: React.ChangeEvent<HTMLInputElement>
): void => {
  setValue(event.target.value);
};

const Register: React.FC<RouteComponentProps> = () => {
  const [dirty, setDirty] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState("");

  const classes = useStyles();

  const handleClear = (): void => {
    setUsername("");
    setPassword("");
    setVerifyPassword("");
  };

  React.useEffect(() => {
    if (username || password || verifyPassword) {
      setDirty(true);
    }

    if (!(username || password || verifyPassword)) {
      setDirty(false);
    }
  }, [username, password, verifyPassword]);

  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        Register
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          id="username"
          onChange={handleChange.bind(undefined, setUsername)}
          fullWidth
          label="Username"
          inputProps={{ "data-testid": "username" }}
          value={username}
        />

        <TextField
          fullWidth
          id="password"
          onChange={handleChange.bind(undefined, setPassword)}
          label="Password"
          inputProps={{ "data-testid": "password" }}
          value={password}
        />

        <TextField
          fullWidth
          id="verifyPassword"
          label="Verify password"
          onChange={handleChange.bind(undefined, setVerifyPassword)}
          inputProps={{ "data-testid": "verifyPassword" }}
          value={verifyPassword}
        />

        <ButtonGroup className={classes.root}>
          <Button color="primary">Submit</Button>
          {/* eslint-disable @typescript-eslint/no-unnecessary-condition */ dirty && (
            <Button id="clearButton" onClick={handleClear}>
              Clear
            </Button>
          )}
        </ButtonGroup>
      </form>
    </React.Fragment>
  );
};

export default Register;
