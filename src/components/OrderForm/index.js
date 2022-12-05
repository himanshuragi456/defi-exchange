import {
    Button,
    CryptoIcon,
    Dropdown,
    OrderInput,
    PercentageButton,
} from "@components/components";
import classnames from "classnames";
import * as React from "react";
import { getAmount, getTotalPrice } from "../../helpers/getTotalPrice";
import { Decimal } from "../../component/molecules/Decimal/Decimal";
/*==========This was used for Mobile Version specifically. Now its not used anywhere.===========*/

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

class OrderForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleOrderTypeChange = (index) => {
            const { getExchangeOrderType } = this.props;
            const { priceMarket, currentMarketBidPrecision } = this.state;
            this.setState({
                orderType: getExchangeOrderType(index),
            });
            getExchangeOrderType(index) === "Market"
                ? this.setState({
                      price: handleSetValue(
                          Decimal.format(
                              priceMarket,
                              currentMarketBidPrecision
                          ),
                          "0"
                      ),
                  })
                : null;
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
            if(this.state.orderType === "Market") {
                precision = this.state.currentMarketOrderPrecision
            }

            console.log('precision', precision, this.state.orderType)

            if (formatter)
                return this.setState({
                    amount: Decimal.format(
                        convertedValue,
                        precision
                    ),
                });

            if (precision === 0 ) {
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
                                  this.state.currentMarketOrderPrecision
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
                            this.state.orderType === "Market" ? this.state.currentMarketOrderPrecision : this.state.currentMarketAskPrecision
                        )
                        : "",
                });
            } else {
            }
        };

        this.handleSubmit = () => {
            const { type } = this.props;
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
            if (this.state.price) {
                this.setState({
                    amount: (available / this.state.price).toFixed(precision),
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
        if (
            prevProps.currentMarketOrderPrecision !==
            this.props.currentMarketOrderPrecision
        ) {
            this.setState({
                amount: "",
            });
        }
    }

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
        return (
            <div className={classnames("base-order-form", className)}>
                <div className="base-order-item">
                    {orderTypeText ? (
                        <div className="base-order-item__dropdown__label">
                            {orderTypeText}
                        </div>
                    ) : null}
                    <Dropdown
                        list={orderTypes}
                        onSelect={this.handleOrderTypeChange}
                    />
                </div>
                {orderType === "Limit" ? (
                    <div className="base-order-item">
                        <OrderInput
                            currency={from}
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
                    <div className="base-order-item">
                        <div className="base-order-input">
                            <fieldset className="base-order-input__fieldset">
                                <legend className="base-order-input__fieldset__label">
                                    {handleSetValue(priceText, "")}
                                </legend>
                                <div className="base-order-input__fieldset__input">
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
                                <CryptoIcon code={`${from.toUpperCase()}-alt`}>
                                    {from.toUpperCase()}
                                </CryptoIcon>
                            </div>
                        </div>
                    </div>
                )}
                <div className="base-order-item">
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
                <div className="base-order-item">
                    <div className="base-order-item__percentage-buttons">
                        <PercentageButton
                            label={`${[0.25, 0.5, 0.75, 1][0] * 100}%`}
                            onClick={() =>
                                this.handleChangeAmountByButton(
                                    [0.25, 0.5, 0.75, 1][0],
                                    type
                                )
                            }
                        />
                        <PercentageButton
                            label={`${[0.25, 0.5, 0.75, 1][1] * 100}%`}
                            onClick={() =>
                                this.handleChangeAmountByButton(
                                    [0.25, 0.5, 0.75, 1][1],
                                    type
                                )
                            }
                        />
                        <PercentageButton
                            label={`${[0.25, 0.5, 0.75, 1][2] * 100}%`}
                            onClick={() =>
                                this.handleChangeAmountByButton(
                                    [0.25, 0.5, 0.75, 1][2],
                                    type
                                )
                            }
                        />
                        <PercentageButton
                            label={`${[0.25, 0.5, 0.75, 1][3] * 100}%`}
                            onClick={() =>
                                this.handleChangeAmountByButton(
                                    [0.25, 0.5, 0.75, 1][3],
                                    type
                                )
                            }
                        />
                    </div>
                </div>
                <div className="base-order-item">
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
                                        orderType === "Market" ? currentMarketOrderPrecision : currentMarketAskPrecision
                                    );
                                }}
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                {available
                                    ? Decimal.format(available, totalPrecision)
                                    : ""}
                            </span>
                            <span className="base-order-item__available__content__currency">
                                {available
                                    ? (type === "buy" ? from : to).toUpperCase()
                                    : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="base-order-item">
                    <input
                        className="base-order_item_amount_slider"
                        type="range"
                        min={0}
                        step={Math.pow(10, -totalPrecision).toFixed(
                            totalPrecision
                        )}
                        max={price ? available / price : available}
                        defaultValue={amount || 0}
                        onInput={(e) => {
                            this.setState({
                                amount: e.target.value,
                            });
                        }}
                    />
                </div>
                <div className="base-order-item">
                    <div className="base-order-item__total">
                        <label className="base-order-item__total__label">
                            {handleSetValue(totalText, "Total")}
                        </label>
                        <div className="base-order-item__total__content">
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
                        disabled={isDisabled(
                            Number(amount) || 0,
                            getTotalPrice(amount, proposals) / Number(amount) ||
                                priceMarket,
                            price,
                            this.props,
                            this.state
                        )}
                        label={submitButtonText || type}
                        noMargin={true}
                        onClick={this.handleSubmit}
                    />
                </div>
            </div>
        );
    }
}

export { OrderForm };
