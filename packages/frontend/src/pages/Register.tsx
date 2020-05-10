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

const Register: React.FC<RouteComponentProps> = () => {
  const [dirty, setDirty] = React.useState(false);

  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        Register
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          id="username"
          onChange={(): void => setDirty(true)}
          fullWidth
          label="Username"
        />

        <TextField
          fullWidth
          id="password"
          onChange={(): void => setDirty(true)}
          label="Password"
        />
        <TextField fullWidth id="verifyPassword" label="Verify password" />
        <ButtonGroup className={classes.root}>
          <Button color="primary">Submit</Button>
          {dirty && <Button id="clearButton">Clear</Button>}
        </ButtonGroup>
      </form>
    </React.Fragment>
  );
};

export default Register;
