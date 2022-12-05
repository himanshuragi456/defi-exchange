import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";
import { TabPanel } from "./TabPanel";

const defaultProps = {
    panels: [
        {
            content: (
                <div>
                    <h4>Deposit</h4>
                    <p>Some deposit tab content</p>
                </div>
            ),
            label: "Deposit",
        },
        {
            content: (
                <div>
                    <h4>Withdraw</h4>
                    <p>Some withdraw tab content</p>
                </div>
            ),
            label: "Withdraw",
        },
        {
            content: (
                <div>
                    <h4>Disabled</h4>
                    <p>Disabled lorem ipsum dolor sit amet.</p>
                </div>
            ),
            label: "Disabled",
            disabled: true,
        },
    ],
};

const setup = (props = {}) =>
    shallow(
        <TabPanel
            {...Object.assign(
                {},
                {
                    ...defaultProps,
                    ...props,
                }
            )}
        />
    );

describe("TabPanel", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    it("should render", () => {
        expect(wrapper).toMatchSnapshot();
    });
    it("should have correct className", () => {
        expect(wrapper.hasClass("base-tab-panel")).toBeTruthy();
    });
    it("should have correct fixed className", () => {
        wrapper = setup({
            fixed: true,
        });
        expect(wrapper.hasClass("base-tab-panel__fixed")).toBeTruthy();
    });
    it("should render tabs", () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.find(".base-tab")).toHaveLength(3);
    });
    it("should mount all passed content when hideMode is `hide`", () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.find(".base-tab-content")).toHaveLength(3);
    });
    it("should mount only active content when hideMode is `unmount`", () => {
        wrapper = setup({
            hideMode: "unmount",
        });
        expect(wrapper.find(".base-tab-content")).toHaveLength(1);
    });
    it("should render correct class for active tab", () => {
        wrapper.setState({
            currentTabIndex: 1,
        });
        const activeTab = wrapper.find(".base-tab").at(1);
        expect(activeTab.hasClass("base-tab__active")).toBeTruthy();
    });
    it("should render disabled tab", () => {
        wrapper = setup({
            panels: [
                {
                    content: <p>Deposit</p>,
                    disabled: true,
                    label: "Deposit",
                },
            ],
        });
        const disabledTab = wrapper.find(".base-tab").at(0);
        expect(disabledTab.hasClass("base-tab__disabled")).toBeTruthy();
    });
    it("should render hidden tab", () => {
        wrapper = setup({
            panels: [
                {
                    content: <p>Deposit</p>,
                    hidden: true,
                    label: "Deposit",
                },
            ],
        });
        const hiddenTab = wrapper.find(".base-tab").at(0);
        expect(hiddenTab.hasClass("base-tab__hidden")).toBeTruthy();
    });
    it("should handle onTabChange callback when a tab is pressed", () => {
        const onTabChange = spy();
        wrapper = setup({
            onTabChange,
        });
        const tab = wrapper.find(".base-tab").at(1);
        tab.simulate("click");
        expect(onTabChange.calledOnceWith(1, "Withdraw")).toBeTruthy();
    });
    it("should handle onTabChange callback when a disable tab is pressed", () => {
        wrapper = setup();
        const secondTab = wrapper.find(".base-tab").at(1);
        const disabledTab = wrapper.find(".base-tab").last();
        disabledTab.simulate("click");
        expect(wrapper.state()).toEqual({
            currentTabIndex: 0,
        });
        secondTab.simulate("click");
        expect(wrapper.state()).toEqual({
            currentTabIndex: 1,
        });
    });
});
