import classnames from "classnames";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { localeDateSec, setTradeColor } from "../../helpers";
import {
    selectCurrentMarket,
    selectCurrentPrice,
    setCurrentPrice,
} from "../../modules";
import {
    recentTradesFetch,
    selectRecentTradesOfCurrentMarket,
} from "../../modules/public/recentTrades";
import { Decimal } from "../../component/molecules/Decimal/Decimal";
import { Table } from "../../component/molecules/Table/Table";

class RecentTradesComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.getHeaders = () => {
            return [
                this.props.intl.formatMessage({
                    id: "page.body.trade.header.recentTrades.content.price",
                }),
                this.props.intl.formatMessage({
                    id: "page.body.trade.header.recentTrades.content.amount",
                }),
                this.props.intl.formatMessage({
                    id: "page.body.trade.header.recentTrades.content.time",
                }),
            ];
        };

        this.handleOnSelect = (index) => {
            const { recentTrades, currentPrice } = this.props;
            const priceToSet = recentTrades[Number(index)]
                ? recentTrades[Number(index)].price
                : "";

            if (currentPrice !== priceToSet) {
                this.props.setCurrentPrice(priceToSet);
            }
        };
    }

    componentWillReceiveProps(next) {
        if (
            next.currentMarket &&
            this.props.currentMarket !== next.currentMarket
        ) {
            this.props.tradesFetch(next.currentMarket);
        }
    }

    componentDidMount() {
        if (this.props.currentMarket) {
            this.props.tradesFetch(this.props.currentMarket);
        }
    }

    render() {
        const className = classnames({
            "base-table__noData": !this.props.recentTrades.length,
        });
        return (
            <div className={className}>
                <div className="parent-recent-trades">
                    <div className="base-table-header__content">
                        <div className="base-title-component">
                            <FormattedMessage id="page.body.trade.header.recentTrades" />
                        </div>
                    </div>
                    <div
                        style={{
                            height: "calc(100% - 35px)",
                        }}
                    >
                        <Table
                            data={this.getTrades(this.props.recentTrades)}
                            header={this.getHeaders()}
                            onSelect={this.handleOnSelect}
                            className="recent-trades-table"
                        />
                    </div>
                </div>
            </div>
        );
    }

    getTrades(trades) {
        const priceFixed = this.props.currentMarket
            ? this.props.currentMarket.price_precision
            : 0;
        const amountFixed = this.props.currentMarket
            ? this.props.currentMarket.amount_precision
            : 0;

        const renderRow = (item) => {
            const { id, created_at, taker_type, price, amount } = item;
            const takerType =
                taker_type === "buy"
                    ? "recent-trades-positive"
                    : "recent-trades-negative";
            return [
                takerType,
                <span
                    style={{
                        color: setTradeColor(taker_type).color,
                    }}
                    className={takerType}
                    key={id}
                >
                    <Decimal fixed={priceFixed} fromOrderBooks={true}>
                        {price}
                    </Decimal>
                </span>,
                <span key={id}>
                    <Decimal fixed={amountFixed}>
                        {amount ? amount : item.volume}
                    </Decimal>
                </span>,
                <span key={id}>{localeDateSec(created_at).slice(5)}</span>,
            ];
        };

        return trades.length > 0
            ? trades.map(renderRow)
            : [
                  [
                      [""],
                      [""],
                      this.props.intl.formatMessage({
                          id: "page.noDataToShow",
                      }),
                  ],
              ];
    }
}

const mapStateToProps = (state) => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps = (dispatch) => ({
    tradesFetch: (market) => dispatch(recentTradesFetch(market)),
    setCurrentPrice: (payload) => dispatch(setCurrentPrice(payload)),
});

export const RecentTrades = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(RecentTradesComponent)
);
