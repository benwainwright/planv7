import * as React from "react";
import { ProtectedRouterComponentProps } from "../components/ProtectedRouter";

const Home: React.FC<ProtectedRouterComponentProps> = (): React.ReactElement => (
  <React.Fragment>
    <h1>Welcome!</h1>
    <p>Lorum ipsum</p>
  </React.Fragment>
);

export default Home;
