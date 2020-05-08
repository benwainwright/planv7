import React, { useEffect, useState } from "react";
import { APP_TYPES, EventEmitterWrapper } from "@planv5/application/ports";
import { useDependency } from "./utils/InversifyProvider";
import { DomainEvent } from "@planv5/domain";

const MESSAGE_TIMEOUT = 5000;

const Footer: React.FC = () => {
  const [message, setMessage] = useState<string | undefined>(undefined);

  const events = useDependency<EventEmitterWrapper>(
    APP_TYPES.EventEmitterWrapper
  );

  useEffect(() => {
    events.onError(error => {
      setMessage(error.message);
      setTimeout(() => {
        setMessage(undefined);
      }, MESSAGE_TIMEOUT);
    });

    events.onEvent((event: DomainEvent) => {
      setMessage(event.getUserMessage());
      setTimeout(() => {
        setMessage(undefined);
      }, MESSAGE_TIMEOUT);
    });
  }, []);

  return <footer>{message}</footer>;
};

export default Footer;
