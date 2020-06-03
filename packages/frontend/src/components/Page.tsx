import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "1rem",
  },
  form: {
    padding: "1.5rem",
  },
}));

interface PageProps {
  children: React.ReactNode;
  title: string
}

const Page: React.FC<PageProps> = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.form} elevation={2}>
      <Typography variant="h2" gutterBottom>
        {props.title}
      </Typography>
      <Typography variant="body1">
      {props.children}
      </Typography>
    </Paper>
  );
};

export default Page;
