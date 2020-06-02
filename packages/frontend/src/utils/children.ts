import * as React from "react";
/* eslint-disable import/prefer-default-export */

export const mutateGrandChildren = (
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
