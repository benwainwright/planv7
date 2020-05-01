import { Command } from "../ports/command";
import { DomainError } from "../errors/DomainError";
import { Serialiser } from "./serialiser";
import * as COMMANDS from "../commands/index";
import {
  GetAllUsersCommand,
  RegisterUserCommand,
  LoginCommand
} from "../commands";

class MyMockCommand extends Command {
  private readonly x: string;
  private readonly y: string;
  private readonly z: number;

  public identifier(): string {
    return "MyMockCommand";
  }

  public constructor(x: string, y: string, z: number) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class MyCommandWithNesting extends Command {
  public identifier(): string {
    return "MyCommandWithNesting";
  }

  public otherCommand: MyMockCommand;

  public constructor(c: MyMockCommand) {
    super();
    this.otherCommand = c;
  }
}

class MyMockCommandWithAnObjectKey extends Command {
  public identifier(): string {
    return "MyMockCommandWithAnObjectKey";
  }

  public obj: { foo: string };

  public constructor(foo: { foo: string }) {
    super();
    this.obj = foo;
  }
}

class MyMockCommandWithAnArrayOfMockCommands extends Command {
  public identifier(): string {
    return "MyMockCommandWithAnArrayOfMockCommands";
  }

  public array: MyMockCommand[];

  public constructor(array: MyMockCommand[]) {
    super();
    this.array = array;
  }
}

describe("serialiseCommand", (): void => {
  it("Creates a JSON string with the type of the command at the root", (): void => {
    const command = new MyMockCommand("a", "b", 1);
    const serialiser = new Serialiser(COMMANDS);
    const jsonString = serialiser.serialise(command);
    const obj = JSON.parse(jsonString);
    expect(obj["$"]).toEqual("MyMockCommand");
  });

  it("Creates a JSON string with an instance definition within it", (): void => {
    const command = new MyMockCommand("a", "b", 1);
    const serialiser = new Serialiser(COMMANDS);
    const jsonString = serialiser.serialise(command);
    const obj = JSON.parse(jsonString);
    expect(obj.instance).toBeDefined();
  });

  it("Creates an instance definition with the correct properties", (): void => {
    const command = new MyMockCommand("a", "b", 1);
    const serialiser = new Serialiser(COMMANDS);
    debugger;
    const jsonString = serialiser.serialise(command);
    const obj = JSON.parse(jsonString);
    expect(obj.instance.x).toEqual("a");
    expect(obj.instance.y).toEqual("b");
    expect(obj.instance.z).toEqual(1);
  });

  it("Creates a string which results in an identical command when unserialized", (): void => {
    let inputRegisterUsers = new RegisterUserCommand("foo", "a@.com", "bash");
    const serialiser = new Serialiser(COMMANDS);
    let jsonString = serialiser.serialise(inputRegisterUsers);
    let output = serialiser.unSerialise(jsonString);
    expect(output).toEqual(inputRegisterUsers);

    const inputAllUsers = new GetAllUsersCommand();
    jsonString = serialiser.serialise(inputAllUsers);
    output = serialiser.unSerialise(jsonString);
    expect(output).toEqual(inputAllUsers);

    const inputLogin = new LoginCommand("fooo", "bar");

    jsonString = serialiser.serialise(inputLogin);
    output = serialiser.unSerialise(jsonString);
    expect(output).toEqual(inputLogin);
  });

  it("works correctly for serializable error objects", () => {
    const error = new DomainError("foo");
    const serialiser = new Serialiser({ DomainError });
    const jsonString = serialiser.serialise(error);
    const obj = JSON.parse(jsonString);
    expect(obj.instance).toBeDefined();
    expect(obj.instance.message).toEqual("foo");
  });

  it("does not serialize the stack trace of error objects", () => {
    const error = new DomainError("foo");
    const serialiser = new Serialiser({ DomainError });
    const jsonString = serialiser.serialise(error);
    const obj = JSON.parse(jsonString);
    expect(obj.instance).toBeDefined();
    expect(obj.instance.stack).not.toBeDefined();
  });

  it("Serialises object keys with 'type -> object' data", () => {
    const command = new MyMockCommandWithAnObjectKey({ foo: "bar" });
    const serialiser = new Serialiser({ MyMockCommandWithAnObjectKey });
    const jsonString = serialiser.serialise(command);
    const obj = JSON.parse(jsonString);
    expect(obj.instance).toBeDefined();
    expect(obj.instance.obj["$"]).toEqual("object");
    expect(obj.instance.obj.instance).toBeDefined();
    expect(obj.instance.obj.instance.foo).toEqual("bar");
  });

  it("Works for nested commands", () => {
    const command = new MyMockCommand("a", "b", 1);
    const parent = new MyCommandWithNesting(command);
    const serialiser = new Serialiser({ MyMockCommand, MyCommandWithNesting });
    const jsonString = serialiser.serialise(parent);
    const obj = JSON.parse(jsonString);
    expect(obj.instance).toBeDefined();
    expect(obj.instance.otherCommand).toBeDefined();
    expect(obj.instance.otherCommand.instance).toBeDefined();
    expect(obj.instance.otherCommand["$"]).toEqual("MyMockCommand");
    expect(obj.instance.otherCommand.instance.x).toEqual("a");
    expect(obj["$"]).toEqual("MyCommandWithNesting");
  });

  it("Works for commands containing arrays", () => {
    const parent = new MyMockCommandWithAnArrayOfMockCommands([
      new MyMockCommand("a", "b", 1),
      new MyMockCommand("c", "d", 2)
    ]);

    const serialiser = new Serialiser({
      MyMockCommand,
      MyMockCommandWithAnArrayOfMockCommands
    });

    const jsonString = serialiser.serialise(parent);
    const obj = JSON.parse(jsonString);

    expect(obj.instance).toBeDefined();
    expect(Array.isArray(obj.instance.array)).toBeTruthy();
    expect(obj.instance.array[0].instance).toBeDefined();
    expect(obj.instance.array[0].$).toEqual("MyMockCommand");
    expect(obj.instance.array[0].instance.x).toEqual("a");
    expect(obj.instance.array[1].instance.x).toEqual("c");
  });
});

describe("unserialiseCommand", (): void => {
  it("Creates an instance of a command containing an array property", () => {
    const jsonString = `
      {
        "$": "MyMockCommandWithAnArrayOfMockCommands",
        "instance": {
          "handled": false,
          "array": [
            {
              "$": "MyMockCommand",
              "instance": {
                "handled": false,
                "x":"a",
                "y": "b",
                "z": 1
              }
            }
            ,
            {
              "$": "MyMockCommand",
              "instance": {
                "handled": false,
                "x":"b",
                "y": "c",
                "z": 2
              }
            }
          ]
        }
      }
    `;

    const serialiser = new Serialiser({
      MyMockCommandWithAnArrayOfMockCommands,
      MyMockCommand
    });

    const newInstance = serialiser.unSerialise(jsonString) as any;

    expect(newInstance).toBeInstanceOf(MyMockCommandWithAnArrayOfMockCommands);
    expect(Array.isArray(newInstance.array)).toBeTruthy();
    expect(newInstance.array.length).toEqual(2);
    expect(newInstance.array[0]).toBeDefined();
    expect(newInstance.array[0].x).toEqual("a");
    expect(newInstance.array[0].y).toEqual("b");
    expect(newInstance.array[1].x).toEqual("b");
  });

  it("Creates an instance of a command containing an object property", () => {
    const jsonString = `
    {
      "$": "MyMockCommandWithAnObjectKey",
      "instance": {
        "handled": false,
        "obj": {
          "$": "object",
          "instance": {
            "foo": "baz"
          }
        }
      }
    }
`;
    const serialiser = new Serialiser({
      MyMockCommand,
      MyCommandWithNesting,
      MyMockCommandWithAnObjectKey
    });

    const newInstance = serialiser.unSerialise(jsonString) as any;
    expect(newInstance).toBeInstanceOf(MyMockCommandWithAnObjectKey);
    expect(newInstance.handled).toEqual(false);
    expect(typeof newInstance.obj).toBe("object");
    expect(newInstance.obj.foo).toEqual("baz");
  });

  it("Creates an instance of a nested command with another command nested in it", () => {
    const jsonString = `
    {
      "$": "MyCommandWithNesting",
      "instance": {
        "handled": false,
        "otherCommand": {
          "$": "MyMockCommand",
          "instance": {
            "handled": false,
            "x":"a",
            "y": "b",
            "z": 1
          }
        }
      }
    }
`;
    const serialiser = new Serialiser({ MyMockCommand, MyCommandWithNesting });
    const newInstance = serialiser.unSerialise(jsonString) as any;
    expect(newInstance).toBeInstanceOf(MyCommandWithNesting);
    expect(newInstance.handled).toEqual(false);
    expect(newInstance.otherCommand).toBeInstanceOf(MyMockCommand);
    expect(newInstance.otherCommand.x).toEqual("a");
  });

  it("Works fine when passed an object rather than a string", () => {
    const expectedInstance = new RegisterUserCommand(
      "bar",
      "foo@foo.com",
      "bap"
    );
    const object = {
      $: expectedInstance.constructor.name,
      instance: {
        name: "bar",
        email: "foo@foo.com",
        password: "bap"
      }
    };
    const serialiser = new Serialiser(COMMANDS);
    // @ts-ignore
    const newInstance = serialiser.unSerialise(object);
    expect(newInstance).toBeInstanceOf(RegisterUserCommand);
    expect(newInstance).toEqual(expectedInstance);
  });

  it("Creates an instance of a RegisterUserCommand when passed a json string with the correct type name", (): void => {
    const expectedInstance = new RegisterUserCommand();
    const jsonString = `
      {
        "$" : "${expectedInstance.constructor.name}",
        "instance": {
          "name": "bar",
          "email": "foo@foo.com",
          "password": "bap"
        }
      }`;

    const serialiser = new Serialiser(COMMANDS);
    const newInstance = serialiser.unSerialise(jsonString);
    expect(newInstance).toBeInstanceOf(RegisterUserCommand);
  });

  it("Creates an instance of a RegisterUserCommand with the correct data in it", (): void => {
    const expectedInstance = new RegisterUserCommand(
      "bar",
      "foo@foo.com",
      "bap"
    );
    const jsonString = `
      {
        "$" : "${expectedInstance.constructor.name}",
        "instance": {
          "name": "bar",
          "email": "foo@foo.com",
          "password": "bap"
        }
      }`;

    const serialiser = new Serialiser(COMMANDS);
    const newInstance = serialiser.unSerialise(jsonString);
    expect(newInstance).toEqual(expectedInstance);
  });

  it("Creates an instance of a command with the constructor name set correctlyl", (): void => {
    const expectedInstance = new RegisterUserCommand(
      "bar",
      "foo@foo.com",
      "bap"
    );
    const jsonString = `
      {
        "$" : "${expectedInstance.constructor.name}",
        "instance": {
          "name": "bar",
          "email": "foo@foo.com",
          "password": "bap"
        }
      }`;

    const serialiser = new Serialiser(COMMANDS);
    const newInstance = serialiser.unSerialise(jsonString);
    expect(newInstance.constructor.name).toEqual(
      expectedInstance.constructor.name
    );
  });

  it("works correctly for serializable error objects", () => {
    const error = new DomainError("foo");
    const serialiser = new Serialiser({ DomainError });
    const newInstance = serialiser.unSerialise<DomainError>(
      '{ "$": "DomainError", "instance": { "message": "foo" } }'
    );
    expect(newInstance.constructor.name).toEqual(error.constructor.name);
    expect(newInstance.message).toEqual("foo");
  });
});
