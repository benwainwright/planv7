import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./Header";

const App: React.FC = (): React.ReactElement => {
  React.useEffect(() => {
    const cssStyles = document.querySelector("#css-server-side");
    if (cssStyles) {
      cssStyles.remove();
    }
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />
    </React.Fragment>
  );
};

export default App;
