import * as React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";
import { Redirect, withRouter } from "react-router-dom";
import {
    considerMarketsDown,
    minutesUntilAutoLogout,
    underConstruction,
} from "../../api";
import {
    logoutFetch,
    selectCurrentMarket,
    selectSignInLastLink,
    selectUserFetching,
    selectUserInfo,
    selectUserLoggedIn,
    selectWindowWidth,
    setCallbackLink,
    setWindowWidth,
    userFetch,
    walletsReset,
} from "../../modules";
import {
    ChangeForgottenPasswordScreen,
    ConfirmScreen,
    EmailVerificationScreen,
    ForgotPasswordScreen,
    OrdersScreen,
    OrdersTabScreen,
    ProfileScreen,
    ProfileTwoFactorAuthScreen,
    SignInScreen,
    SignUpScreen,
    TradingScreen,
    UnderConstruction,
    VerificationScreen,
    WalletsScreen,
} from "../../screens";
import { ClipLoader } from "react-spinners";
import { toggleColorTheme } from "../../helpers/toggleColorTheme";
import {
    selectCallbackLink,
    selectCurrentTheme,
    setSignInLastLink,
} from "../../modules/public/generic";
import { selectMarketsErrorVar } from "../../modules/public/markets";
import { BottomNavTAb } from "../../containers/BottomNavTab";
import { Header } from "../../containers/Header";
import { Alerts } from "../../containers/Alerts";
import { MobilMarkets } from "../../containers/MobileMarkets";
import { BottomNavTabMarket } from "../../containers/BottomNavTabMarket";
import { OrderBookDesktop, RecentTrades } from "../../containers";
import { CurrentMarketsInfo } from "../../containers/CurrentMarketInfo";
import PublicRoute from "../../helpers/PublicRoute";
import PrivateRoute from "../../helpers/PrivateRoute";
import PEP from "../../screens/PEP";
import TermsAndService from "../../screens/TermsAndService";
import PrivacyPolicy from "../../screens/PrivacyPolicy";
import Risk from "../../screens/Risk";
import KycModal from "../../containers/KycModal";
import { ConverterScreen } from "../../screens/ConverterScreen";
import { ConverterHistoryScreen } from "../../screens/ConverterHistoryScreen";

Date.prototype.now = function () {
    return typeof Date.now == "function" ? Date.now() : new Date().getTime();
};

export const renderLoader = () => (
    <div
        className="parent-loader-container d-flex justify-content-center align-items-center w-100"
        style={{
            height: "calc(100vh - 70px)",
            backgroundColor: "var(--main-bg)",
        }}
    >
        <ClipLoader
            sizeUnit="px"
            size={35}
            loading={true}
            color="var(--accent)"
        />
    </div>
);
const CHECK_INTERVAL = 15000;
const STORE_KEY = "lastAction";

class LayoutComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = { kycmodal: false }

        this.getLastAction = () => {
            if (localStorage.getItem(STORE_KEY) !== null) {
                return parseInt(localStorage.getItem(STORE_KEY) || "0", 10);
            }

            return 0;
        };

        this.setLastAction = (lastAction) => {
            localStorage.setItem(STORE_KEY, lastAction.toString());
        };

        this.initListener = () => {
            this.reset();

            for (const type of LayoutComponent.eventsListen) {
                document.body.addEventListener(type, this.reset);
            }
        };

        this.reset = () => {
            this.setLastAction(new Date().now());
        };

        this.initInterval = () => {
            this.timer = setInterval(() => {
                this.check();
            }, CHECK_INTERVAL);
        };

        this.check = () => {
            const { user } = this.props;
            const now = new Date().now();
            const timeleft =
                this.getLastAction() +
                parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
            const diff = timeleft - now;
            const isTimeout = diff < 0;

            if (isTimeout && user.email) {
                this.props.logout();
            }
        };

        this.handleScreen = (e) => {
            this.props.setWindowWidth(window.innerWidth);
        };

        this.initListener();
    }

    componentDidMount() {
        this.props.setWindowWidth(window.innerWidth);
        window.addEventListener("resize", this.handleScreen.bind(this));
        this.props.userFetch();
        this.initInterval();
        this.check();
    }

    componentDidUpdate(next) {
        const { isLoggedIn, history, windowWidth, user } = this.props;

        if (!isLoggedIn && next.isLoggedIn) {
            this.props.walletsReset();
            if (user.level < 3 && window.location.pathname !== "/confirm") {
                this.setState({
                    kycmodal: true
                })
            }

            if (windowWidth < 769) {
                if (!history.location.pathname.includes("/markets-list")) {
                    history.push("/markets-list");
                }
            } else {
                if (!history.location.pathname.includes("/trading")) {
                    history.push("/trading");
                }
            }
        }

        if (window.location.pathname === "/confirm" && this.state.kycmodal === true) {
            this.setState({
                kycmodal: false
            })
        }
        // if(isLoggedIn){
        //     this.setState({kycmodal: true})
        // }
    }

    componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }

        window.removeEventListener("resize", this.handleScreen.bind(this));
        clearInterval(this.timer);
    }

    render() {
        const {
            isLoggedIn,
            userLoading,
            colorTheme,
            user,
            noMarketFound,
            windowWidth,
            callbackLink,
        } = this.props;
        toggleColorTheme(colorTheme);
        const userRole = ["superadmin", "admin"].includes(user && user.role);
        const marketsFound = considerMarketsDown() ? noMarketFound : false;
        const showUnderConstructionPage = underConstruction() || marketsFound;

        if (
            ![
                "/signin",
                "/email-verification",
                "/signup",
                "/pep",
                "/terms-and-service",
                "/privacy-policy",
                "/risks",
                "/accounts/confirmation",
                "/forgot-password",
                "/accounts/password_reset",
            ].includes(this.props.history.location.pathname)
        ) {
            this.props.setCallbackLink(this.props.history.location.pathname);
            this.props.setSignInLastLink(false);
        } else {
            this.props.setSignInLastLink(true);
        }

        const path = window.location.pathname;
        const noContainer =
            path.includes("signin") ||
            path.includes("signup") ||
            path.includes("forgot-password") ||
            path.includes("accounts");
        const homeNavTab =
            path.includes("markets") ||
            path.includes("wallets") ||
            path.includes("profile") ||
            path.includes("history") ||
            path.includes("security") ||
            path.includes("confirm") ||
            path.includes("under-construction");
        const MaintenanceRoutes = (
            <React.Fragment>
                <Switch>
                    <Route
                        path="/under-construction"
                        component={UnderConstruction}
                    />
                    <Route path="/" component={UnderConstruction} />
                    <Route path="**">
                        <Redirect to="/under-construction" />
                    </Route>
                </Switch>
            </React.Fragment>
        );
        const NoMaintenanceRoutes = (
            <React.Fragment>
                <Header image={window.env.image} />
                {windowWidth < 769 && !homeNavTab && !noContainer && (
                    <CurrentMarketsInfo />
                )}
                <Alerts />
                {isLoggedIn && <KycModal
                    show={this.state.kycmodal}
                    hide={() => this.setState({ kycmodal: false })}
                />}
                <div
                    className={`${noContainer
                            ? "parent-layout"
                            : "container-fluid parent-layout"
                        } ${!homeNavTab && "parent-layout__mobile"}`}
                >
                    <Switch>
                        <PublicRoute
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/signin"
                            component={SignInScreen}
                        />
                        <Route
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/pep"
                            component={PEP}
                        />
                        <Route
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/risks"
                            component={Risk}
                        />
                        <PublicRoute
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/signup"
                            component={SignUpScreen}
                        />
                        <Route
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/terms-and-service"
                            component={TermsAndService}
                        />
                        <Route
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/privacy-policy"
                            component={PrivacyPolicy}
                        />
                        <PublicRoute
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/accounts/confirmation"
                            component={VerificationScreen}
                        />
                        <PublicRoute
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/forgot-password"
                            component={ForgotPasswordScreen}
                        />
                        <PublicRoute
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/accounts/password_reset"
                            component={ChangeForgottenPasswordScreen}
                        />
                        <PublicRoute
                            loading={userLoading}
                            windowWidth={windowWidth}
                            isLogged={isLoggedIn}
                            path="/email-verification"
                            component={EmailVerificationScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/orders"
                            component={OrdersScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/history"
                            component={OrdersTabScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/my-orders"
                            component={OrdersTabScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/profile"
                            component={ProfileScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/security/2fa"
                            component={ProfileTwoFactorAuthScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/wallets"
                            component={WalletsScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/confirm"
                            component={ConfirmScreen}
                        />
                        <Route
                            exact={true}
                            path="/convert"
                            component={ConverterScreen}
                        />
                        <Route
                            exact={true}
                            path="/convert-history"
                            component={ConverterHistoryScreen}
                        />
                        <Route
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/order-book"
                            component={OrderBookDesktop}
                        />
                        <Route
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/recent-trades"
                            component={RecentTrades}
                        />
                        <Route
                            exact={true}
                            path="/trading/:market?"
                            component={TradingScreen}
                        />
                        <Route
                            exact={true}
                            path="/markets-list"
                            component={MobilMarkets}
                        />
                        <Route
                            exact={true}
                            path="/"
                            component={
                                windowWidth < 769 ? MobilMarkets : TradingScreen
                            }
                        />
                        <Route path="**">
                            <Redirect to="/" />
                        </Route>
                    </Switch>
                </div>
                {!noContainer ? (
                    homeNavTab ? (
                        <BottomNavTAb />
                    ) : (
                        <BottomNavTabMarket />
                    )
                ) : null}
            </React.Fragment>
        );

        const finalRoutes = () => {
            if (showUnderConstructionPage) {
                if (userRole) {
                    return NoMaintenanceRoutes;
                } else {
                    return MaintenanceRoutes;
                }
            } else {
                return NoMaintenanceRoutes;
            }
        };

        return <React.Fragment>{finalRoutes()}</React.Fragment>;
    }
}

LayoutComponent.eventsListen = [
    "click",
    "keydown",
    "scroll",
    "resize",
    "mousemove",
    "TabSelect",
    "TabHide",
];

const mapStateToProps = (state) => ({
    currentMarket: selectCurrentMarket(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    userLoading: selectUserFetching(state),
    colorTheme: selectCurrentTheme(state),
    noMarketFound: selectMarketsErrorVar(state),
    windowWidth: selectWindowWidth(state),
    callbackLink: selectCallbackLink(state),
    signInLastLink: selectSignInLastLink(state),
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logoutFetch()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
    setWindowWidth: (payload) => dispatch(setWindowWidth(payload)),
    setCallbackLink: (payload) => dispatch(setCallbackLink(payload)),
    setSignInLastLink: (payload) => dispatch(setSignInLastLink(payload)),
});

const Layout = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(LayoutComponent)
);
export { Layout };
