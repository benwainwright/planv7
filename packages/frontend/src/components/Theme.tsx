import { createMuiTheme } from "@material-ui/core/styles";

const Theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: "2rem"
    },
    h2: {
      fontSize: "1.5rem"
    },
    h3: {
      fontSize: "1.2rem"
    }
  },
  overrides: {

    MuiAppBar: {
      root: {
        flexGrow: 1,
        marginBottom: "2rem",
      },
    },
    MuiContainer: {
      root: {
        width: "80%"
      }
    },
    MuiFormControl: {
      root: {
        display: "flex",
        minWidth: "30rem"
      }
    }
  }
});

export default Theme;
