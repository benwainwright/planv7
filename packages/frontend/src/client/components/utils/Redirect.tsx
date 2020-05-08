import React from "react";
import { ServerResponse } from "http";
import { Redirect as ReactRouterRedirect, RedirectProps } from "react-router";
import { useOptionalDependency } from "./InversifyProvider";
import { canUseDom } from "../../utils/canUseDOM";

export const Redirect: React.FC<RedirectProps> = properties => {
  const response = useOptionalDependency<ServerResponse>(ServerResponse);
  if (canUseDom) {
    return <ReactRouterRedirect {...properties} />;
  } else if (response) {
    response.writeHead(302, { Location: properties.to.toString() });
  }
  return null;
};
