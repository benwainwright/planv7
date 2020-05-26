import * as React from "react";
import Button from "@material-ui/core/Button";

interface FormProps {
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  [name: string]: string;
}

const Form: React.FC<FormProps> = (props) => {
  const [dirty, setDirty] = React.useState(false);
  const [data, setData] = React.useState<FormData>({});

  const handleSubmit = (): void => {
    props.onSubmit(data);
  };

  const handleClear = (): void => {
    setData({});
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newData = { ...data };
    newData[event.target.name] = event.target.value;
    setData(newData);
  };

  React.useEffect(() => {
    const valueFound = Object.values(data).find((value) => value);
    setDirty(Boolean(valueFound));
  }, [data]);

  const nodes = React.Children.map(props.children, (item: React.ReactNode) => {
    const elementItem = item as React.ReactElement;
    return elementItem.props.name
      ? React.cloneElement(elementItem, {
          onChange: handleChange,
          value: data[elementItem.props.name] || "",
        })
      : elementItem;
  });

  return (
    <React.Fragment>
      {nodes}
      <Button onClick={handleSubmit}>Submit</Button>
      {dirty && <Button onClick={handleClear}>Clear</Button>}
    </React.Fragment>
  );
};

export default Form;
