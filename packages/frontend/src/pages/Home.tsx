import * as React from "react";
import Page from "../components/Page";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter";
import Typography from "@material-ui/core/Typography";

const Home: React.FC<ProtectedRouterPageComponentProps> = (
  props
): React.ReactElement => (
  <Page title={props.title}>
    <Typography variant="body1">
    If you are interested in the technical implementation of this app, please see the <a href="https://gitlab.com/benwainwright/choirpractise">Gitlab Repository</a>
    </Typography>
  </Page>
);

export default Home;
