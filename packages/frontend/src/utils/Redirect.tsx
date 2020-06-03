import * as HttpStatus from "http-status-codes";
import { Redirect as ReachRedirect, RedirectProps } from "@reach/router";
import { ProtectedRouterComponentProps } from "../components/ProtectedRouter";

import React from "react";
import { ServerResponse } from "http";
import canUseDom from "./canUseDom";
import { useOptionalDependency } from "./inversify-provider";

const Redirect: React.FC<RedirectProps<{}> & ProtectedRouterComponentProps> = (props: RedirectProps<{}>) => {
  const response = useOptionalDependency<ServerResponse>(ServerResponse);
  if (canUseDom) {
    return <ReachRedirect {...props} />;
  } else if (response) {
    response.writeHead(HttpStatus.MOVED_TEMPORARILY, {
      Location: props.to.toString(),
    });
  }
  return <></>;
};

export default Redirect;
