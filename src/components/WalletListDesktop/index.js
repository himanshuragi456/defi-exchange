import * as React from "react";
import { WalletItem } from "../WalletItem";
import { Table } from "../../component/molecules/Table/Table";

const removeAlt = (str) => str.replace("-alt", "");

const style = {
    listStyleType: "none",
    padding: "calc(var(--gap) * 0.5) calc(var(--gap))",
};

/**
 * Component to display list of user wallets. It is scrollable and reacts on WalletItem click.
 */

export class WalletListDesktop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawModel: false,
            wallets: [],
            search: "",
        };

        this.handleSearch = (e) => {
            let text = e.target.value;

            if (text.length !== 0) {
                let result = this.state.wallets.filter((element) => {
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

        this.defaultHeaders = ["Coin", "Name", "Available", "Locked", "Action"];

        this.itemState = (i) => {
            return this.props.activeIndex === i;
        };

        this.makeWalletItem = (props, i) => (
            <li
                key={i}
                style={style}
                onClick={this.handleClick.bind(this, i, props)}
            >
                <WalletItem
                    {...Object.assign(
                        {
                            key: i,
                        },
                        {
                            ...props,
                            active: this.itemState(i),
                            currency: removeAlt(props.currency),
                        }
                    )}
                />
            </li>
        );

        this.handleClick = (i, props, action) => {
            if (this.props.onWalletSelectionChange) {
                this.props.onWalletSelectionChange(props);
            }

            if (this.props.onActiveIndexChange) {
                this.props.onActiveIndexChange(i);
            }

            if (action === "deposit") {
                this.props.toggleDeposit();
            }

            if (action === "withdraw") {
                this.props.toggleWithdraw();
            }
        };

        this.toggleSubmitModal = () => {
            this.props.depositModal = false;
        };

        this.mapRows = (cell, index) => {
            let dollarConversionRatio =
                this.props.marketTickers[
                    cell.currency ? cell.currency.toLowerCase() + "usd" : 0
                ];
            dollarConversionRatio = dollarConversionRatio
                ? dollarConversionRatio.last
                : "";
            return this.mapCell(cell, index, dollarConversionRatio);
        };

        this.mapCell = (cell, index, dollarConversionRatio) => {
            let iconUrl = cell.iconUrl;

            if (!iconUrl) {
                try {
                    if (cell.currency == "QUBIT") {
                        iconUrl = require("../WalletItem/Icon/QUBIT.png");
                    } else {
                        iconUrl = require(`../WalletItem/Icon/${cell.currency}.svg`);
                    }
                } catch (e) {
                    iconUrl = require(`../WalletItem/Icon/default.png`);
                }
            }

            const currencyName = (value) => {
                if (typeof value !== "string") return "";
                return value.charAt(0).toUpperCase() + value.slice(1);
            };

            return [
                <React.Fragment>
                    <img
                        className="base-wallet-item__icon"
                        src={iconUrl}
                        currency={cell.currency}
                    />
                    <b className="font-boldes">{cell.currency}</b>
                </React.Fragment>,
                currencyName(cell.name),
                <b className="font-boldes">
                    {cell.balance +
                        ` ${
                            dollarConversionRatio &&
                            dollarConversionRatio !== "0.0"
                                ? "(" +
                                  Number(
                                      cell.balance * dollarConversionRatio
                                  ).toFixed(this.props.usdPrecision || 4) +
                                  " USD)"
                                : ""
                        }`}
                </b>,
                cell.locked,
                this.renderAction(cell, index),
            ];
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
        const {
            headers = this.defaultHeaders,
            walletItems = [],
            walletsLoading,
            showEmptyWallets,
            hideWalletsLabel,
            noWalletsLabel,
        } = this.props;
        let data = [["", "", noWalletsLabel, "", ""]];
        const { wallets } = this.state;
        const tableData =
            wallets.length !== 0 ? wallets.map(this.mapRows) : data;
        return (
            <React.Fragment>
                <div className="base-table-header__content wallet-header-color-light shadow-none" />
                <React.Fragment>
                    <div className="parent-trading-header-selector-search-wrapper">
                        <div className="mobile-hide-empty-wallets-switch desktop-hide-wallets">
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
                        <div
                            className="search"
                            style={{
                                // boxShadow: "0 2px 6px -1px rgba(0,0,0,.2)",
                                borderRadius: "5px",
                                background: "var(--input-border)",
                                border: "1px solid var(--header-border)",
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
                                }}
                            />
                        </div>
                    </div>
                </React.Fragment>
                {!walletsLoading && (
                    <Table
                        data={tableData}
                        header={headers}
                        className="wallet-desktop"
                    />
                )}
            </React.Fragment>
        );
    }

    renderAction(cell, index) {
        return (
            <div
                style={{
                    display: "flex",
                }}
            >
                <button
                    className="btn-linear"
                    style={{
                        padding: 0,
                        minWidth: "80px",
                        marginRight: "10px",
                        color: "rgba(0, 0, 0, 0.87)",
                    }}
                    onClick={this.handleClick.bind(
                        this,
                        index,
                        cell,
                        "deposit"
                    )}
                >
                    {this.props.depositActionTitle}
                </button>
                <button
                    className="btn-linear"
                    style={{
                        padding: 0,
                        minWidth: "80px",
                        color: "rgba(0, 0, 0, 0.87)",
                    }}
                    onClick={this.handleClick.bind(
                        this,
                        index,
                        cell,
                        "withdraw"
                    )}
                >
                    {this.props.withdrawActionTitle}
                </button>
            </div>
        );
    }
}
