import { Command } from "@choirpractise/domain";
import HandlerBase from "./HandlerBase";

describe("Handler", (): void => {
  describe("tryHandle", (): void => {
    it("Executes command if identifier and instance match", async (): Promise<
      void
    > => {
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

      // eslint-disable-next-line fp/no-let
      let executed = false;
      class MockHandler2 extends HandlerBase<MockCommand2> {
        public getCommandInstance(): MockCommand2 {
          return new MockCommand2();
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        protected async execute(command: MockCommand1): Promise<void> {
          executed = true;
        }
      }

      const handler = new MockHandler2();
      const command = new MockCommand1();
      await handler.tryHandle(command);

      expect(executed).toEqual(false);

      const command2 = new MockCommand2();
      await handler.tryHandle(command2);
      expect(executed).toEqual(true);
    });
  });

  // It("Marks command as executed if instances match", async (): Promise<
  //   void
  // > => {
  //   class MockCommand1 extends Command {
  //     public identifier(): string {
  //       return "MockCommand1";
  //     }
  //   }
  //   class MockCommand2 extends Command {
  //     public identifier(): string {
  //       return "MockCommand2";
  //     }
  //   }

  //   class MockHandler2 extends HandlerBase<MockCommand2> {
  //     public getCommandInstance(): MockCommand2 {
  //       return new MockCommand2();
  //     }

  //     protected async execute(
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       command: MockCommand1
  //     ): Promise<DomainEvent> {
  //       return Substitute.for<DomainEvent>();
  //     }
  //   }

  //   const handler = new MockHandler2();
  //   const command = Substitute.for<MockCommand1>();
  //   handler.tryHandle(command);
  //   command.didNotReceive().markHandlingComplete();
  //   const command2 = Substitute.for<MockCommand2>();
  //   await handler.tryHandle(command2);
  //   command.received().markHandlingComplete();
  // });
});
