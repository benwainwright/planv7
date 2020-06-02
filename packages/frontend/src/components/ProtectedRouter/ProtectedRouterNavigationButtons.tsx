import * as React from "react";

interface ProtectedRouterNavigationButtonsProps {
  children?: React.ReactNode;
}

const ProtectedRouterNavigationButtons: React.FC<ProtectedRouterNavigationButtonsProps> = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export default ProtectedRouterNavigationButtons;
