import * as React from "react";
import Page from "../components/Page";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter";

const Home: React.FC<ProtectedRouterPageComponentProps> = (
  props
): React.ReactElement => (
  <Page title={props.title}>
    <p>Welcome to the homepage!</p>
  </Page>
);

export default Home;
