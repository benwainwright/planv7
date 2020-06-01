import * as React from "react";
import { ProtectedRouterComponentProps } from "../components/ProtectedRouter";

const NotFound: React.FC<ProtectedRouterComponentProps> = (): React.ReactElement => (
  <React.Fragment>
    <h1>Whoops!</h1>
    <p>We couldn&apos;t find what you were looking for...</p>
  </React.Fragment>
);

export default NotFound;
