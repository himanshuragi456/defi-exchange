import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { setDocumentTitle } from "../../helpers";
import Swiper from "react-id-swiper";
import { Navigation, Pagination } from "swiper/dist/js/swiper.esm";
import { MarketsComponent } from "../../containers/Markets";
import { marketsFetch, selectMarkets } from "../../modules/public/markets";
import { rangerConnectFetch } from "../../modules/public/ranger";
import { selectRanger } from "../../modules/public/ranger/selectors";
import { selectUserLoggedIn } from "../../modules/user/profile";

class HomeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.translate = (id) =>
            this.props.intl.formatMessage({
                id,
            });

        this.title = this.translate(
            "page.body.wallets.tabs.deposit.fiat.message1"
        );
        this.description = this.translate(
            "page.body.wallets.tabs.deposit.fiat.message2"
        );

        this.onTabChange = (index, label) =>
            this.setState({
                tab: label,
            });

        this.onActiveIndexChange = (index) =>
            this.setState({
                activeIndex: index,
            });

        this.onCurrentTabChange = (index) =>
            this.setState({
                currentTabIndex: index,
            });
    }

    componentDidMount() {
        setDocumentTitle("Home");
        const {
            markets,
            userLoggedIn,
            rangerState: { connected },
        } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }

        if (!connected) {
            this.props.rangerConnect({
                withAuth: userLoggedIn,
            });
        }
    }

    componentWillUnmount() {}

    componentWillReceiveProps(next) {}

    render() {
        const params = {
            modules: [Pagination, Navigation],
            pagination: {
                el: ".swiper-pagination",
                type: "bullets",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            slidesPerView: 3,
            spaceBetween: 20,
            breakpoints: {
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
            },
        };
        const exchangeName = window.env.name || "Exchange";
        return (
            <React.Fragment>
                <div className="wholediv home">
                    <div className="main-row bg-img">
                        <div className="container">
                            <div className="row">
                                <div className="mainhead">
                                    <h3 className="mtop40 bg-h3color">
                                        {exchangeName + " - Your Great Choice"}
                                    </h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="divslider mtop40">
                                        <div className="swiper-container">
                                            <Swiper
                                                className="swiper-wrapper"
                                                {...params}
                                            >
                                                <div className="swiper-slide">
                                                    <img
                                                        src={require("../../assets/images/one.jpg")}
                                                        className="img-bodr"
                                                    />
                                                </div>
                                                <div className="swiper-slide">
                                                    <img
                                                        src={require("../../assets/images/one.jpg")}
                                                        className="img-bodr"
                                                    />
                                                </div>
                                                <div className="swiper-slide">
                                                    <img
                                                        src={require("../../assets/images/one.jpg")}
                                                        className="img-bodr"
                                                    />
                                                </div>
                                                <div className="swiper-slide">
                                                    <img
                                                        src={require("../../assets/images/one.jpg")}
                                                        className="img-bodr"
                                                    />
                                                </div>
                                                <div className="swiper-slide">
                                                    <img
                                                        src={require("../../assets/images/one.jpg")}
                                                        className="img-bodr"
                                                    />
                                                </div>
                                                <div className="swiper-slide">
                                                    <img
                                                        src={require("../../assets/images/one.jpg")}
                                                        className="img-bodr"
                                                    />
                                                </div>
                                            </Swiper>
                                            <div className="swiper-pagination" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="seconddiv">
                        <div className="container">
                            <div className="container mtop40">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-responsive">
                                            <MarketsComponent />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="layout-footer-center ivu-layout-footer">
                        <div className="menu-footer container">
                            <div className="row">
                                <div className="col-md-4">
                                    <ul>
                                        <li className="title">
                                            <img
                                                src={window.env.image}
                                                className="footer-logo__img"
                                            />
                                            <span className="logotxt">
                                                {window.env.name || "Exchange"}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-2">
                                    <ul>
                                        <li className="title">Example</li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-2">
                                    <ul>
                                        <li className="title">Example</li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                        <li className="m">
                                            <a>Example</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-4">
                                    <ul className="contact">
                                        <li className="title">Contact Us</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="bottom-footer text-left">
                                        © 2019 All rights reserved.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    markets: selectMarkets(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
    marketsFetch: () => dispatch(marketsFetch()),
    rangerConnect: (payload) => dispatch(rangerConnectFetch(payload)),
});

export const HomeScreen = injectIntl(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeComponent))
);
