import * as React from "react";
import MaterialTextField, {
  TextFieldProps as MaterialTextFieldProps,
} from "@material-ui/core/TextField";

interface TextFieldProps {
  name: string;
}

const TextField: React.FC<TextFieldProps & MaterialTextFieldProps> = (
  props
) => (
  <MaterialTextField {...props} inputProps={{ "data-testid": props.name }} />
);

export default TextField;
