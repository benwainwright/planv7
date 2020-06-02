import * as React from "react";
/* eslint-disable import/prefer-default-export */

export const mutateGrandChildren = (
  type: React.ElementType,
  children: React.ReactNode,
  mappingFunction: (children: React.ReactNode) => React.ReactNode
): React.ReactNode => {
  const map = React.Children.map(children, (child: React.ReactNode) =>
    !React.isValidElement(child)
      ? child
      : React.cloneElement(child, {
          ...child.props,
          children:
            (child as React.ReactElement).type ===
            React.createElement(type).type
              ? mappingFunction(child.props.children)
              : mutateGrandChildren(
                  type,
                  child.props.children,
                  mappingFunction
                ),
        })
  );

  return map && map.length === 1 ? map[0] : map;
};

export const findGrandChildOfType = (
  type: React.ElementType,
  children: React.ReactNode
): React.ReactNode => {
  const array = React.Children.toArray(children);
  const filtered = array.filter((node: React.ReactNode) =>
    React.isValidElement(node)
  );

  return filtered.reduce((found: React.ReactNode, current: React.ReactNode) => {
    const element = current as React.ReactElement;
    if (found) {
      return found;
    }

    if (element.type === React.createElement(type).type) {
      return current;
    }

    const foundInChildren = findGrandChildOfType(type, element.props.children);
    if (foundInChildren) {
      return foundInChildren;
    }

    return found;
  }, undefined);
};
