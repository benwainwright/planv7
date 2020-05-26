import { InversifyProvider, useDependency } from "./inversify-provider";
import React, { ReactElement } from "react";
import { Container } from "inversify";
import { render } from "@testing-library/react";

describe("ContainerContext", () => {
  it("Resolves dependency available when requested in children", () => {
    const container = new Container();

    const dependency = jest.fn();
    container.bind<Function>("foo").toConstantValue(dependency);

    const MockElement = (): ReactElement => {
      const foundDependency = useDependency<Function>("foo");
      foundDependency();
      return <></>;
    };

    render(
      <InversifyProvider container={container}>
        <MockElement />
      </InversifyProvider>
    );

    expect(dependency).toHaveBeenCalled();
  });

  it("Resolves dependency available when requested in grandchildren", () => {
    const container = new Container();

    const dependency = jest.fn();
    container.bind<Function>("foo").toConstantValue(dependency);

    const MockElement: React.FC<{}> = (props): ReactElement => {
      return <>{props.children}</>;
    };

    const MockElement2 = (): ReactElement => {
      const foundDependency = useDependency<Function>("foo");
      foundDependency();
      return <></>;
    };

    render(
      <InversifyProvider container={container}>
        <MockElement>
          <MockElement2 />
        </MockElement>
      </InversifyProvider>
    );

    expect(dependency).toHaveBeenCalled();
  });
});
