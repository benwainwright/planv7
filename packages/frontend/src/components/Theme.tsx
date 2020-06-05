import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const RawTheme = createMuiTheme({
  palette: {
    type: "light"
  },
  typography: {
    htmlFontSize: 16,
    h1: {
      textAlign:"center",
      fontSize: "2rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.5rem",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        flexGrow: 1,
        marginBottom: "2rem",
      },
    },
    MuiInput: {
      root: {
        display: "block",
      },
    },
    MuiContainer: {},
    MuiFormControl: {
      root: {
        display: "block",
        minWidth: "30rem",
      },
    },
  },
});

if (RawTheme.overrides?.MuiContainer) {
  RawTheme.overrides.MuiContainer = {
    root: {
      [RawTheme.breakpoints.up("md")]: {
        width: "95%",
      },
      [RawTheme.breakpoints.up("lg")]: {
        width: "70%",
      },
    },
  };
}
const Theme = responsiveFontSizes(RawTheme);

export default Theme;
