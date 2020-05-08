import * as React from "react";

export interface AppProps {
  compiler: string;
  framework: string;
}

const App: React.FC<AppProps> = (props: AppProps): React.ReactElement => (
  <h1>
    App from {props.compiler} and {props.framework}
  </h1>
);

export default App;
