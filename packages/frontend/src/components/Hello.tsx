import * as React from "react";

export interface HelloProps {
  compiler: string;
  framework: string;
}

const Hello: React.FC<HelloProps> = (props: HelloProps): React.ReactElement => (
  <h1>
    Hello from {props.compiler} and {props.framework}
  </h1>
);

export default Hello;
