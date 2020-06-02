import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  UploadFileCommand,
} from "@choirpractise/domain";
import Button from "@material-ui/core/Button";
import Form from "../components/Form";
import Input from "../components/form-controls/Input";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const Files: React.FC<ProtectedRouterPageComponentProps> = (): React.ReactElement => {
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [path, setPath] = React.useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event?.target?.files && event.target.files.length > 0) {
      setFile(event?.target?.files[0]);
    }
  };

  const onPathChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPath(event?.target?.value);
  };

  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const doUpload = async (): Promise<void> => {
    await commandBus.execute(new UploadFileCommand(file, path));
  };

  return (
    <Form onSubmit={() => {}}>
      <Typography variant="h2">Files</Typography>
      <TextField
        value={path}
        onChange={onPathChange}
        name="path"
        id="path"
        label="Path"
      />
      <Input
        onChange={onFileChange}
        type="file"
        name="fileUpload"
        label="File Upload"
      />

      <Button onClick={doUpload}>Upload</Button>
    </Form>
  );
};

export default Files;
