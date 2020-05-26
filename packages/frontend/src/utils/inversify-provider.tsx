// This is mostly stolen from https://itnext.io/dependency-injection-in-react-using-inversifyjs-now-with-react-hooks-64f7f077cde6

import { Container, interfaces } from "inversify";
import React, { useContext } from "react";

export interface InversifyContainerContextProps {
  container?: Container;
}

const InversifyContainerContext: React.Context<InversifyContainerContextProps> = React.createContext<
  InversifyContainerContextProps
>({ container: undefined });

export const InversifyProvider: React.FC<InversifyContainerContextProps> = (
  props
) => (
  <InversifyContainerContext.Provider value={props}>
    {props.children}
  </InversifyContainerContext.Provider>
);

export const useDependency = <T extends unknown>(
  identifier: interfaces.ServiceIdentifier<T>
): T => {
  const { container } = useContext(InversifyContainerContext);
  if (!container) {
    throw new Error("Context not configured with inversify container");
  }
  return container.get<T>(identifier);
};

export const useOptionalDependency = <T extends unknown>(
  identifier: interfaces.ServiceIdentifier<T>
): T | undefined => {
  try {
    return useDependency<T>(identifier);
  } catch {
    return undefined;
  }
};

