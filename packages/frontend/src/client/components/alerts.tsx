import React, { ReactNode, useEffect, useState } from "react";
import { APP_TYPES, EventEmitterWrapper } from "@planv5/application/ports";
import { useDependency } from "./utils/InversifyProvider";
import { DomainEvent } from "@planv5/domain";
let alerts: ReactNode[] = [];

const ALERT_TIMEOUT = 3000;

const Alerts: React.FC = () => {
  const [displayedAlerts, setDisplayedAlerts] = useState<ReactNode[]>([]);

  const events = useDependency<EventEmitterWrapper>(
    APP_TYPES.EventEmitterWrapper
  );

  useEffect(() => {
    events.onError(error => {
      const newAlert = 
        <section key={encodeURIComponent(error.message)} className="error">
          <header>Error</header>
          <main>{error.message}</main>
        </section>
      ;
      alerts.push(newAlert);
      setTimeout(() => {
        alerts = alerts.filter(item => item !== newAlert);
        setDisplayedAlerts(alerts);
      }, ALERT_TIMEOUT);
      setDisplayedAlerts(alerts);
    });

    events.onEvent((event: DomainEvent) => {
      const message = event.getUserMessage();
      if (message) {
        const newAlert = 
          <section key={encodeURIComponent(message)} className="info">
            <header>Information</header>
            <main>{event.getUserMessage()}</main>
          </section>
        ;
        alerts.push(newAlert);
        setTimeout(() => {
          alerts = alerts.filter(item => item !== newAlert);
          setDisplayedAlerts(alerts);
        }, ALERT_TIMEOUT);
        setDisplayedAlerts(alerts);
      }
    });
  }, []);

  return alerts && <section id="alerts">{displayedAlerts}</section>;
};

export default Alerts;
