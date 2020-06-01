import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  UploadFileCommand,
} from "@choirpractise/domain";
import { RouteComponentProps } from "@reach/router";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDependency } from "../utils/inversify-provider";

const Files: React.FC<RouteComponentProps> = (): React.ReactElement => {
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
    <React.Fragment>
      <Typography variant="h2">Files</Typography>

      <input onChange={onFileChange} type="file" title="fileUpload" />
      <TextField
        value={path}
        onChange={onPathChange}
        name="path"
        id="path"
        label="path"
      />
      <button onClick={doUpload}>Upload</button>
    </React.Fragment>
  );
};

export default Files;