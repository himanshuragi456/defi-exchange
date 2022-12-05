import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
    estimateValue,
    estimateWithMarket,
    findPrecision,
} from "../../../helpers/estimateValue";
import {
    marketsFetch,
    selectMarkets,
    selectMarketTickers,
    selectUserLoggedIn,
} from "../../../modules";
import { rangerConnectFetch } from "../../../modules/public/ranger";
import { selectRanger } from "../../../modules/public/ranger/selectors";
import { Decimal } from "../../../component/molecules/Decimal/Decimal";

class EstimatedValueContainer extends React.Component {
    constructor() {
        super(...arguments);

        this.t = (key) => {
            return this.props.intl.formatMessage({
                id: key,
            });
        };
    }

    componentDidMount() {
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

    render() {
        const { wallets, markets, marketTickers } = this.props;
        const primaryCurrency = "usd";
        const primaryCurrencyPrecision = findPrecision(
            primaryCurrency,
            markets
        );
        const estimatedValue = estimateValue(
            primaryCurrency,
            wallets,
            markets,
            marketTickers
        );
        const secondaryCurrency = "eth";
        const secondaryCurrencyPrecision = findPrecision(
            secondaryCurrency,
            markets
        );
        const estimatedValueSecondary = estimateWithMarket(
            secondaryCurrency,
            primaryCurrency,
            estimatedValue,
            markets,
            marketTickers
        );
        return (
            <div className="parent-estimated-value">
                <div className="parent-estimated-value__container">
                    {this.t("page.body.wallets.estimated_value")}
                    <span className="value-container">
                        <span className="value">
                            {Decimal.format(
                                estimatedValue,
                                primaryCurrencyPrecision
                            )}
                        </span>
                        <span className="value-sign">
                            {primaryCurrency.toUpperCase()}
                        </span>
                    </span>
                    <span className="value-container">
                        <span className="value">
                            {Decimal.format(
                                estimatedValueSecondary,
                                secondaryCurrencyPrecision
                            )}
                        </span>
                        <span className="value-sign">
                            {secondaryCurrency.toUpperCase()}
                        </span>
                    </span>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
    marketsFetch: () => dispatch(marketsFetch()),
    rangerConnect: (payload) => dispatch(rangerConnectFetch(payload)),
});

export const EstimatedValue = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(EstimatedValueContainer)
);
