import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectMobileWalletUi, setMobileWalletUi } from "../../modules";
import { NavBar } from "../NavBar";
import closeButton from "../../assets/images/left_arrow.png";
import mltDark from "../../assets/images/menttech_dark.png";
import mltLight from "../../assets/images/menttech_light.png";
import { isTradePage } from "../../helpers";
import { ProductMenu } from "../ProductMenu";

class Head extends React.Component {
    constructor(props) {
        super(props);

        this.openMenu = () => {
            this.setState({
                isActive: true,
            });
            document
                .getElementsByClassName("parent-header__navbar")[0]
                .addEventListener("click", this.handleOutsideClick);
        };

        this.backWallets = () => {
            this.props.setMobileWalletUi("");
        };

        this.closeMenu = (e) => {
            this.setState({
                isActive: false,
            });
            this.props.setMobileWalletUi("");
        };

        this.handleBackButton = () => {
            const path = window.location.pathname;
            const marketsNavTab =
                path.includes("trading") ||
                path.includes("my-orders") ||
                path.includes("recent-trades") ||
                path.includes("order-book");

            if (marketsNavTab) {
                this.props.history.push("/markets-list");
            } else {
                this.props.history.goBack();
            }
        };

        this.handleOutsideClick = (e) => {
            if (e.offsetX > e.target.clientWidth) {
                this.setState({
                    isActive: false,
                });
                document
                    .getElementsByClassName("parent-header__navbar")[0]
                    .removeEventListener("click", this.handleOutsideClick);
            }
        };

        this.state = {
            isActive: false,
        };
    }

    render() {
        const { location, mobileWallet, image } = this.props;
        const { isActive } = this.state;
        const notValidBorderBottomPage = [
            "/signup",
            "/signin",
            "/forgot-password",
        ];
        const isPageValid =
            notValidBorderBottomPage.findIndex(
                (e) => e === location.pathname
            ) !== -1;
        const path = window.location.pathname;
        const homeNavTab =
            path.includes("markets") ||
            path.includes("wallets") ||
            path.includes("profile") ||
            path.includes("history");
        return (
            <header
                className={`parent-header ${
                    isActive ? "parent-header--active" : ""
                } ${isTradePage() && "parent-header--trade"}`}
            >
                <div className="parent-container parent-header__content">
                    <div className="parent-header-logo">
                        <a
                            href={window.env.homepageUrl || "/"}
                            className="parent-header__logo"
                        >
                            <div className="parent-logo">
                                <img
                                    src={
                                        image === undefined
                                            ? isTradePage()
                                                ? mltLight
                                                : mltDark
                                            : isTradePage()
                                            ? image.light
                                            : image.dark
                                    }
                                    className={`parent-logo__img ${
                                        image === undefined
                                            ? "parent-logo__img_alternative"
                                            : ""
                                    }`}
                                    alt="Logo"
                                />
                            </div>
                        </a>
                        <ProductMenu />
                    </div>
                    <div className="parent-header__location">
                        {mobileWallet ? (
                            <span>{mobileWallet}</span>
                        ) : (
                            <span>
                                {location.pathname.split("/")[1] === "trading"
                                    ? ""
                                    : location.pathname.split("/")[1]}
                            </span>
                        )}
                    </div>
                    {((!homeNavTab || mobileWallet) &&
                        window.innerWidth < 720) ||
                    (window.innerWidth < 768 && !homeNavTab) ? (
                        <div
                            onClick={
                                mobileWallet
                                    ? this.backWallets
                                    : this.handleBackButton
                            }
                            className="parent-header__toggler"
                        >
                            <img src={closeButton} />
                        </div>
                    ) : null}
                    <div className="parent-header__navbar">
                        <NavBar onLinkChange={this.closeMenu} />
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    mobileWallet: selectMobileWalletUi(state),
});

const mapDispatchToProps = (dispatch) => ({
    setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
});

const Header = withRouter(connect(mapStateToProps, mapDispatchToProps)(Head));
export { Header };
