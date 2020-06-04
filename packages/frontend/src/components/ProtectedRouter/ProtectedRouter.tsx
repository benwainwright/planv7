import * as React from "react";
import {
  findGrandChildOfType,
  mutateGrandChildren,
} from "../../utils/children";
import CurrentUserContext from "../../utils/CurrentUserContext";
import Drawer from "../Drawer";
import DrawerItem from "../DrawerItem";
import { RouteComponentProps } from "@reach/router";
import Routes from "./Routes";
import { User } from "@choirpractise/domain";

export interface ProtectedRouterComponentProps extends RouteComponentProps {
  public?: boolean;
  onlyPublic?: boolean;
  redirectWhenBlockedTo?: string;
}

export interface ProtectedRouterPageComponentProps
  extends ProtectedRouterComponentProps {
  title: string;
  icon: React.ReactElement;
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

  const childrenWithSecuredRoutes = mutateGrandChildren(
    Routes,
    props.children,
    (children: React.ReactNode) => secureRoutes(children, currentUser)
  );

  const routesElement = findGrandChildOfType(Routes, childrenWithSecuredRoutes);

  const securedChildren = mutateGrandChildren(
    Drawer,
    childrenWithSecuredRoutes,
    () => {
      const array = React.Children.toArray(
        (routesElement as React.ReactElement).props.children
      );
      const filtered = array.filter(
        (node: React.ReactNode) =>
          (node as React.ReactElement).props.title &&
          allow(node as React.ReactElement, Boolean(currentUser))
      );

      return filtered.map((child: React.ReactNode) => {
        const route = child as React.ReactElement;
        return (
          <DrawerItem
            key={route.props.title}
            to={route.props.path}
            text={route.props.title}
            icon={route.props.icon}
          />
        );
      });
    }
  );

  return <React.Fragment>{securedChildren}</React.Fragment>;
};

export default ProtectedRouter;
