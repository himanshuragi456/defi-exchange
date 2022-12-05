import * as React from "react";
import { TabPanel } from "../../components/TabPanel";
import { marketsFetch } from "../../modules/public/markets";
import { walletsFetch } from "../../modules/user/wallets";
import { fetchHistory, resetHistory } from "../../modules/user/history";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { OrderBook } from "../OrderBook";
import { RecentTrades } from "../RecentTrades";

class OrdersRecentTabContainer extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            tab: "openOrders",
            currentTabIndex: 0,
        };
        this.tabMapping = ["openOrders", "recentOrders"];

        this.onCurrentTabChange = (index) =>
            this.setState({
                currentTabIndex: index,
            });

        this.handleMakeRequest = (index) => {
            if (this.state.tab === this.tabMapping[index]) {
                return;
            }

            this.props.resetHistory();
            this.setState({
                tab: this.tabMapping[index],
            });
        };

        this.renderTabs = () => {
            const { tab } = this.state;
            return [
                {
                    content: tab === "openOrders" ? <OrderBook /> : null,
                    label: this.props.intl.formatMessage({
                        id: "page.body.trade.orderbook",
                    }),
                },
                {
                    content: tab === "recentOrders" ? <RecentTrades /> : null,
                    label: this.props.intl.formatMessage({
                        id: "page.body.trade.header.recentTrades",
                    }),
                },
            ];
        };
    }

    render() {
        return (
            <TabPanel
                panels={this.renderTabs()}
                onTabChange={this.handleMakeRequest}
                currentTabIndex={this.state.currentTabIndex}
                onCurrentTabChange={this.onCurrentTabChange}
            />
        );
    }
} // const mapStateToProps = state => ({
//     currentMarket: selectCurrentMarket(state),
// });

const mapDispatchToProps = (dispatch) => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchHistory: (payload) => dispatch(fetchHistory(payload)),
    resetHistory: () => dispatch(resetHistory()),
});

export const OrdersRecentTab = injectIntl(
    connect(null, mapDispatchToProps)(OrdersRecentTabContainer)
);
