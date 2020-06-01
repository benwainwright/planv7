import * as React from "react";
import { RouteComponentProps, Router } from "@reach/router";
import CurrentUserContext from "../utils/CurrentUserContext";

interface ProtectedRouterProps {
  readonly children: React.ReactNode;
}

export interface ProtectedRouterComponentProps extends RouteComponentProps {
  public?: boolean;
}

const ProtectedRouter: React.FC<ProtectedRouterProps> = (props) => {
  const currentUser = React.useContext(CurrentUserContext);

  const theDefault = React.Children.toArray(props.children).find(
    (child) => (child as React.ReactElement).props.default
  ) as React.ReactElement;

  if (!theDefault) {
    throw new Error("ProtectedRouter must contain a 'default' route");
  }

  if (!theDefault.props.public) {
    throw new Error("'Default' route in a ProtectedRouter must be public");
  }

  const renderedChildren = React.Children.map(
    props.children,
    (child: React.ReactNode) =>
      (child as React.ReactElement).props.public || currentUser
        ? child
        : theDefault
  );

  return <Router>{renderedChildren}</Router>;
};

export default ProtectedRouter;
