import "reflect-metadata";
import { Arg, Substitute } from "@fluffy-spoon/substitute";

import { Command, Handler } from "@planv5/domain/ports";
import { HandlerBase } from "./handlerBase";
import { ApplicationError } from "../errors/applicationError";
import { Logger } from "../ports/logger";
import { SimpleCommandBus } from "./simpleCommandBus";
import { Dispatch } from "../ports/dispatch";

class MockCommand1 extends Command {
  public identifier(): string {
    return "MockCommand1";
  }
}
class MockCommand2 extends Command {
  public identifier(): string {
    return "MockCommand2";
  }
}
class MockCommand3 extends Command {
  public identifier(): string {
    return "MockCommand3";
  }
}

class MockCommand4 extends Command {
  public identifier(): string {
    return "MockCommand4";
  }
}
describe("SimpleCommandBus", (): void => {
  test("Attempts to handle single command", async (): Promise<void> => {
    let executed = false;
    class MockHandler extends HandlerBase<MockCommand1> {
      public getCommandInstance(): MockCommand1 {
        return new MockCommand1();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      protected async execute(command: MockCommand1): Promise<void> {
        executed = true;
      }
    }
    const command = new MockCommand1();
    const handler = new MockHandler();
    const logger = Substitute.for<Logger>();

    const bus = new SimpleCommandBus([handler], logger);

    try {
      await bus.execute(command);
    } catch (error) {
      fail(`Threw error: ${error}`);
    }

    expect(executed).toEqual(true);
  });

  test("Bus keeps looking for handlers if found command is marked as handling incomplete", async (): Promise<
    void
  > => {
    let executed = false;
    class MockHandler2 extends HandlerBase<MockCommand2> {
      public getCommandInstance(): MockCommand2 {
        return new MockCommand2();
      }

      protected async execute(command: MockCommand1): Promise<void> {
        executed = true;
        command.markHandlingIncomplete();
      }
    }

    const command = new MockCommand2();
    const handler1 = Substitute.for<Handler<MockCommand1>>();
    const handler2 = new MockHandler2();

    handler1.getCommandInstance().returns(new MockCommand1());

    const logger = Substitute.for<Logger>();

    const bus = new SimpleCommandBus([handler1, handler2], logger);

    try {
      await bus.execute(command);
      fail("Didn't throw ApplicationError");
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationError);
    }

    expect(executed).toBe(true);
  });

  test("Tries all the handlers till it finds one, then stops", async (): Promise<
    void
  > => {
    class MockHandler1 extends HandlerBase<MockCommand2> {
      public getCommandInstance(): MockCommand2 {
        return new MockCommand2();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      protected async execute(command: MockCommand1): Promise<void> {}
    }
    class MockHandler2 extends HandlerBase<MockCommand2> {
      public getCommandInstance(): MockCommand2 {
        return new MockCommand2();
      }

      protected async execute(command: MockCommand1): Promise<void> {
        command.markHandlingIncomplete();
      }
    }
    const command = new MockCommand2();
    const handler1 = new MockHandler1();
    const handler2 = new MockHandler2();
    const handler3 = Substitute.for<Handler<MockCommand3>>();
    const handler4 = Substitute.for<Handler<MockCommand4>>();

    handler3.getCommandInstance().returns(new MockCommand3());
    handler4.getCommandInstance().returns(new MockCommand4());
    const logger = Substitute.for<Logger>();

    const bus = new SimpleCommandBus([handler1, handler2], logger);

    try {
      await bus.execute(command);
    } catch (e) {
      fail(`Error thrown: ${e}`);
    }

    handler3.didNotReceive().tryHandle(Arg.any());
    handler4.didNotReceive().tryHandle(Arg.any());
  });

  test("Tries all the handlers then throws an error if none handle and there is no dispatcher", async (): Promise<
    void
  > => {
    const command = new MockCommand1();

    const handler2 = Substitute.for<Handler<MockCommand2>>();
    const handler3 = Substitute.for<Handler<MockCommand3>>();

    handler2.getCommandInstance().returns(new MockCommand2());
    handler3.getCommandInstance().returns(new MockCommand3());

    const logger = Substitute.for<Logger>();

    const bus = new SimpleCommandBus([handler2, handler3], logger);

    try {
      await bus.execute(command);
      fail("Didn't throw ApplicationErrro");
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationError);
    }

    handler2.received().tryHandle(command);
    handler3.received().tryHandle(command);
  });

  test("Tries all the handlers then calls the dispatcher if there is one", async (): Promise<
    void
  > => {
    const command = new MockCommand1();

    const handler2 = Substitute.for<Handler<MockCommand2>>();
    const handler3 = Substitute.for<Handler<MockCommand3>>();
    const dispatcher = Substitute.for<Dispatch>();

    handler2.getCommandInstance().returns(new MockCommand2());
    handler3.getCommandInstance().returns(new MockCommand3());

    const logger = Substitute.for<Logger>();

    const bus = new SimpleCommandBus([handler2, handler3], logger, dispatcher);

    try {
      await bus.execute(command);
    } catch (error) {
      fail("Threw error during execute");
    }

    handler2.received().tryHandle(command);
    handler3.received().tryHandle(command);
    dispatcher.received().dispatch(command);
  });
});
