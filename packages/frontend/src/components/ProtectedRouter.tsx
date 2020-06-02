import * as React from "react";
import { RouteComponentProps, Router } from "@reach/router";
import CurrentUserContext from "../utils/CurrentUserContext";
import Routes from "./Routes";

export interface ProtectedRouterComponentProps extends RouteComponentProps {
  public?: boolean;
}

const mutateGrandChildren = (
  type: React.ElementType,
  children: React.ReactNode,
  mappingFunction: (children: React.ReactNode) => React.ReactNode
): React.ReactNode =>
  React.Children.map(children, (child: React.ReactNode) =>
    !React.isValidElement(child)
      ? child
      : React.cloneElement(child, {
          ...child.props,
          children:
            (child as React.ReactElement).type === React.createElement(type).type
              ? mappingFunction(child.props.children)
              : mutateGrandChildren(
                  type,
                  child.props.children,
                  mappingFunction
                ),
        })
  );

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
      (child as React.ReactElement).props.public || currentUser
        ? child
        : theDefault
    );
  };

  const processedChildren = mutateGrandChildren(
    Routes,
    props.children,
    routesMapper
  );

  return <React.Fragment>{processedChildren}</React.Fragment>
};

export default ProtectedRouter;
