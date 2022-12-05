import { shallow } from "enzyme";
import * as React from "react";
import { History } from "./History";

const data = [
    ["10:40", "Market", "BTC/USDT", "Buy", "9.400,0", "0, 4005", "3.459"],
    ["10:40", "Market", "BTC/USDT", "Buy", "9.400,0", "0, 4005", "3.459"],
    ["10:40", "Market", "BTC/USDT", "Buy", "9.400,0", "0, 4005", "3.459"],
];
const defaultProps = {
    data,
};

const setup = (props = {}) =>
    shallow(
        <History
            {...Object.assign(
                {},
                {
                    ...defaultProps,
                    ...props,
                }
            )}
        />
    );

describe("History", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });
    it("should render", () => {
        expect(wrapper).toMatchSnapshot();
    });
    it("should render custom action cell", () => {
        const renderedBuyAction = (
            <span className="base-history-action base-history-action--buy">
                bid
            </span>
        );
        const renderedSellAction = (
            <span className="base-history-action base-history-action--sell">
                ask
            </span>
        );
        const instance = wrapper.instance();
        expect(instance.renderAction("bid")).toEqual(renderedBuyAction);
        expect(instance.renderAction("ask")).toEqual(renderedSellAction);
    });
});
