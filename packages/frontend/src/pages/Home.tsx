import * as React from "react";
import Page from "../components/Page";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter";

const Home: React.FC<ProtectedRouterPageComponentProps> = (
  props
): React.ReactElement => (
  <Page title={props.title}>
    <p>If you are interested in the technical implementation of this app, please see the <a href="https://gitlab.com/benwainwright/choirpractise">Gitlab Repository</a></p>
  </Page>
);

export default Home;
