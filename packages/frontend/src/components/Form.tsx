import * as React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";

interface FormProps {
  submitText?: string;
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
}

export interface FormData {
  values: { [name: string]: string };
  file?: File;
}

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: "0.5rem",
  },
  buttons: {
    marginTop: "1.5rem",
    margin: "0",
  },
}));

const Form: React.FC<FormProps> = (props) => {
  const [dirty, setDirty] = React.useState(false);
  const [data, setData] = React.useState<FormData>({
    values: {},
    file: undefined,
  });
  const classes = useStyles();

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();
    props.onSubmit(data);
  };

  const handleClear = (): void => {
    setData({ values: {}, file: undefined });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newData = { values: { ...data.values }, file: data.file };
    newData.values[event.target.name] = event.target.value;
    if (event.target.files) {
      newData.file = event.target.files[0];
    }

    setData(newData);
  };

  React.useEffect(() => {
    const valueFound = Object.values(data).find((value) => value);
    setDirty(Boolean(valueFound));
  }, [data]);

  const nodes = React.Children.map(props.children, (item: React.ReactNode) => {
    const elementItem = item as React.ReactElement;
    return elementItem?.props?.name
      ? React.cloneElement(elementItem, {
          onChange: handleChange,
          value: data.values[elementItem.props.name] || "",
        })
      : elementItem;
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Box flexDirection="column">
        {nodes}
        <ButtonGroup className={classes.buttons}>
          <Button type="submit" onClick={handleSubmit}>
            {props.submitText ?? "Submit"}
          </Button>
          {dirty && <Button onClick={handleClear}>Clear</Button>}
        </ButtonGroup>
      </Box>
    </form>
  );
};

export default Form;
