import * as React from "react";
import { OrderForm, TabPanel } from "../";

const orderTypes = ["Limit", "Market"];

class Order extends React.PureComponent {
    constructor() {
        super(...arguments);

        this.getPanels = () => {
            const {
                available,
                disabled,
                feeBuy,
                feeSell,
                priceMarketBuy,
                priceMarketSell,
                from,
                to,
            } = this.props;
            return [
                {
                    content: (
                        <OrderForm
                            disabled={disabled}
                            fee={feeBuy}
                            type="buy"
                            from={from}
                            to={to}
                            available={available}
                            priceMarket={priceMarketBuy}
                            onSubmit={this.props.onSubmit}
                            orderTypes={orderTypes}
                        />
                    ),
                    label: "Buy",
                },
                {
                    content: (
                        <OrderForm
                            fee={feeSell}
                            type="sell"
                            from={from}
                            to={to}
                            available={available}
                            priceMarket={priceMarketSell}
                            onSubmit={this.props.onSubmit}
                            orderTypes={orderTypes}
                        />
                    ),
                    label: "Sell",
                },
            ];
        };

        this.handleChangeTab = (index, label) => {
            if (this.props.handleSendType && label) {
                this.props.handleSendType(index, label);
            }
        };
    }

    render() {
        return (
            <div className="base-order">
                <TabPanel
                    fixed={true}
                    panels={this.getPanels()}
                    onTabChange={this.handleChangeTab}
                />
            </div>
        );
    }
}

export { Order, orderTypes };
