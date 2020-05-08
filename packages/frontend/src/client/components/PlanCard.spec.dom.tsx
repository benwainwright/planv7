import React from "react";
import Adapter from "enzyme-adapter-react-16";
import PlanCard from "./PlanCard";
import { act } from "react-dom/test-utils";
import { configure, shallow } from "enzyme";
import { Plan } from "@planv5/domain/entities";
import DeadlineRow from "./DeadlineRow";

configure({ adapter: new Adapter() });

describe("The plancard", () => {
  describe("The save and cancel buttons", () => {
    it("are not shown when clean", () => {
      const change = jest.fn();
      const remove = jest.fn();

      const plan = new Plan("foo", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      expect(card.find("button.save").exists()).toBeFalsy();
      expect(card.find("button.cancel").exists()).toBeFalsy();
    });

    it("are shown when the title is changed", () => {
      const change = jest.fn();
      const remove = jest.fn();

      const plan = new Plan("foo", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card.find(".title").simulate("change", { target: { value: "foo" } });
      });

      card.update();

      expect(card.find("button.save").exists()).toBeTruthy();
      expect(card.find("button.cancel").exists()).toBeTruthy();
    });

    it("are hidden when you press save", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const plan = new Plan("foo", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card.find(".title").simulate("change", { target: { value: "foo" } });
      });

      card.update();

      act(() => {
        card.find("button.save").simulate("click");
      });

      card.update();
      expect(card.find("button.save").exists()).toBeFalsy();
      expect(card.find("button.cancel").exists()).toBeFalsy();
    });
  });

  describe("The cancel button", () => {
    it("clears window.onbeforeonload when clicked", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const plan = new Plan("foo", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card.find(".title").simulate("change", { target: { value: "foo" } });
      });

      card.update();

      act(() => {
        card.find("button.cancel").simulate("click");
      });

      card.update();
      expect(window.onbeforeunload).toEqual(null);
    });

    it("resets the card to its original state", () => {
      const plan = new Plan(
        "foo",
        "",
        "footitle",
        "foodescription",
        0,
        undefined
      );

      const remove = jest.fn();
      const change = jest.fn();
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card
          .find(".title")
          .simulate("change", { target: { value: "newtitle" } });
      });

      card.update();

      act(() => {
        card.find("button.cancel").simulate("click");
      });

      card.update();
      expect(card.find("button.save").exists()).toBeFalsy();
      expect(card.find("button.cancel").exists()).toBeFalsy();
      expect(card.find(".title").props().value).toEqual("footitle");
    });
  });

  describe("The save button", () => {
    it("clears window.onbeforeonload when clicked", () => {
      const remove = jest.fn();
      const change = jest.fn();
      const plan = new Plan("foo", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card.find(".title").simulate("change", { target: { value: "foo" } });
      });

      card.update();

      act(() => {
        card.find("button.save").simulate("click");
      });

      card.update();
      expect(window.onbeforeunload).toEqual(null);
    });

    it("calls the onSave callback with a new plan when clicked", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const plan = new Plan("foo", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card
          .find(".title")
          .simulate("change", { target: { value: "footitle" } });
      });

      card.update();

      act(() => {
        card.find("button.save").simulate("click");
      });

      card.update();

      const plan2 = new Plan("foo", "", "footitle", "", 0, undefined);

      expect(change).toHaveBeenCalledWith(plan2);
    });
  });
  it("sets window.onbeforeunload when the card is edited", () => {
    const remove = jest.fn();
    const change = jest.fn();
    const plan = new Plan(
      "foo",
      "",
      "footitle",
      "foodescription",
      0,
      undefined
    );

    const card = shallow(
      <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
    );

    act(() => {
      card.find(".title").simulate("change", { target: { value: "foo" } });
    });

    card.update();

    expect(window.onbeforeunload).toBeInstanceOf(Function);
  });

  describe("the delete button", () => {
    it("calls the onDelete handler without confirmation if plan has no slug and no changes have been made", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const oldConfirm = window.confirm;
      window.confirm = jest.fn(() => false);
      const plan = new Plan("", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card.find("button.delete").simulate("click");
      });

      card.update();

      expect(remove).toHaveBeenCalled();
      expect(window.confirm).not.toHaveBeenCalled();
      window.confirm = oldConfirm;
    });

    it("calls browser confirm if plan has no slug but changes have been made", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const oldConfirm = window.confirm;
      window.confirm = jest.fn(() => false);
      const plan = new Plan("", "", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card
          .find(".title")
          .simulate("change", { target: { value: "footitle" } });
        card.find("button.delete").simulate("click");
      });

      card.update();

      expect(window.confirm).toHaveBeenCalled();
      window.confirm = oldConfirm;
    });

    it("calls browser confirm if plan has slug even if changes have been made", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const oldConfirm = window.confirm;
      window.confirm = jest.fn(() => false);
      const plan = new Plan("", "slug", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card
          .find(".title")
          .simulate("change", { target: { value: "footitle" } });
        card.find("button.delete").simulate("click");
      });

      card.update();

      expect(window.confirm).toHaveBeenCalled();
      window.confirm = oldConfirm;
    });

    it("calls browser confirm if plan has slug even if changes have not been made", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const oldConfirm = window.confirm;
      window.confirm = jest.fn(() => false);
      const plan = new Plan("", "slug", "", "", 0, undefined);
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card.find("button.delete").simulate("click");
      });

      card.update();

      expect(window.confirm).toHaveBeenCalled();
      window.confirm = oldConfirm;
    });

    it("coes nothing if you press cancel when the confirm dialog appears", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const oldConfirm = window.confirm;
      window.confirm = jest.fn(() => false);
      const plan = new Plan(
        "foo",
        "blah",
        "footitle",
        "foodescription",
        0,
        undefined
      );
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card
          .find(".title")
          .simulate("change", { target: { value: "footitle" } });
      });

      card.update();

      act(() => {
        card.find("button.delete").simulate("click");
      });

      card.update();

      expect(remove).not.toHaveBeenCalled();
      window.confirm = oldConfirm;
    });

    it("calls the onDelete handler with the original plan after you click confirm", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const oldConfirm = window.confirm;
      window.confirm = jest.fn(() => true);
      const plan = new Plan(
        "foo",
        "blah",
        "footitle",
        "foodescription",
        0,
        undefined
      );
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card
          .find(".title")
          .simulate("change", { target: { value: "footitle" } });
      });

      card.update();

      act(() => {
        card.find("button.delete").simulate("click");
      });

      card.update();

      expect(remove).toHaveBeenCalledWith(plan);
      window.confirm = oldConfirm;
    });
  });

  describe("The add deadline button", () => {
    it("Adds a rendered DeadLine component to the card", () => {
      const change = jest.fn();
      const remove = jest.fn();
      const plan = new Plan(
        "foo",
        "blah",
        "footitle",
        "foodescription",
        0,
        undefined
      );
      const card = shallow(
        <PlanCard user="foo" plan={plan} onSave={change} onDelete={remove} />
      );

      act(() => {
        card.find("button.add-deadline").simulate("click");
      });

      card.update();

      expect(card.find(DeadlineRow).exists()).toBeTruthy();
    });
  });
});
