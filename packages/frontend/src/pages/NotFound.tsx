import * as React from "react";
import Page from "../components/Page";
import { ProtectedRouterComponentProps } from "../components/ProtectedRouter";

const NotFound: React.FC<ProtectedRouterComponentProps> = (): React.ReactElement => (
  <Page title="Not Found">
    <p>We couldn&apos;t find what you were looking for...</p>
  </Page>
);

export default NotFound;
