import React, { ReactElement } from "react";

import { Container } from "inversify";
import { configure, mount } from "enzyme";
import { InversifyProvider, useDependency } from "./InversifyProvider";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("ContainerContext", () => {
  it("Resolves dependency available when requested in children", () => {
    const container = new Container();

    container.bind<string>("foo").toConstantValue("bar");

    let result = "";

    const MockElement = (): ReactElement => {
      result = useDependency("foo");
      return <></>;
    };

    mount(
      <InversifyProvider container={container}>
        <MockElement />
      </InversifyProvider>
    );

    expect(result).toEqual("bar");
  });

  it("Resolves dependency available when requested in grandchildren", () => {
    const container = new Container();

    container.bind<string>("foo").toConstantValue("bar");

    let result = "";

    const MockElement: React.FC<{}> = (properties): ReactElement => {
      return <>{properties.children}</>;
    };

    const MockElement2 = (): ReactElement => {
      result = useDependency("foo");
      return <></>;
    };

    mount(
      <InversifyProvider container={container}>
        <MockElement>
          <MockElement2 />
        </MockElement>
      </InversifyProvider>
    );

    expect(result).toEqual("bar");
  });
});
