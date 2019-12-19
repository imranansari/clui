import * as React from "react";
import { mount } from "enzyme";
import Session, { ISessionItem } from "../Session";
import { act } from "react-dom/test-utils";

describe.skip("item.next()", () => {
  it("shows next element", () => {
    const wrapper = mount(
      <Session>
        <i className="a" />
        <i className="b" />
        <i className="c" />
      </Session>
    );

    let currentStep = wrapper.find(".a");
    expect(currentStep.length).toEqual(1);
    expect(wrapper.find(".b").length).toEqual(0);
    expect(wrapper.find(".c").length).toEqual(0);

    act(() => {
      (currentStep.prop("item") as ISessionItem).next();
    });
    wrapper.update();
    currentStep = wrapper.find(".b");

    expect(wrapper.find(".a").length).toEqual(1);
    expect(currentStep.length).toEqual(1);
    expect(wrapper.find(".c").length).toEqual(0);

    act(() => {
      (currentStep.prop("item") as ISessionItem).next();
    });
    wrapper.update();

    expect(wrapper.find(".c").length).toEqual(1);
  });

  it("keeps index less than or equal to total length", () => {
    const wrapper = mount(
      <Session>
        <i className="a" />
        <i className="b" />
      </Session>
    );

    expect(
      (wrapper.find(".a").prop("item") as ISessionItem).session.currentIndex
    ).toEqual(0);

    act(() => {
      (wrapper.find(".a").prop("item") as ISessionItem).next();
    });
    wrapper.update();

    expect(
      (wrapper.find(".b").prop("item") as ISessionItem).session.currentIndex
    ).toEqual(1);

    act(() => {
      (wrapper.find(".b").prop("item") as ISessionItem).next();
    });
    wrapper.update();

    expect(
      (wrapper.find(".b").prop("item") as ISessionItem).session.currentIndex
    ).toEqual(1);
  });

  it("calls onDone when at last child", () => {
    const onDone = jest.fn();
    mount(
      <Session onDone={onDone}>
        <i className="a" />
      </Session>
    );

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("calls next if nested within another <Session>", () => {
    const wrapper = mount(
      <Session>
        <i className="a" />
        <Session>
          <i className="b" />
        </Session>
      </Session>
    );

    expect(wrapper.find(".a").length).toEqual(1);
    expect(wrapper.find(".b").length).toEqual(0);

    act(() => {
      (wrapper.find(".a").prop("item") as ISessionItem).next();
    });
    wrapper.update();

    expect(wrapper.find(".a").length).toEqual(1);
    expect(wrapper.find(".b").length).toEqual(1);
  });

  it("does not advance when called next multiple times from same element", () => {
    const wrapper = mount(
      <Session>
        <i className="a" />
        <i className="b" />
        <i className="c" />
      </Session>
    );

    expect(wrapper.find(".a").length).toEqual(1);
    expect(
      (wrapper.find(".a").prop("item") as ISessionItem).session.currentIndex
    ).toEqual(0);
    expect(wrapper.find(".b").length).toEqual(0);

    act(() => {
      (wrapper.find(".a").prop("item") as ISessionItem).next();
    });
    wrapper.update();
    expect(
      (wrapper.find(".a").prop("item") as ISessionItem).session.currentIndex
    ).toEqual(1);

    act(() => {
      (wrapper.find(".a").prop("item") as ISessionItem).next();
    });
    wrapper.update();
    expect(
      (wrapper.find(".a").prop("item") as ISessionItem).session.currentIndex
    ).toEqual(1);
  });
});
