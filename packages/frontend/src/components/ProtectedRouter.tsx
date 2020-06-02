import * as React from "react";
import CurrentUserContext from "../utils/CurrentUserContext";
import { RouteComponentProps } from "@reach/router";
import Routes from "./Routes";
import { mutateGrandChildren } from "../utils/children";

export interface ProtectedRouterComponentProps extends RouteComponentProps {
  public?: boolean;
  onlyPublic?: boolean;
}

const allow = (route: React.ReactElement, loggedIn: boolean): boolean =>
  route.props.public || (route.props.onlyPublic && !loggedIn) || (!route.props.public && loggedIn)

const ProtectedRouter: React.FC = (props) => {
  const currentUser = React.useContext(CurrentUserContext);

  const routesMapper = (children: React.ReactNode): React.ReactNode => {
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
      allow(child as React.ReactElement, Boolean(currentUser))
        ? child
        : theDefault
    );
  };

  const processedChildren = mutateGrandChildren(
    Routes,
    props.children,
    routesMapper
  );

  return <React.Fragment>{processedChildren}</React.Fragment>;
};

export default ProtectedRouter;
