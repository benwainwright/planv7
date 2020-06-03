import * as React from "react";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import { InputProps } from "./Input";
import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  wrapper: {
    marginTop: "0.7em",
  },
  label: {
    marginTop: "0.3rem",
    marginLeft: "0.3rem",
  },
  input: {
    paddingLeft: "0.3rem",
  },
}));

const FileUploadInput: React.FC<InputProps> = (props) => {
  const [filename, setFilename] = React.useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {

    if (event.target?.files && event.target?.files.length > 0) {
      setFilename(event.target.files[0].name);
    }

    if (props.onChange) {
      props.onChange(event);
    }
  };

  const classes = useStyles();
  return (
    <Paper variant="outlined" className={classes.wrapper}>
      <InputLabel className={classes.label} htmlFor={props.name}>
        {props.label}
      </InputLabel>
      <Button id={`${props.name}-button`} title={`${props.name}-button`}>
        {filename || "Click to select"}
      </Button>
      <input
        id={props.name}
        type="file"
        name={props.name}
        title={props.name}
        onChange={onFileChange}
        style={{
          display: "none",
        }}
      />
    </Paper>
  );
};

export default FileUploadInput;
