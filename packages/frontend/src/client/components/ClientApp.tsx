import React, { useEffect, useState } from "react";

import { BrowserRouter } from "react-router-dom";

import { DomainEvent, User } from "@planv5/domain";
import {
  APP_TYPES,
  CurrentLoginSession,
  EventEmitterWrapper,
  Logger
} from "@planv5/application/ports";
import { UserLoginStateChangeEvent } from "@planv5/domain/events";

import { useDependency } from "./utils/InversifyProvider";

import App from "./App";
import { CurrentUserContext } from "./utils/CurrentUserContext";

export const ClientApp: React.FC<{}> = () => {
  const userSession = useDependency<CurrentLoginSession>(
    APP_TYPES.CurrentLoginSession
  );

  const [currentUser, setCurrentUser] = useState<User | undefined>(
    userSession.getCurrentUser()
  );

  const events = useDependency<EventEmitterWrapper>(
    APP_TYPES.EventEmitterWrapper
  );

  const logger = useDependency<Logger>(APP_TYPES.Logger);

  useEffect(() => {
    events.onEvent((event: DomainEvent) => {
      if (event instanceof UserLoginStateChangeEvent) {
        const user = event.getUser();
        logger.info(`Login state changed. Setting user to ${user}`);
        setCurrentUser(user);
      }
    });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <BrowserRouter basename="/app">
        <App />
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
};
