import * as React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MuiInput from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  wrapper: {
    marginTop: "0.7rem",
  },
  label: {
    marginTop: "0.3rem",
    marginLeft: "0.3rem",
  },
  input: {
    paddingLeft: "0.3rem",
  },
}));

export interface InputProps {
  label: string;
  name?: string;
  value?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = (props) => {
  const classes = useStyles();
  return (
    <Paper variant="outlined" className={classes.wrapper}>
      <InputLabel className={classes.label} htmlFor={props.name}>
        {props.label}
      </InputLabel>

      <MuiInput
        className={classes.input}
        disableUnderline={true}
        name={props.name}
        id={props.name}
        aria-describedby="my-helper-text"
        title={props.name}
        value={props.value}
        type={props.type}
        onChange={props.onChange}
      />
      <FormHelperText id="my-helper-text"></FormHelperText>
    </Paper>
  );
};

export default Input;
