import * as React from "react";
import { ProtectedRouterPageComponentProps } from "../components/ProtectedRouter";

const Home: React.FC<ProtectedRouterPageComponentProps> = (): React.ReactElement => (
  <React.Fragment>
    <h1>Welcome!</h1>
    <p>Lorum ipsum</p>
  </React.Fragment>
);

export default Home;
