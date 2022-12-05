import { Button, CryptoIcon, OrderInput } from "@components/components";
import classnames from "classnames";
import * as React from "react";
import { getAmount } from "../../helpers/getTotalPrice";
import { Decimal } from "../../component/molecules/Decimal/Decimal";
import { selectUserLoggedIn } from "./../../modules";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import { OrderTypeDropdown } from "../../containers";

const handleSetValue = (value, defaultValue) => value || defaultValue;

const positiveInput = (text) => {
    let output = text
        .replace(",", ".")
        .replace(/-+/, "")
        .replace(/^0+/, "0")
        .replace(/\.+/, ".")
        .replace(/^0+([1-9])/, "$1");

    if (output[0] === ".") {
        output = `0${output}`;
    }

    return output;
};

const isDisabled = (safeAmount, safePrice, price, props, state) => {
    const invalidAmount = safeAmount <= 0;
    const invalidLimitPrice = Number(price) <= 0 && state.orderType === "Limit";
    const invalidMarketPrice = safePrice <= 0 && state.orderType === "Market";
    return (
        props.disabled ||
        !props.available ||
        invalidAmount ||
        invalidLimitPrice ||
        invalidMarketPrice
    );
};

class OrderFormDesktopComponent extends React.Component {
    constructor(props) {
        super(props);

        this.handleOrderTypeChange = () => {
            const { getExchangeOrderType } = this.props;
            this.setState({
                orderType: getExchangeOrderType,
            });
        };

        this.handleFieldFocus = (field) => {
            if (field === this.props.priceText) {
                this.setState((prev) => ({
                    priceFocused: !prev.priceFocused,
                }));
            } else if (field === this.props.amountText) {
                this.setState((prev) => ({
                    amountFocused: !prev.amountFocused,
                }));
            } else {
            }
        };

        this.handlePriceChange = (value, formatter = false) => {
            const convertedValue = positiveInput(String(value));
            if (formatter)
                return this.setState({
                    price: Decimal.format(
                        convertedValue,
                        this.state.currentMarketBidPrecision
                    ),
                });
            const condition = new RegExp(
                `^(?:[\\d-]*\\.?[\\d-]{0,${this.state.currentMarketBidPrecision}}|[\\d-]*\\.[\\d-])$`
            );

            if (convertedValue.match(condition)) {
                this.setState({
                    price: convertedValue,
                });
            }
        };

        this.handleAmountChange = (value, formatter = false) => {
            const convertedValue = positiveInput(String(value));
            let precision = this.state.currentMarketAskPrecision;

            if (formatter)
                return this.setState({
                    amount: Decimal.format(
                        convertedValue,
                        precision
                    ),
                });

            if (precision === 0) {
                this.setState({
                    amount: parseFloat(parseFloat(convertedValue).toFixed(precision)),
                });
                return;
            }
            const condition = new RegExp(
                `^(?:[\\d-]*\\.?[\\d-]{0,${precision}}|[\\d-]*\\.[\\d-])$`
            );

            if (convertedValue.match(condition)) {
                this.setState({
                    amount: convertedValue,
                });
            }
        };

        this.handleChangeAmountByButton = (value, type) => {
            if (type === "buy") {
                if (this.state.orderType === "Limit") {
                    this.setState({
                        amount:
                            this.props.available && +this.state.price
                                ? Decimal.format(
                                    (this.props.available /
                                        +this.state.price) *
                                    value,
                                    this.state.currentMarketAskPrecision
                                )
                                : "",
                    });
                } else if (this.state.orderType === "Market") {
                    this.setState({
                        amount: this.props.available
                            ? Decimal.format(
                                getAmount(
                                    Number(this.props.available),
                                    this.props.proposals,
                                    value
                                ),
                                this.state.currentMarketAskPrecision
                            )
                            : "",
                    });
                } else {
                }
            } else if (type === "sell") {
                this.setState({
                    amount: this.props.available
                        ? Decimal.format(
                            this.props.available * value,
                            this.state.currentMarketAskPrecision
                        )
                        : "",
                });
            } else {
            }
        };

        this.handleSubmit = () => {
            const { type, userLoggedIn } = this.props;

            if (!userLoggedIn) {
                this.props.history.push("/signin");
            }

            const { amount, price, priceMarket, orderType } = this.state;
            const order = {
                type,
                orderType,
                amount,
                price: orderType === "Market" ? priceMarket : price,
            };
            this.props.onSubmit(order);
            this.setState({
                amount: "",
                price: "",
            });
        };

        this.mapAmountClickToAmountInput = (available, precision) => {
            const { type } = this.props;

            if (this.state.price) {
                if (this.state.price <= 0)
                    return this.setState({
                        amount: 0,
                    });
                this.setState({
                    amount: (type === "buy"
                        ? available / this.state.price
                        : available * 1
                    ).toFixed(precision),
                });
            } else {
                this.setState({
                    amount:
                        available !== ""
                            ? Number(available).toFixed(precision)
                            : Number(this.state.amount).toFixed(precision),
                    price: 1,
                });
            }
        };

        this.state = {
            orderType: "Limit",
            amount: "",
            price: "",
            priceMarket: this.props.priceMarket,
            currentMarketAskPrecision:
                this.props.currentMarketAskPrecision || 6,
            currentMarketOrderPrecision:
                this.props.currentMarketOrderPrecision || 0,
            currentMarketBidPrecision:
                this.props.currentMarketBidPrecision || 6,
            priceFocused: false,
            amountFocused: false,
        };
    }

    componentWillReceiveProps(next) {
        const nextPriceLimitTruncated = Decimal.format(
            next.priceLimit,
            this.state.currentMarketBidPrecision
        );

        if (
            this.state.orderType === "Limit" &&
            next.priceLimit &&
            nextPriceLimitTruncated !== this.state.price
        ) {
            this.setState({
                price: nextPriceLimitTruncated,
            });
            this.props.updatePriceLimit(0);
        }

        this.setState({
            priceMarket: next.priceMarket,
            currentMarketAskPrecision: next.currentMarketAskPrecision,
            currentMarketOrderPrecision: next.currentMarketOrderPrecision || 0,
            currentMarketBidPrecision: next.currentMarketBidPrecision,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.currentMarketBidPrecision !==
            this.props.currentMarketBidPrecision
        ) {
            this.setState({
                price: "",
            });
        }

        if (
            prevProps.currentMarketAskPrecision !==
            this.props.currentMarketAskPrecision
        ) {
            this.setState({
                amount: "",
            });
        }
    }

    componentDidMount() {
        const { userLoggedIn } = this.props;
        this.setState({
            orderType: this.props.getExchangeOrderType,
        });
        const { priceMarket, currentMarketBidPrecision } = this.state;
        this.props.getExchangeOrderType === "Market"
            ? this.setState({
                price: handleSetValue(
                    Decimal.format(priceMarket, currentMarketBidPrecision),
                    "0"
                ),
            })
            : null;
    } // // Stoping the rerendering of this form at every new props arival,
    // // and will only update when a price is selected/market price changed/amount is changedor added.
    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return this.state.price !== nextState.price || this.props.priceMarket !== nextProps.priceMarket || this.state.amount !== nextState.amount;
    // }

    render() {
        const {
            type,
            fee,
            orderTypes,
            className,
            from,
            to,
            available,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            estimatedFeeText,
            submitButtonText,
            proposals,
            minTotalAmount
        } = this.props;
        const {
            orderType,
            amount,
            price,
            priceMarket,
            currentMarketAskPrecision,
            currentMarketOrderPrecision,
            currentMarketBidPrecision,
            priceFocused,
            amountFocused,
        } = this.state;
        const total = // orderType === 'Market'
            // ? getTotalPrice(amount, proposals) :
            (Number(amount) || 0) * (Number(price) || 0);
        const totalPrecision =
            currentMarketBidPrecision + currentMarketAskPrecision;
        let newValue = 0;
        if (orderType === "Market") {
            newValue = (
                (type === "buy"
                    ? (amount * (priceMarket || 1)) / available
                    : amount / available) * 100
            ).toFixed(currentMarketAskPrecision);
        } else {
            newValue = (
                (type === "buy"
                    ? (amount * (price || 1)) / available
                    : amount / available) * 100
            ).toFixed(currentMarketAskPrecision);
        }
        newValue = isFinite(newValue) ? newValue : 0;
        return (
            <div>
                {
                    // React.createElement("h1", null, "Hello World"),
                    <OrderTypeDropdown
                        handleDropdownItem={this.props.handleDropdownItem}
                        selectedDropdownItem={this.props.getExchangeOrderType}
                    />
                }
                <div className={classnames("base-order-form", className)}>
                    {orderType === "Limit" ? (
                        <div className="base-order-item flex-column align-items-start">
                            <OrderInput
                                currency={priceText}
                                label={priceText}
                                placeholder={priceText}
                                value={handleSetValue(price, "")}
                                isFocused={priceFocused}
                                handleChangeValue={this.handlePriceChange}
                                handleFocusInput={() =>
                                    this.handleFieldFocus(priceText)
                                }
                            />
                        </div>
                    ) : (
                        <div className="base-order-item flex-column align-items-start">
                            <div className="base-order-input">
                                <fieldset className="base-order-input__fieldset">
                                    <legend className="base-order-input__fieldset__label">
                                        {handleSetValue(priceText, "")}
                                    </legend>
                                    <div
                                        className="base-order-input__fieldset__input"
                                        style={{
                                            paddingTop: "2px",
                                        }}
                                    >
                                        ≈
                                        <span className="base-order-input__fieldset__input__price">
                                            {handleSetValue(
                                                Decimal.format(
                                                    priceMarket,
                                                    currentMarketBidPrecision
                                                ),
                                                "0"
                                            )}
                                        </span>
                                    </div>
                                </fieldset>
                                <div className="base-order-input__crypto-icon">
                                    <CryptoIcon
                                        code={`${from.toUpperCase()}-alt`}
                                    >
                                        {from.toUpperCase()}
                                    </CryptoIcon>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="base-order-item flex-column align-items-start">
                        <OrderInput
                            currency={to}
                            label={amountText}
                            placeholder={amountText}
                            value={handleSetValue(amount, "")}
                            isFocused={amountFocused}
                            handleChangeValue={this.handleAmountChange}
                            handleFocusInput={() =>
                                this.handleFieldFocus(amountText)
                            }
                        />
                    </div>
                    <div className="mt-3 base-order-item">
                        <div className="base-order-item__available">
                            <label className="base-order-item__available__label">
                                {handleSetValue(availableText, "Available")}
                            </label>
                            <div className="base-order-item__available__content">
                                <span
                                    className="base-order-item__available__content__amount"
                                    onClick={() => {
                                        this.mapAmountClickToAmountInput(
                                            available
                                                ? Decimal.format(
                                                    available,
                                                    totalPrecision
                                                )
                                                : "",
                                            currentMarketAskPrecision
                                        );
                                    }}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                >
                                    {available
                                        ? Decimal.format(
                                            available,
                                            totalPrecision
                                        )
                                        : ""}
                                </span>
                                <span className="base-order-item__available__content__currency">
                                    {available
                                        ? (type === "buy"
                                            ? from
                                            : to
                                        ).toUpperCase()
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="base-order-item class-slider"
                        style={{
                            position: "relative",
                        }}
                    >
                        <input
                            className="base-order_item_amount_slider"
                            type="range"
                            min={0}
                            step={Math.pow(
                                10,
                                -(currentMarketAskPrecision)
                            ).toFixed(currentMarketAskPrecision)}
                            max={
                                (orderType === "Market" ? (priceMarket && priceMarket > 0
                                    ? type === "buy"
                                        ? available / priceMarket
                                        : available
                                    : 0) : (price && price > 0
                                        ? type === "buy"
                                            ? available / price
                                            : available
                                        : 0))
                            }
                            value={amount || 0}
                            onInput={(e) => {
                                this.setState({
                                    amount: Number(e.target.value).toFixed(
                                        currentMarketAskPrecision
                                    ),
                                });
                            }}
                        />
                        <div
                            className="range-value"
                            style={{
                                left: `calc(${newValue < 10 && newValue !== 0
                                    ? 10
                                    : newValue > 90
                                        ? 100 -
                                        ((currentMarketAskPrecision) / 2 +
                                            (currentMarketAskPrecision) +
                                            1)
                                        : newValue
                                    }%)`,
                            }}
                        >
                            <span>{`${newValue ? newValue : "0"}%`}</span>
                        </div>
                    </div>
                    <div className="base-order-item">
                        <div className="base-order-item__total d-flex align-items-center">
                            <label className="base-order-item__total__label mb-0">
                                {handleSetValue(
                                    totalText.toUpperCase(),
                                    "Total"
                                )}
                            </label>
                            <div className="base-order-item__total__content d-flex align-items-center">
                                {orderType === "Limit" ? (
                                    <span className="base-order-item__total__content__amount">
                                        {Decimal.format(total, totalPrecision)}
                                    </span>
                                ) : (
                                    <span className="base-order-item__total__content__amount">
                                        ≈{Decimal.format(total, totalPrecision)}
                                    </span>
                                )}
                                <span className="base-order-item__total__content__currency">
                                    {from.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="base-order-item">
                        <Button
                            label={total < minTotalAmount ? `Min Amount ${minTotalAmount} ${from}` : (submitButtonText || type)}
                            noMargin={true}
                            onClick={this.handleSubmit}
                            disabled={total < minTotalAmount}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userLoggedIn: selectUserLoggedIn(state),
});

const OrderFormDesktop = injectIntl(
    withRouter(connect(mapStateToProps)(OrderFormDesktopComponent))
);
export { OrderFormDesktop };
