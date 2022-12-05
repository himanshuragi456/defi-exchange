import React from "react";
import "./index.css";
import { NavLink, withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";

class ConvertHistoryNavigationContainer extends React.Component {
    render() {
        return (
            <div className="left-container-parent">
                <NavLink
                    activeStyle={{
                        color: "var(--sidebar-menu-active-text-color)",
                        fontWeight: 700,
                    }}
                    className="nav-link-style d-flex justify-content-between"
                    to="/wallets"
                >
                    <span className="font-weight-bold">Spot order</span>
                    <div className={"left-navbar-icon"}>
                        <img
                            className="icon"
                            src={require(`./close-icon.svg`)}
                        />
                    </div>
                </NavLink>
                <NavLink
                    activeStyle={{
                        color: "var(--sidebar-menu-active-text-color)",
                        fontWeight: 700,
                    }}
                    className="nav-link-style d-flex justify-content-between"
                    to="/wallets"
                >
                    <span className="font-weight-bold">P2P order</span>
                    <div className={"left-navbar-icon"}>
                        <img
                            className="icon"
                            src={require(`./close-icon.svg`)}
                        />
                    </div>
                </NavLink>
                <NavLink
                    activeStyle={{
                        color: "var(--sidebar-menu-active-text-color)",
                        fontWeight: 700,
                    }}
                    className="nav-link-style d-flex justify-content-between"
                    to="/wallets"
                >
                    <span className="font-weight-bold">Margin order</span>
                    <div className={"left-navbar-icon"}>
                        <img
                            className="icon"
                            src={require(`./close-icon.svg`)}
                        />
                    </div>
                </NavLink>
                <NavLink
                    activeStyle={{
                        color: "var(--sidebar-menu-active-text-color)",
                        fontWeight: 700,
                    }}
                    className="nav-link-style d-flex justify-content-between"
                    to="/wallets"
                >
                    <span className="font-weight-bold">Futures order</span>
                    <div className={"left-navbar-icon"}>
                        <img
                            className="icon"
                            src={require(`./close-icon.svg`)}
                        />
                    </div>
                </NavLink>
                <NavLink
                    activeStyle={{
                        color: "var(--sidebar-menu-active-text-color)",
                        fontWeight: 700,
                    }}
                    className="nav-link-style d-flex justify-content-between"
                    to="/wallets"
                >
                    <span className="font-weight-bold">Earn history</span>
                    <div className={"left-navbar-icon"}>
                        <img
                            className="icon"
                            src={require(`./close-icon.svg`)}
                        />
                    </div>
                </NavLink>
                <NavLink
                    activeStyle={{
                        color: "var(--sidebar-menu-active-text-color)",
                        fontWeight: 700,
                    }}
                    className="nav-link-style d-flex justify-content-between"
                    to="/wallets"
                >
                    <span className="font-weight-bold">Buy crypto history</span>
                </NavLink>
            </div>
        );
    }
}

export default injectIntl(withRouter(ConvertHistoryNavigationContainer));
