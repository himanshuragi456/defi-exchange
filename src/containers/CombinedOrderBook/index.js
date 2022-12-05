import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
    selectDepthAsks,
    selectDepthBids,
} from "../../modules/public/orderBook";
import { OrderBook } from "../../component/molecules/OrderBook/OrderBook";

class OrderBooksComponent extends React.Component {
    constructor(props) {
        super(props);

        this.orderBookLarge = function () {
            const {
                dataAsks,
                dataBids,
                maxVolume,
                orderBookEntryAsks,
                orderBookEntryBids,
                headers,
                rowBackgroundColorAsks,
                rowBackgroundColorBids,
                onSelectAsks,
                onSelectBids,
                lastPrice,
            } = this.props;
            return (
                <React.Fragment>
                    <div className="base-combined-order-book__large">
                        <OrderBook
                            side="right"
                            headers={headers}
                            data={dataAsks}
                            rowBackgroundColor={rowBackgroundColorAsks}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryAsks}
                            onSelect={onSelectAsks}
                        />
                        <OrderBook
                            side="left"
                            headers={headers}
                            data={dataBids}
                            rowBackgroundColor={rowBackgroundColorBids}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryBids}
                            onSelect={onSelectBids}
                        />
                    </div>
                    <div className="base-combined-order-book__market base-combined-order-book__large-market">
                        {lastPrice}
                    </div>
                </React.Fragment>
            );
        };

        this.orderBookSmall = function () {
            const {
                dataAsks,
                dataBids,
                maxVolume,
                orderBookEntryAsks,
                orderBookEntryBids,
                headers,
                rowBackgroundColorAsks,
                rowBackgroundColorBids,
                onSelectAsks,
                onSelectBids,
                lastPrice,
            } = this.props;
            return (
                <React.Fragment>
                    <div className="base-combined-order-book__small">
                        <OrderBook
                            side="left"
                            headers={headers}
                            data={dataAsks}
                            rowBackgroundColor={rowBackgroundColorAsks}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryAsks.reverse()}
                            onSelect={onSelectAsks}
                        />
                        <div className="base-combined-order-book__market">
                            {lastPrice}
                        </div>
                        <OrderBook
                            side="left"
                            data={dataBids}
                            rowBackgroundColor={rowBackgroundColorBids}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryBids}
                            onSelect={onSelectBids}
                        />
                    </div>
                </React.Fragment>
            );
        };
    }

    render() {
        return (
            <div className="base-combined-order-book">
                {this.props.isLarge
                    ? this.orderBookLarge()
                    : this.orderBookSmall()}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
});

export const CombinedOrderBooksComponent = injectIntl(
    connect(mapStateToProps, null)(OrderBooksComponent)
);
