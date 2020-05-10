import * as React from "react";
import { RouteComponentProps } from "@reach/router";

const Home: React.FC<RouteComponentProps> = (): React.ReactElement => (
  <React.Fragment>
    <h1>Welcome!</h1>
    <p>Lorum ipsum</p>
  </React.Fragment>
);

export default Home;
