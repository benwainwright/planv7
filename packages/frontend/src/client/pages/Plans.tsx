import React, { ReactNode, useContext, useEffect , useState } from "react";

import "./Plans.css";
import { useDependency } from "../components/utils/InversifyProvider";
import { Redirect } from "../components/utils/Redirect";

import PlanCard from "../components/PlanCard";
import { Plan } from "@planv5/domain/entities";
import { APP_TYPES, EventEmitterWrapper } from "@planv5/application/ports";
import { DOMAIN_TYPES } from "@planv5/domain";
import {
  AddPlanCommand,
  DeletePlanCommand,
  GetMyPlansCommand,
  UpdatePlanCommand
} from "@planv5/domain/commands";
import { CommandBus } from "@planv5/domain/ports";
import { CurrentUserPlansChangedEvent } from "@planv5/domain/events";
import { CurrentUserContext } from "../components/utils/CurrentUserContext";

const Plans: React.FC<{}> = () => {
  const events = useDependency<EventEmitterWrapper>(
    APP_TYPES.EventEmitterWrapper
  );

  const commandBus = useDependency<CommandBus>(DOMAIN_TYPES.CommandBus);
  const currentUser = useContext(CurrentUserContext);

  const [plans, setPlans] = useState<Plan[] | undefined>(undefined);

  const createPlan = () => {
    if (plans && currentUser) {
      const newPlans = [...plans];
      newPlans.push(new Plan(currentUser.getName(), "", "", "", 0));
      setPlans(newPlans);
    }
  };

  const savePlan = async (plan: Plan) => {
    const command = plan.getSlug()
      ? new UpdatePlanCommand(
          plan.getSlug(),
          plan.getTitle(),
          plan.getDescription(),
          plan.getHoursPerWeek(),
          plan.getDeadlines()
        )
      : new AddPlanCommand(
          plan.getTitle(),
          plan.getDescription(),
          plan.getHoursPerWeek()
        );
    await commandBus.execute(command);
  };

  const deletePlan = async (plan: Plan) => {
    if (plan.getSlug()) {
      await commandBus.execute(new DeletePlanCommand(plan.getSlug()));
    } else if (plans) {
        setPlans(plans.filter(item => item !== plan));
      }
  };

  useEffect(() => {
    events.onEvent((event: CurrentUserPlansChangedEvent): void => {
      if (event instanceof CurrentUserPlansChangedEvent) {
        setPlans(event.getPlans());
      }
    });
    (async () => {
      await commandBus.execute(new GetMyPlansCommand());
    })();
  }, []);

  let content;

  if (plans && currentUser) {
    content = plans.map(
      (item: Plan, index: number): ReactNode => 
        <PlanCard
          user={currentUser.getName()}
          key={item.getSlug() || index}
          plan={item}
          onSave={savePlan}
          onDelete={deletePlan}
        />
      
    );
  } else {
    content = null;
  }
  const plansSection = 
    <section>
      <h2>My Plans</h2>
      <section className="plan-list">{content}</section>
      {plans && 
        <button className="create-button" onClick={createPlan}>
          New
        </button>
      }
    </section>
  ;

  return currentUser ? plansSection : <Redirect to="/" />;
};

export default Plans;
