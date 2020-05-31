import {
  Command,
  Commands,
  DomainEvent,
  GetAllUsersCommand,
  LoginCommand,
  RegisterUserCommand,
} from "@choirpractise/domain";
import ApplicationError from "./ApplicationError";
import Serialiser from "./Serialiser";

const FAKE_EMAIL = "foo@foo.com";

class MockEvent extends DomainEvent {
  public getUserMessage(): string | undefined {
    return "foo";
  }
  public identifier(): string {
    return "MockEvent";
  }

  public foobar = "";
}

class MyMockCommand extends Command {
  public readonly x: string;
  public readonly y: string;
  public readonly z: number;

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

describe("serialiseCommand", (): void => {

  it("Can pass file objects through the serialiser", () => {

  });

  it("Creates a string which results in an identical command when unserialized", (): void => {
    const inputRegisterUsers = new RegisterUserCommand("foo", "a@.com", "bash");
    const serialiser = new Serialiser(Commands);
    const jsonString = serialiser.serialise(inputRegisterUsers);
    const output = serialiser.unSerialise(jsonString);
    expect(output).toEqual(inputRegisterUsers);

    const inputAllUsers = new GetAllUsersCommand();
    const jsonString2 = serialiser.serialise(inputAllUsers);
    const output2 = serialiser.unSerialise(jsonString2);
    expect(output2).toEqual(inputAllUsers);

    const inputLogin = new LoginCommand("fooo", "bar");

    const jsonString3 = serialiser.serialise(inputLogin);
    const output3 = serialiser.unSerialise(jsonString3);
    expect(output3).toEqual(inputLogin);

    const inputEvent = new MockEvent();
    const serialiser2 = new Serialiser({ MockEvent });
    const jsonString4 = serialiser2.serialise(inputEvent);
    const output4 = serialiser2.unSerialise(jsonString4);
    expect(output4).toEqual(inputEvent);
  });
});

describe("unserialiseCommand", (): void => {
  it("Creates an instance of a nested command with another command nested in it", () => {
    const jsonString = `
    {
      "$": {
        "handled": false,
        "otherCommand": {
          "handled": false,
          "x": "a",
          "y": "b",
          "z": 1
        }
      },
      "$types": {
        "$": {
          "": "MyCommandWithNesting",
          "otherCommand": "MyMockCommand"
        }
      }
    }
    `;

    const serialiser = new Serialiser({ MyMockCommand, MyCommandWithNesting });
    const newInstance = serialiser.unSerialise<MyCommandWithNesting>(
      jsonString
    );
    expect(newInstance).toBeInstanceOf(MyCommandWithNesting);
    expect(newInstance.wasHandled()).toEqual(false);
    expect(newInstance.otherCommand).toBeInstanceOf(MyMockCommand);
    expect(newInstance.otherCommand.x).toEqual("a");
  });

  it("Works fine when passed an object rather than a string", () => {
    const expectedInstance = new RegisterUserCommand("bar", FAKE_EMAIL, "bap");
    const object = {
      $: {
        name: "bar",
        email: FAKE_EMAIL,
        handled: false,
        password: "bap",
      },
      $types: {
        $: { "": expectedInstance.constructor.name },
      },
    };
    const serialiser = new Serialiser(Commands);
    const newInstance = serialiser.unSerialise<RegisterUserCommand>(object);
    expect(newInstance).toBeInstanceOf(RegisterUserCommand);
    expect(newInstance).toEqual(expectedInstance);
  });

  it("Creates an instance of a RegisterUserCommand when passed a json string with the correct type name", (): void => {
    const expectedInstance = new RegisterUserCommand();
    const jsonString = `
      {
        "$": {
          "name": "bar",
          "email": "${FAKE_EMAIL}",
          "password": "bap"
        },
        "$types" : { "$": { "": "${expectedInstance.constructor.name}" } }
      }`;

    const serialiser = new Serialiser(Commands);
    const newInstance = serialiser.unSerialise(jsonString);
    expect(newInstance).toBeInstanceOf(RegisterUserCommand);
  });

  it("Creates an instance of a RegisterUserCommand with the correct data in it", (): void => {
    const expectedInstance = new RegisterUserCommand("bar", FAKE_EMAIL, "bap");
    const jsonString = `
      {
        "$": {
          "name": "bar",
          "email": "${FAKE_EMAIL}",
          "handled": false,
          "password": "bap"
        },
        "$types": { "$": { "": "${expectedInstance.constructor.name}" } }
      }`;

    const serialiser = new Serialiser(Commands);
    const newInstance = serialiser.unSerialise(jsonString);
    expect(newInstance).toEqual(expectedInstance);
  });

  it("Creates an instance of a command with the constructor name set correctly", (): void => {
    const expectedInstance = new RegisterUserCommand("bar", FAKE_EMAIL, "bap");
    const jsonString = `
      {
        "$": {
          "name": "bar",
          "email": "${FAKE_EMAIL}",
          "password": "bap"
        },
        "$types": { "$": { "": "${expectedInstance.constructor.name}" } }
      }`;

    const serialiser = new Serialiser(Commands);
    const newInstance = serialiser.unSerialise(jsonString);
    expect(newInstance.constructor.name).toEqual(
      expectedInstance.constructor.name
    );
  });

  it("works correctly for serializable error objects", () => {
    const error = new ApplicationError("foo");
    const serialiser = new Serialiser({ ApplicationError });
    const newInstance = serialiser.unSerialise<ApplicationError>(
      '{ "$": {"message": "foo" }, "$types": {"$": {"": "ApplicationError" } } }'
    );
    expect(newInstance.constructor.name).toEqual(error.constructor.name);
    expect(newInstance.message).toEqual("foo");
  });
});
