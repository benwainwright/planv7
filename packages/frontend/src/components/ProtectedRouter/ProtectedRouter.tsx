import * as React from "react";
import { RouteComponentProps } from "@reach/router";
import CurrentUserContext from "../../utils/CurrentUserContext";
import Routes from "./Routes";
import { User } from "@choirpractise/domain";
import { mutateGrandChildren } from "../../utils/children";

export interface ProtectedRouterComponentProps extends RouteComponentProps {
  public?: boolean;
  onlyPublic?: boolean;
}

export interface ProtectedRouterPageComponentProps
  extends ProtectedRouterComponentProps {
  title: string;
}

const allow = (route: React.ReactElement, loggedIn: boolean): boolean =>
  route.props.public ||
  (route.props.onlyPublic && !loggedIn) ||
  (!route.props.onlyPublic && loggedIn);

const secureRoutes = (
  children: React.ReactNode,
  user?: User
): React.ReactNode => {
  const theDefault = React.Children.toArray(children)
    .filter((node: React.ReactNode) => React.isValidElement(node))
    .find(
      (element: React.ReactNode) =>
        (element as React.ReactElement).props.default
    ) as React.ReactElement;

  if (!theDefault) {
    throw new Error("ProtectedRouter must contain a 'default' route");
  }

  if (!theDefault.props.public) {
    throw new Error("'Default' route in a ProtectedRouter must be public");
  }

  return React.Children.map(children, (child: React.ReactNode) =>
    allow(child as React.ReactElement, Boolean(user)) ? child : theDefault
  );
};

const ProtectedRouter: React.FC = (props) => {
  const currentUser = React.useContext(CurrentUserContext);


  const processedChildren = mutateGrandChildren(
    Routes,
    props.children,
    (children: React.ReactNode) =>
      secureRoutes(children, currentUser)
  );

  return <React.Fragment>{processedChildren}</React.Fragment>;
};

export default ProtectedRouter;
