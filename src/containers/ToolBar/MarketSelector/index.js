import classnames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { selectCurrentMarket } from "../../../modules";
import { ArrowIcon } from "../icons/ArrowIcon";
import { MarketsList } from "./MarketsList";
import { MarketsTabs } from "./MarketsTabs";
import { selectCurrentTheme } from "../../../modules/public/generic";

class MarketSelectorComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
            searchFieldValue: "",
            marketsTabsSelectedValue: "",
        };

        this.handleOpenSelector = () => {
            this.setState({
                isOpen: !this.state.isOpen,
            });
        };

        this.searchFieldChangeHandler = (e) => {
            this.setState({
                searchFieldValue: e.target.value,
            });
        };

        this.marketsTabsSelectHandler = (value) => {
            this.setState({
                marketsTabsSelectedValue: value,
            });
        };

        this.handleCloseSelector = () => {
            this.setState({
                isOpen: false,
            });
        };
    }

    render() {
        const { currentMarket, colorTheme } = this.props;
        const { isOpen, searchFieldValue, marketsTabsSelectedValue } =
            this.state;
        const iconClassName = classnames({
            "parent-trading-header-selector-icon-open-mobile": isOpen,
            "parent-trading-header-selector-icon-close": !isOpen,
        });
        const iconImgClassName = classnames({
            "parent-trading-header-selector-icon-img-open-mobile": isOpen,
            "parent-trading-header-selector-icon-img-close": !isOpen,
        });
        const listClassName = classnames({
            "parent-trading-header-selector-list-container-open": isOpen,
            "parent-trading-header-selector-list-container-close": !isOpen,
        });
        const searchSelectorClassName = classnames({
            "parent-trading-header-selector-search": isOpen,
            "parent-trading-header-selector-search-closed": !isOpen,
        });
        return (
            <div className="parent-trading-header-selector-container">
                <div
                    className="parent-trading-header-selector"
                    onClick={this.handleOpenSelector}
                >
                    <div className="parent-trading-header-selector-market">
                        {currentMarket && currentMarket.name}
                    </div>
                    <div
                        className={
                            "pl-0 " +
                            `${
                                window.innerWidth < 768
                                    ? iconClassName
                                    : "parent-trading-header-selector-icon-open"
                            }`
                        }
                    >
                        <div
                            className={`${
                                window.innerWidth < 768
                                    ? iconImgClassName
                                    : "parent-trading-header-selector-icon-img-open"
                            }`}
                        >
                            <ArrowIcon
                                color={
                                    isOpen
                                        ? colorTheme && colorTheme === "light"
                                            ? "#737F92"
                                            : "#FFFFFF"
                                        : "#737F92"
                                }
                            />
                        </div>
                    </div>
                </div>
                <div
                    className="parent-trading-header-selector-list-container-open"
                    style={{
                        display: isOpen ? "block" : "none",
                    }}
                >
                    <MarketsTabs onSelect={this.marketsTabsSelectHandler} />
                    <MarketsList
                        search={searchFieldValue}
                        currencyQuote={marketsTabsSelectedValue}
                        closeSelector={this.handleCloseSelector}
                    />
                    <div className="parent-trading-header-selector-search-wrapper">
                        <div className="parent-trading-header-selector-search">
                            <div className="parent-trading-header-selector-search-icon">
                                <img src={require("../icons/search.svg")} />
                            </div>
                            <input
                                className="parent-trading-header-selector-search-field"
                                onChange={this.searchFieldChangeHandler}
                                value={searchFieldValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const reduxProps = (state) => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentTheme(state),
});

export const MarketSelector = connect(reduxProps)(MarketSelectorComponent);
