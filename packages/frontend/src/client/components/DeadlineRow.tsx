import React, { useState } from "react";
import { Deadline } from "@planv5/domain/entities";
import DatePicker from "react-datepicker";

interface DeadlineRowProps {
  deadline: Deadline;
  onChange: (oldDeadline: Deadline, newDeadline: Deadline) => void;
}

const DeadlineRow: React.FC<DeadlineRowProps> = ({ deadline, onChange }) => {
  const [date, setDate] = useState<Date>(new Date());

  const onDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* SetDate(date); */
    /* onChange( */
    /*   deadline, */
    /*   new Deadline( */
    /*     deadline.getName(), */
    /*     deadline.getRatio(), */
    /*     date, */
    /*     deadline.getLink() */
    /*   ) */
    /* ); */
  };
  const onChangeRatio = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      onChange(
        deadline,
        new Deadline(
          deadline.getName(),
          Number.parseInt(event.target.value, 10),
          deadline.getDue(),
          deadline.getLink()
        )
      );
    }
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      onChange(
        deadline,
        new Deadline(
          event.target.value,
          deadline.getRatio(),
          deadline.getDue(),
          deadline.getLink()
        )
      );
    }
  };

  const onChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      onChange(
        deadline,
        new Deadline(
          deadline.getName(),
          deadline.getRatio(),
          deadline.getDue(),
          new URL(event.target.value)
        )
      );
    }
  };

  return (
    <section>
      <input
        className="title"
        type="text"
        placeholder="Deadline name"
        onChange={onChangeName}
      />
      <input type="date" placeholder="Enter date" onChange={onDateTimeChange} />
      <input type="number" placeholder="ratio" onChange={onChangeRatio} />
      <input type="url" placeholder="url" onChange={onChangeUrl} />
    </section>
  );
};

export default DeadlineRow;
