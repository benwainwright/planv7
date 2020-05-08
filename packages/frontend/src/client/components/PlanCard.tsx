import React, { ReactNode, useState } from "react";
import "./PlanCard.css";
import { Deadline, Plan } from "@planv5/domain/entities";
import DeadlineRow from "./DeadlineRow";

interface PlanProps {
  plan: Plan;
  user: string;
  onSave: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanProps> = ({ plan, onSave, user, onDelete }) => {
  const [currentPlan, setCurrentPlan] = useState<Plan>(plan);
  const [dirty, setDirty] = useState<boolean>(false);

  if (dirty) {
    window.onbeforeunload = () => "";
  } else {
    window.onbeforeunload = null;
  }

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setCurrentPlan(
        new Plan(
          user,
          currentPlan ? currentPlan.getSlug() : "",
          event.target.value,
          currentPlan ? currentPlan.getDescription() : "",
          currentPlan ? currentPlan.getHoursPerWeek() : 0,
          currentPlan ? currentPlan.getDeadlines() : []
        )
      );
      setDirty(true);
    }
  };

  const onSaveClick = () => {
    setDirty(false);
    if (currentPlan) {
      onSave(currentPlan);
    }
  };

  const onAddDeadline = () => {
    setDirty(true);
    const deadline = new Deadline("", 1, new Date());
    setCurrentPlan(
      new Plan(
        user,
        currentPlan ? currentPlan.getSlug() : "",
        currentPlan ? currentPlan.getTitle() : "",
        currentPlan ? currentPlan.getDescription() : "",
        currentPlan ? currentPlan.getHoursPerWeek() : 0,
        currentPlan ? [...currentPlan.getDeadlines(), deadline] : [deadline]
      )
    );
    setDirty(true);
  };

  const deadlines = currentPlan ? currentPlan.getDeadlines() : [];

  const onDeadlineChange = (old: Deadline, newDeadline: Deadline) => {
    setDirty(true);
    console.log(old);
    console.log(newDeadline);
    const oldIndex = deadlines.indexOf(old);
    const changeDeadlines = [...deadlines];
    changeDeadlines.splice(oldIndex, 1, newDeadline);
    setCurrentPlan(
      new Plan(
        user,
        currentPlan.getSlug(),
        currentPlan.getTitle(),
        currentPlan.getDescription(),
        currentPlan.getHoursPerWeek(),
        changeDeadlines
      )
    );
  };

  const onCancelClick = () => {
    setDirty(false);
    setCurrentPlan(plan);
  };

  const onDeleteClick = () => {
    if (
      !currentPlan.getSlug() && !dirty ||
      confirm("Are you sure you want to delete this plan?")
    ) {
      onDelete(plan);
    }
  };

  const buttons: ReactNode[] = dirty
    ? [
        <button className="save" key="save-button" onClick={onSaveClick}>
          Save
        </button>,
        <button className="cancel" key="cancel-button" onClick={onCancelClick}>
          Cancel
        </button>
      ]
    : [];

  const deadlineNodes = deadlines.map(item => 
    <DeadlineRow deadline={item} onChange={onDeadlineChange} />
  );

  return (
    <section className="plan-card">
      <input
        className="title"
        placeholder="Enter title"
        value={currentPlan ? currentPlan.getTitle() : ""}
        onChange={onChangeTitle}
      />
      {deadlineNodes && 
        <section className="deadlines">{deadlineNodes}</section>
      }
      <footer>
        <button
          className="add-deadline"
          key="add-deadline-button"
          onClick={onAddDeadline}
        >
          Add Deadline
        </button>
        <button className="delete" key="delete-button" onClick={onDeleteClick}>
          Delete
        </button>
        {buttons}
      </footer>
    </section>
  );
};

export default PlanCard;
