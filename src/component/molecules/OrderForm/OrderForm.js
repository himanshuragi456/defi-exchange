import classnames from "classnames";
import * as React from "react";
import { Dropdown, OrderInput } from "../";
import { Button, CryptoIcon } from "../../atoms";

class OrderForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleAmountChange = (text) => {
            this.checkValue(text, "amount");
        };

        this.changeState = (type, value) => {
            if (type === "price") {
                this.setState({
                    price: value,
                });
                return;
            }

            this.setState({
                amount: value,
            });
        };

        this.checkValue = (text, type) => {
            const convertedText = text.replace(",", ".").replace("-", "");
            const isDotFirst = convertedText[0] === ".";

            if (isDotFirst) {
                this.changeState(type, "0.");
                return;
            }

            const condition = new RegExp(
                "^(?:[\\d-]*\\.?[\\d-]*|[\\d-]*\\.[\\d-])$"
            );

            if (convertedText.match(condition)) {
                this.changeState(type, convertedText);
            }
        };

        this.handlePriceChange = (text) => {
            this.checkValue(text, "price");
        };

        this.handleOrderTypeChange = (index) => {
            const { orderTypes } = this.props;
            this.setState({
                orderType: orderTypes[index],
            });
        };

        this.handleSubmit = () => {
            const { type, priceMarket } = this.props;
            const { amount, orderType, price } = this.state;
            const order = {
                type,
                price: orderType === "Market" ? priceMarket : price,
                orderType,
                amount,
            };
            this.props.onSubmit(order);
            this.setState({
                price: orderType === "Market" ? String(priceMarket) : "",
                amount: "",
            });
        };

        this.state = {
            amount: "",
            orderType: "Limit",
            price: "",
        };
    }

    render() {
        const {
            disabled,
            type,
            fee,
            orderTypes,
            className,
            priceMarket,
            from,
            to,
            available,
        } = this.props;
        const { amount, price, orderType } = this.state;
        const safeAmount = Number(amount) || 0;
        const safePrice = Number(price) || 0;
        const total =
            orderType === "Market"
                ? safeAmount * priceMarket
                : safeAmount * safePrice;
        const cx = classnames("base-order-form", className);
        const currencyCodeFrom = `${from.toUpperCase()}-alt`;
        return (
            <div className={cx}>
                <div className="base-order-item">
                    <label className="base-order-item__label">Order</label>
                    <div className="base-order-item__content">
                        <Dropdown
                            list={orderTypes}
                            onSelect={this.handleOrderTypeChange}
                        />
                    </div>
                </div>
                {orderType === "Limit" ? (
                    <div className="base-order-item">
                        <label className="base-order-item__label">Price</label>
                        <div className="base-order-item__content">
                            <OrderInput
                                currency={from}
                                value={price || ""}
                                handleChangeValue={this.handlePriceChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="base-order-item">
                        <label className="base-order-item__label">Price</label>
                        <div className="base-order-item__content">
                            <div className="base-order-input">
                                <div className="base-order-input__crypto-icon">
                                    <CryptoIcon code={currencyCodeFrom}>
                                        {from.toUpperCase()}
                                    </CryptoIcon>
                                </div>
                                <div className="base-order-input__input">
                                    <span className="base-order-input__price">
                                        {priceMarket}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="base-order-item">
                    <label className="base-order-item__label">Amount</label>
                    <div className="base-order-item__content">
                        <OrderInput
                            currency={to}
                            value={amount || ""}
                            handleChangeValue={this.handleAmountChange}
                        />
                    </div>
                </div>
                <div className="base-order-item base-order-item__total">
                    <label className="base-order-item__label">Total</label>
                    <div className="base-order-item__content">
                        {this.convertTotal(total)}{" "}
                        <span className="base-order-item__available-currency">
                            {from.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="base-order-item base-order-item__total">
                    <label className="base-order-item__label">Available</label>
                    <div className="base-order-item__content">
                        {available ? (
                            <div className="base-order-item__available">
                                <span className="base-order-item__available">
                                    {this.convertToAvailable(available, total)}{" "}
                                    <span className="base-order-item__available-currency">
                                        {from.toUpperCase()}
                                    </span>
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="base-order-item base-order-item__total">
                    <label className="base-order-item__label">
                        Estimated fee
                    </label>
                    <div className="base-order-item__content">
                        {fee ? (
                            <div className="base-order-item__available">
                                {type === "buy" ? (
                                    <span className="base-order-item__available">
                                        {fee}{" "}
                                        <span className="base-order-item__available-currency">
                                            {to.toUpperCase()}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="base-order-item__available">
                                        {fee}{" "}
                                        <span className="base-order-item__available-currency">
                                            {from.toUpperCase()}
                                        </span>
                                    </span>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
                <Button
                    disabled={disabled}
                    label={type}
                    noMargin={true}
                    onClick={this.handleSubmit}
                />
            </div>
        );
    }

    convertTotal(total, fractionDigit = 6) {
        return +Number(total).toFixed(fractionDigit);
    }

    convertToAvailable(balance, value) {
        if (balance && !value) {
            return this.convertTotal(balance);
        }

        const delta = balance - value;
        return delta >= 0 ? this.convertTotal(delta) : 0;
    }
}

export { OrderForm };
