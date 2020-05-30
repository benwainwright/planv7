import * as React from "react";

const mockModule = (): {
  __esModule: boolean;
  default: () => React.ReactElement;
} => ({
  __esModule: true,
  default: (): React.ReactElement =>
    React.createElement("mock", { props: { displayName: "mock" } }),
});

export default mockModule
