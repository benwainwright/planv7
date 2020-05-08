// This is mostly stolen from https://itnext.io/dependency-injection-in-react-using-inversifyjs-now-with-react-hooks-64f7f077cde6

import React, { useContext } from "react";
import { Container, interfaces } from "inversify";

export interface InversifyProviderProps {
  container?: Container;
}

export const InversifyContext: React.Context<InversifyProviderProps> = React.createContext<
  InversifyProviderProps
>({ container: undefined });

export const InversifyProvider: React.FC<InversifyProviderProps> = properties => 
  <InversifyContext.Provider value={properties}>
    {properties.children}
  </InversifyContext.Provider>
;

export const useOptionalDependency = <T,>(
  identifier: interfaces.ServiceIdentifier<T>
): T | undefined => {
  try {
    return useDependency<T>(identifier);
  } catch {
    return undefined;
  }
};

export const useDependency = <T,>(
  identifier: interfaces.ServiceIdentifier<T>
): T => {
  const { container } = useContext(InversifyContext);
  if (!container) {
    throw new Error("Context not configured with inversify container");
  }
  return container.get<T>(identifier);
};
