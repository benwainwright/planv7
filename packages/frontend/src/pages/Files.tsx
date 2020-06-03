import * as React from "react";
import {
  CommandBus,
  TYPES as DOMAIN,
  UploadFileCommand,
} from "@choirpractise/domain";
import Form, { FormData } from "../components/Form";
import FileUploadInput from "../components/form-controls/FileUploadInput";
import Input from "../components/form-controls/Input";
import Page from "../components/Page";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter";
import { useDependency } from "../utils/inversify-provider";

const FILE = "file";
const PATH = "path";

const Files: React.FC<ProtectedRouterPageComponentProps> = (
  props
): React.ReactElement => {
  const commandBus = useDependency<CommandBus>(DOMAIN.commandBus);

  const doUpload = async (data: FormData): Promise<void> => {
    await commandBus.execute(
      new UploadFileCommand(data.file, data.values[PATH] as string)
    );
  };

  return (
    <Page title={props.title}>
      <Form onSubmit={doUpload} submitText="Upload">
        <FileUploadInput name="fileUpload" label="File Upload" />
        <Input name={PATH} label="Path" />
      </Form>
    </Page>
  );
};

export default Files;
