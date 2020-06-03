import * as React from "react";
import Page from "../components/Page";
import { ProtectedRouterComponentProps } from "../components/ProtectedRouter";
import Redirect from "../utils/Redirect";

interface DefaultRouterPageProps {
  immediateRedirectTo?: string;
}

const NotFound: React.FC<
  ProtectedRouterComponentProps & DefaultRouterPageProps
> = (props): React.ReactElement => {
    <Redirect to={props.immediateRedirectTo} />
}

export default NotFound;
