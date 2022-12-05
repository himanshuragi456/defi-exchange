import * as React from "react";
import { WalletItem } from "../WalletItem";
import { estimateWalletValue } from "../../helpers/estimateValueBase";
import { primaryCurrency } from "../../api";

export class Wallets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wallets: [],
            search: "",
        };

        this.itemState = (i) => {
            return this.props.activeIndex === i;
        };

        this.makeWalletItem = (props, i) => {
            const { wallets } = this.state;
            const { marketTickers, markets, currencies } = this.props;
            const estimatedValue = props?.currency
                ? estimateWalletValue(
                      primaryCurrency(),
                      currencies,
                      props,
                      markets,
                      marketTickers
                  )
                : "0.0";
            return (
                <li
                    key={i}
                    style={{
                        listStyleType: "none",
                        padding: "calc(var(--gap) * 0.5) calc(var(--gap))",
                    }}
                    onClick={this.handleClick.bind(this, i, props)}
                >
                    <WalletItem
                        {...Object.assign(
                            {
                                key: i,
                            },
                            {
                                ...props,
                                estimatedValue: estimatedValue,
                                active: this.itemState(i),
                                currency: props?.currency.replace("-alt", ""),
                            }
                        )}
                    />
                </li>
            );
        };

        this.handleClick = (i, props) => {
            if (this.props.onWalletSelectionChange) {
                this.props.onWalletSelectionChange(props);
            }

            if (this.props.onActiveIndexChange) {
                this.props.onActiveIndexChange(i);
            }
        };

        this.handleSearch = (e) => {
            let text = e.target.value;

            if (text.length !== 0) {
                let result = this.props.walletItems.filter((element) => {
                    return (
                        element.currency
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) >= 0 ||
                        element.name
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) >= 0
                    );
                });

                if (result) {
                    this.setState({
                        wallets: result,
                        search: text,
                    });
                }
            } else {
                this.setState({
                    wallets: this.props.walletItems,
                    search: "",
                });
            }
        };

        this.toggleHideEmptyWallets = () => {
            this.props.toggleEmptyWallets();
        };
    }

    componentDidMount() {
        const { headers = this.defaultHeaders, walletItems = [] } = this.props;
        this.setState({
            wallets: walletItems,
        });
        document
            .getElementsByClassName("parent-layout")[0]
            .classList.add("parent-wallet__mount-wrapper");
    }

    componentWillUnmount() {
        document
            .getElementsByClassName("parent-layout")[0]
            .classList.remove("parent-wallet__mount-wrapper");
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        const { walletItems = [] } = nextProps;

        if (
            walletItems.length !== this.state.wallets.length &&
            this.state.search === ""
        ) {
            this.setState({
                wallets: walletItems,
            });
        }
    }

    render() {
        const { wallets } = this.state;
        const {
            showEmptyWallets,
            hideWalletsLabel,
            marketTickers,
            markets,
            displayHideSwitch,
        } = this.props; // const estimatedValue = cell.currency ? estimateWalletValue(currency ? currency : primaryCurrency(), currencies, cell, markets, marketTickers) : '0.0';

        return (
            <React.Fragment>
                <React.Fragment>
                    <div className="parent-trading-header-selector-search-wrapper">
                        <div
                            className="search"
                            style={{
                                // boxShadow: "0 2px 6px -1px rgba(0,0,0,.2)",
                                borderRadius: "5px",
                                background: "#efefef",
                            }}
                        >
                            <div className="parent-trading-header-selector-search-icon">
                                <img
                                    src={require("../../assets/images/search.svg")}
                                />
                            </div>
                            <input
                                className="parent-trading-header-selector-search-field"
                                onChange={this.handleSearch}
                                value={this.state.search}
                                placeholder="Search"
                                style={{
                                    background: "var(--input-border)",
                                    color: "var(--text-bright)",
                                    border: "1px solid var(--header-border)",
                                }}
                            />
                        </div>
                    </div>
                </React.Fragment>
                {displayHideSwitch && (
                    <div className="mobile-hide-empty-wallets__wrapper mt-4">
                        <div className="mobile-hide-empty-wallets-switch">
                            <label className="switch-wallets mb-0">
                                <input
                                    type="checkbox"
                                    onChange={() =>
                                        this.toggleHideEmptyWallets()
                                    }
                                    checked={showEmptyWallets}
                                />
                                <span className="slider-wallets round" />
                            </label>
                            <span className="mobile-empty-wallets-switch-label">
                                {hideWalletsLabel}
                            </span>
                        </div>
                    </div>
                )}
                <ul className="base-wallet-list">
                    {wallets.filter(w => w.currency !== "usdt").map(this.makeWalletItem)}
                </ul>
            </React.Fragment>
        );
    }
}
