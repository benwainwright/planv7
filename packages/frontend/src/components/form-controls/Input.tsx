import * as React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MuiInput from "@material-ui/core/Input";

interface InputProps {
  label: string;
  name?: string;
  value?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = (props) => {

  return (
    <FormControl>
      <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
      <MuiInput
        name={props.name}
        id={props.name}
        aria-describedby="my-helper-text"
        value={props.value}
        type={props.type}
        onChange={props.onChange}
      />
      <FormHelperText id="my-helper-text"></FormHelperText>
    </FormControl>
  );
};

export default Input;
