import * as React from "react";
import Button from "@material-ui/core/Button";
import { navigate } from "@reach/router";

export interface NavigationButtonProps {
  readonly to: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = (
  props
): React.ReactElement => {
  return (
    <Button
      onClick={async (): Promise<void> => {
        await navigate(props.to);
      }}
      color="inherit"
    >
      {props.children}
    </Button>
  );
};

export default NavigationButton;
