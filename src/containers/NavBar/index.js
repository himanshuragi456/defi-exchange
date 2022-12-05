import classnames from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { pgButtons, pgRoutes } from "../../constants";
import {
    changeLanguage,
    logoutFetch,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectUserInfo,
    selectUserLoggedIn,
    walletsReset,
} from "../../modules";
import {
    changeColorTheme,
    selectCurrentTheme,
} from "../../modules/public/generic";
import dark from "./toggle_light.svg";
import light from "./toggle_dark.svg";

class NavBarComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
            isOpenLanguage: false,
            email: "",
            name: "",
            message: "",
            recaptchaResponse: "",
            errorModal: false,
            windowWidth: window.innerWidth,
        };

        this.navItem = (address, onLinkChange) => (values, index) => {
            const [name, url, isExternal] = values;
            const { isLoggedIn, currentMarket } = this.props;
            const cx = classnames("parent-navbar__content-item", {
                "parent-navbar__content-item--active": this.shouldUnderline(
                    address,
                    url
                ),
                "parent-navbar__content-item-logging": isLoggedIn,
            });

            const handleLinkChange = () => {
                if (onLinkChange) {
                    onLinkChange();
                }
            };

            const path =
                url.includes("/trading") && currentMarket
                    ? `/trading/${currentMarket.id}`
                    : url;
            return (
                <li onClick={handleLinkChange} key={index}>
                    {isExternal ? (
                        <a className={cx} href={path}>
                            <FormattedMessage id={name} />
                        </a>
                    ) : (
                        <Link className={cx} to={path}>
                            <FormattedMessage id={name} />
                        </Link>
                    )}
                </li>
            );
        };

        this.buttonItem = (address, onLinkChange) => (values, index) => {
            const [name, url] = values;
            const { isLoggedIn, currentMarket } = this.props;
            const cx = classnames("btn", {
                "btn btn-primary": this.shouldUnderline(address, url),
                "parent-navbar__content-item-logging": isLoggedIn,
            });

            const handleLinkChange = () => {
                if (onLinkChange) {
                    onLinkChange();
                }
            };

            const path =
                url.includes("/trading") && currentMarket
                    ? `/trading/${currentMarket.id}`
                    : url;
            return (
                <li onClick={handleLinkChange} key={index}>
                    <Link className={cx} to={path}>
                        <FormattedMessage id={name} />
                    </Link>
                </li>
            );
        };

        this.shouldUnderline = (address, url) =>
            (url === "/trading/" && address.includes("/trading")) ||
            address === url;

        this.getProfile = () => {
            const { user } = this.props;
            return (
                <div className="parent-navbar__header-profile">
                    <Link
                        className="parent-navbar__admin-logout"
                        to="/profile"
                        onClick={this.handleRouteChange("/profile")}
                    >
                        <FormattedMessage id="page.header.navbar.profile" />
                    </Link>
                    <span>{user.email}</span>
                    <img
                        onClick={this.handleLogOut}
                        className="parent-navbar__header-profile-logout"
                        src={require(`./logout.svg`)}
                    />
                </div>
            );
        };

        this.getLanguageMenu = () => {
            return (
                <div
                    className="dropdown-menu dropdown-menu-language"
                    role="menu"
                >
                    <div
                        className="dropdown-menu-item-lang"
                        onClick={(e) => this.handleChangeLanguage("en")}
                    >
                        EN
                    </div>
                    <div
                        className="dropdown-menu-item-lang"
                        onClick={(e) => this.handleChangeLanguage("ar")}
                    >
                        AR
                    </div>
                    <div
                        className="dropdown-menu-item-lang"
                        onClick={(e) => this.handleChangeLanguage("ur")}
                    >
                        UR
                    </div>
                    <div
                        className="dropdown-menu-item-lang"
                        onClick={(e) => this.handleChangeLanguage("es")}
                    >
                        SP
                    </div>
                </div>
            );
        };

        this.userName = () => {
            const {user} = this.props
            const profile = user?.profiles?.find(p => !!p.first_name)
            if(profile?.first_name){
                return profile?.first_name;
            }else{
                if(user.username !== null && user.username !== "null"){
                    return  `${user.username}`
                }else{
                    if(user?.email){
                        return  `${user.email.slice(0,3)}...${user.email.slice((user.email.length - 3), user.email.length)}`
                    }
                }
            }

            return "Wenbit User"
        }

        this.getUserEmailMenu = () => {
            const { isOpen } = this.state;
            const {user} = this.props;
            console.log("USER", user);
            const userClassName = classnames("navbar-user-menu", {
                "navbar-user-menu-active": isOpen,
            });
            return (
                <div className="parent-navbar__header-settings__account-dropdown dropdown-toggle">
                    <div onClick={this.openMenu} className={userClassName}>
                        <img
                            className="parent-navbar__header-settings__account-dropdown-user-profile-icon"
                            src={require(`./${
                                isOpen ? "open" : "close"
                            }-avatar.svg`)}
                        />
                        <span style={{fontSize: "15px", textTransform: "capitalize"}}>hello, {this.userName()}</span>
                        <img
                            className="icon"
                            src={require(`./${
                                isOpen ? "open" : "close"
                            }-icon.svg`)}
                        />
                    </div>
                    {isOpen ? this.getUserMenu() : null}
                </div>
            );
        };

        this.getSignupMenu = () => {
            const { location } = this.props;
            const address = location ? location.pathname : ""; //   return React.createElement(
            //     "ul",
            //     { className: "parent-navbar__buttons" },
            //     pgButtons(null).map(this.buttonItem(address, this.props.onLinkChange))
            //   );

            const { isOpen } = this.state;
            const userClassName = classnames("navbar-user-menu", {
                "navbar-user-menu-active": isOpen,
            });
            return (
                <div className="parent-navbar__header-settings__account-dropdown dropdown-toggle">
                    <div
                        onClick={this.openMenu}
                        className={userClassName}
                        style={{
                            width: "50px",
                            justifyContent: "end",
                        }}
                    >
                        <img
                            className="parent-navbar__header-settings__account-dropdown-user-profile-icon"
                            src={require(`./auth-avatar.svg`)}
                        />
                    </div>
                    {isOpen ? this.getAuthMenu() : null}
                </div>
            );
        };

        this.getAuthMenu = () => {
            const { location } = this.props;
            const address = location ? location.pathname : "";
            return (
                <ul className="dropdown-menu dropdown-menu-user" role="menu">
                    {pgButtons(null).map(
                        this.buttonItem(address, this.props.onLinkChange)
                    )}
                </ul>
            );
        };

        this.getUserMenu = () => {
            return (
                <div className="dropdown-menu dropdown-menu-user" role="menu">
                    <div
                        className="dropdown-menu-item-user"
                        onClick={this.handleRouteChange("/profile")}
                    >
                        <Link
                            className="parent-navbar__admin-logout"
                            to="/profile"
                        >
                            <FormattedMessage id="page.header.navbar.profile" />
                        </Link>
                    </div>
                    <div
                        className="dropdown-menu-item-user"
                        onClick={this.handleLogOut}
                    >
                        <a className="parent-navbar__admin-logout">
                            <FormattedMessage id="page.header.navbar.logout" />
                        </a>
                    </div>
                </div>
            );
        };

        this.handleRouteChange = (to) => () => {
            this.setState(
                {
                    isOpen: false,
                },
                () => {
                    this.props.history.push(to);
                }
            );
        };

        this.handleLogOut = () => {
            this.setState(
                {
                    isOpen: false,
                },
                () => {
                    this.props.logout();
                }
            );
        };

        this.openMenu = () => {
            this.setState(
                {
                    isOpen: !this.state.isOpen,
                },
                () => {
                    if (this.state.isOpen) {
                        document.addEventListener("click", this.closeMenu);
                    } else {
                        document.removeEventListener("click", this.closeMenu);
                    }
                }
            );
        };

        this.closeMenu = () => {
            this.setState(
                {
                    isOpen: false,
                },
                () => {
                    document.removeEventListener("click", this.closeMenu);
                }
            );
        };

        this.toggleLanguageMenu = () => {
            this.setState(
                {
                    isOpenLanguage: !this.state.isOpenLanguage,
                },
                () => {
                    if (this.state.isOpenLanguage) {
                        document.addEventListener(
                            "click",
                            this.closeLanguageMenu
                        );
                    } else {
                        document.removeEventListener(
                            "click",
                            this.closeLanguageMenu
                        );
                    }
                }
            );
        };

        this.closeLanguageMenu = () => {
            this.setState(
                {
                    isOpenLanguage: false,
                },
                () => {
                    document.removeEventListener(
                        "click",
                        this.closeLanguageMenu
                    );
                }
            );
        };

        this.handleChangeLanguage = (language) => {
            this.props.changeLanguage(language);
        };

        this.handleScreenSize = (e) => {
            const windowWidth = window.innerWidth; // console.log(window.innerWidth)

            this.setState({
                windowWidth: window.innerWidth,
            });
        };

        this.handleChangeThemeColor = (value) => {
            this.props.changeColorTheme(value);
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleScreenSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleScreenSize.bind(this));
    }

    render() {
        const { location, user, lang, colorTheme } = this.props;
        const { isOpenLanguage, windowWidth } = this.state;
        const address = location ? location.pathname : "";
        const languageName = lang.toUpperCase();
        const languageClassName = classnames("dropdown-menu-language-field", {
            "dropdown-menu-language-field-active": isOpenLanguage,
        });
        return (
            <div className="parent-navbar">
                {user.email ? this.getProfile() : null}
                <ul className="parent-navbar__content">
                    {pgRoutes(!!user.email).map(
                        this.navItem(address, this.props.onLinkChange)
                    )}
                </ul>
                <div className="parent-navbar">
                    {
                        // window.location.pathname.includes('/trading') && this.state.windowWidth > 1168 ? React.createElement(ToolBar, null) : null,
                        windowWidth > 768 && (
                            <div
                                className="theme-toggle-button"
                                onClick={() =>
                                    this.handleChangeThemeColor(
                                        colorTheme === "light"
                                            ? "dark"
                                            : "light"
                                    )
                                }
                            >
                                <img
                                    style={{
                                        display: "block",
                                    }}
                                    src={colorTheme === "dark" ? dark : light}
                                />
                            </div>
                        )
                    }
                    <div className="parent-navbar__header-settings">
                        {user.email
                            ? this.getUserEmailMenu()
                            : this.getSignupMenu()}
                        <div className="parent-navbar__header-settings__account-dropdown dropdown-toggle dropdown-menu-language-container">
                            <div
                                onClick={this.toggleLanguageMenu}
                                className={languageClassName}
                            >
                                {languageName}
                                <img
                                    className="icon"
                                    src={require(`./${
                                        isOpenLanguage
                                            ? colorTheme &&
                                              colorTheme === "light"
                                                ? "open__dark"
                                                : "open"
                                            : "close"
                                    }-icon.svg`)}
                                />
                            </div>
                            {isOpenLanguage ? this.getLanguageMenu() : null}
                        </div>
                    </div>
                    <div
                        className="parent-navbar__header-language"
                        onClick={this.toggleLanguageMenu}
                    >
                        <span>LANGUAGE</span>
                        <span>
                            {languageName}
                            <img
                                className="icon"
                                src={require(`./${
                                    isOpenLanguage ? "open" : "close"
                                }-icon.svg`)}
                            />
                        </span>
                        {isOpenLanguage ? this.getLanguageMenu() : null}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentMarket: selectCurrentMarket(state),
    address: "",
    lang: selectCurrentLanguage(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    colorTheme: selectCurrentTheme(state),
});

const mapDispatchToProps = (dispatch) => ({
    changeLanguage: (payload) => dispatch(changeLanguage(payload)),
    logout: () => dispatch(logoutFetch()),
    walletsReset: () => dispatch(walletsReset()),
    changeColorTheme: (payload) => dispatch(changeColorTheme(payload)),
});

const NavBar = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NavBarComponent)
);
export { NavBar };
