import * as React from "react";
import Button from "@material-ui/core/Button";

interface FormProps {
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = (props) => {
  const [dirty, setDirty] = React.useState(false);
  const [data, setData] = React.useState({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newData: { [name: string]: string } = { ...data };
    newData[event.target.name] = event.target.value;
    setData(newData);
  };

  React.useEffect(() => {
    const valueFound = Object.values(data).find((value) => value);
    setDirty(Boolean(valueFound));
  }, [data]);

  const children = props.children ?? [];

  const nodes = React.Children.map(children, (item: React.ReactNode) =>
    React.cloneElement(item as React.ReactElement, {
      onChange: handleChange,
    })
  );

  return (
    <React.Fragment>
      {nodes}
      <Button>Submit</Button>
      {dirty && <Button>Clear</Button>}
    </React.Fragment>
  );
};

export default Form;
