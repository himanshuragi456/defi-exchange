import classnames from "classnames";
import * as React from "react";
import { HeaderItem } from "../../atoms/index";
import { Dropdown } from "../../molecules/index";

class MarketInfo extends React.Component {
    constructor(props) {
        super(props);

        this.onMarketChange = (index) => {
            const { marketValues } = this.props;
            this.setState({
                currentValues: marketValues[index],
            });
        };

        this.state = {
            currentValues: props.marketValues[0],
        };
    }

    render() {
        const { currentValues } = this.state;
        const { marketPairs, className } = this.props;
        const cx = classnames("base-market-info", className);

        const changeMarket = (selected) => this.onMarketChange(selected);

        return (
            <nav className={cx}>
                <div className="base-market-dropdown">
                    <Dropdown
                        className="base-market-info__pairs-dropdown"
                        list={marketPairs}
                        onSelect={changeMarket}
                    />
                </div>
                <div className="base-market-info__values">
                    <HeaderItem
                        className="base-market-info__values-item"
                        label="Last trade price"
                        amount={currentValues.lastTradePrice}
                        currency={currentValues.lastTradeCurrency}
                    />
                    <HeaderItem
                        className="base-market-info__values-item"
                        label="24 hour price"
                        amount={currentValues.hourPrice}
                        sign={currentValues.hourPriceChange}
                    />
                    <HeaderItem
                        className="base-market-info__values-item"
                        label="24 hour value"
                        amount={currentValues.hourValue}
                        currency={currentValues.hourValueCurrency}
                    />
                </div>
            </nav>
        );
    }
}

export { MarketInfo };
