import * as React from "react";
import {
  TYPES as APP,
  CurrentLoginSession,
  EventEmitterWrapper,
} from "@planv7/application";
import { User, UserLoginStateChangeEvent } from "@planv7/domain";

import App from "../components/App";
import CurrentUserContext from "../utils/CurrentUserContext";
import { setConfig } from "react-hot-loader";
import { useDependency } from "../utils/inversify-provider";

setConfig({ logLevel: "debug" });

const ClientRootComponent: React.FC = () => {
  const session = useDependency<CurrentLoginSession>(APP.currentLoginSession);
  const events = useDependency<EventEmitterWrapper>(EventEmitterWrapper);
  const [user, setUser] = React.useState<User | undefined>(
    session.getCurrentUser()
  );

  React.useEffect(() => {
    events.onEvent((event) => {
      if (event instanceof UserLoginStateChangeEvent) {
        setUser(event.getUser());
      }
    });
  });

  return (
    <CurrentUserContext.Provider value={user}>
      <App />
    </CurrentUserContext.Provider>
  );
};

export default ClientRootComponent;
