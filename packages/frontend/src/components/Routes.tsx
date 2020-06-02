import * as React from "react";
import { Router } from "@reach/router";

const Routes: React.FC = (props) => <Router>{props.children}</Router>;

export default Routes;
