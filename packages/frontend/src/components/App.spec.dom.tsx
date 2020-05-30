/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import {
  TYPES as APP,
  CommandOutcome,
  DomainEvent,
  Serialisable,
} from "@planv7/domain";
import {
  render,
  screen
} from "@testing-library/react";

import App from "./App";
import { EventEmitterWrapper } from "@planv7/application";
import { act } from "react-dom/test-utils";
import { useDependency } from "../utils/inversify-provider";
import { when } from "jest-when";

jest.useFakeTimers();
jest.mock("../utils/inversify-provider");

const mock = <T extends unknown>(): jest.Mocked<T> => {
  return (jest.fn() as unknown) as jest.Mocked<T>;
};

describe("The app", () => {
  describe("alert", () => {
    it("Isn't shown before any event is received", () => {
      const emitter = mock<EventEmitterWrapper>();
      const event = mock<DomainEvent>();
      emitter.onEvent = jest.fn();
      emitter.onError = jest.fn();
      event.getOutcome = jest.fn();
      event.getUserMessage = jest.fn();

      when(useDependency as any)
        .calledWith(APP.commandBus)
        .mockReturnValue(jest.fn());

      when(useDependency as any)
        .calledWith(EventEmitterWrapper)
        .mockReturnValue(emitter);

      when(useDependency as any)
        .calledWith(APP.commandBus)
        .mockReturnValue(jest.fn());

      act(() => {
        render(<App />);
        expect(screen.queryByRole("alert")).toBeNull();
      });
    });

    // It("Dissappears after a short period", async () => {
    //   const emitter = mock<EventEmitterWrapper>();
    //   const event = mock<DomainEvent>();
    //   emitter.onEvent = jest.fn();
    //   emitter.onError = jest.fn();
    //   event.getOutcome = jest.fn();
    //   event.getUserMessage = jest.fn();

    //   when(useDependency as any)
    //     .calledWith(APP.commandBus)
    //     .mockReturnValue(jest.fn());

    //   when(useDependency as any)
    //     .calledWith(EventEmitterWrapper)
    //     .mockReturnValue(emitter);

    //   event.getOutcome.mockReturnValue(CommandOutcome.SUCCESS);
    //   event.getUserMessage.mockReturnValue("Foo!");

    //   emitter.onEvent.mockImplementation(
    //     (callback: (event: Serialisable) => void) => {
    //       callback(event);
    //     }
    //   );

    //   await act(async () => {
    //     render(<App />);
    //     jest.advanceTimersByTime(50000);
    //   });
    //   expect(screen.queryByRole("alert")).toBeNull();
    // });

    it("Displays the error text when an error is emitted", () => {
      const emitter = mock<EventEmitterWrapper>();
      const error = mock<Error>();
      emitter.onError = jest.fn();
      emitter.onEvent = jest.fn();

      when(useDependency as any)
        .calledWith(APP.commandBus)
        .mockReturnValue(jest.fn());

      when(useDependency as any)
        .calledWith(EventEmitterWrapper)
        .mockReturnValue(emitter);

      error.message = "foo";


      emitter.onError.mockImplementation(
        (callback: (error: Error) => void) => {
          callback(error);
        }
      );

      act(() => {
        render(<App />);
      });

      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("foo");
    });

    it("Is 'error' severity for errors", () => {
      const emitter = mock<EventEmitterWrapper>();
      const error = mock<Error>();
      emitter.onError = jest.fn();
      emitter.onEvent = jest.fn();

      when(useDependency as any)
        .calledWith(APP.commandBus)
        .mockReturnValue(jest.fn());

      when(useDependency as any)
        .calledWith(EventEmitterWrapper)
        .mockReturnValue(emitter);

      error.message = "foo";

      emitter.onError.mockImplementation(
        (callback: (error: Error) => void) => {
          callback(error);
        }
      );

      act(() => {
        render(<App />);
      });

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("MuiAlert-filledError")
    });

    it("Is 'success' severity for events", () => {
      const emitter = mock<EventEmitterWrapper>();
      const event = mock<DomainEvent>();
      emitter.onEvent = jest.fn();
      emitter.onError = jest.fn();
      event.getOutcome = jest.fn();
      event.getUserMessage = jest.fn();

      when(useDependency as any)
        .calledWith(APP.commandBus)
        .mockReturnValue(jest.fn());

      when(useDependency as any)
        .calledWith(EventEmitterWrapper)
        .mockReturnValue(emitter);

      event.getOutcome.mockReturnValue(CommandOutcome.SUCCESS);
      event.getUserMessage.mockReturnValue("Foo!");

      emitter.onEvent.mockImplementation(
        (callback: (event: Serialisable) => void) => {
          callback(event);
        }
      );

      act(() => {
        render(<App />);
      });

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("MuiAlert-filledSuccess")
    });

    it("Is not shown if the event has no text", () => {
      const emitter = mock<EventEmitterWrapper>();
      const event = mock<DomainEvent>();
      emitter.onEvent = jest.fn();
      emitter.onError = jest.fn();
      event.getOutcome = jest.fn();
      event.getUserMessage = jest.fn();

      when(useDependency as any)
        .calledWith(APP.commandBus)
        .mockReturnValue(jest.fn());

      when(useDependency as any)
        .calledWith(EventEmitterWrapper)
        .mockReturnValue(emitter);

      event.getOutcome.mockReturnValue(CommandOutcome.SUCCESS);
      event.getUserMessage.mockReturnValue(undefined);

      emitter.onEvent.mockImplementation(
        (callback: (event: Serialisable) => void) => {
          callback(event);
        }
      );

      act(() => {
        render(<App />);
      });

      expect(screen.queryByRole("alert")).toBeNull();
    });
  });
});
