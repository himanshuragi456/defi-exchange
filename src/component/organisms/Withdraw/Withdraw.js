import classnames from "classnames";
import * as React from "react";
import { Button, Input, SummaryField } from "../../atoms";

/**
 * Component with for for withdraw.
 */

class Withdraw extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            address: "",
            amount: 0,
            otpCode: "",
            total: 0,
        };

        this.renderOtpCodeInput = () => {
            const { otpCode } = this.state;
            return (
                <React.Fragment>
                    <form>
                        <fieldset className="base-withdraw__input">
                            <legend>6-digit GAuthenticator Code</legend>
                            <Input
                                type="text"
                                className="base-input-block__input"
                                placeholder="XXXXXX"
                                value={otpCode}
                                onChangeValue={this.handleChangeInputOtpCode}
                            />
                        </fieldset>
                    </form>
                    <div className="base-withdraw__divider base-withdraw__divider-two" />
                </React.Fragment>
            );
        };

        this.handleClick = () =>
            this.props.onClick(
                this.state.total,
                this.state.address,
                this.state.otpCode
            );

        this.handleChangeInputAmount = (text) => {
            const value = parseFloat(text);

            if (value < 0) {
                this.setTotal(0);
            } else {
                this.setTotal(value - value * this.props.fee);
            }

            this.setState({
                amount: value,
            });
        };

        this.setTotal = (value) => {
            this.setState({
                total: value,
            });
        };

        this.handleChangeInputAddress = (text) => {
            this.setState({
                address: text,
            });
        };

        this.handleChangeInputOtpCode = (otpCode) => {
            this.setState({
                otpCode,
            });
        };
    }

    render() {
        const { address, amount, total } = this.state;
        const { borderItem, className, currency, fee, twoFactorAuthRequired } =
            this.props;
        const cx = classnames("base-withdraw", className);
        const lastDividerClassName = classnames("base-withdraw__divider", {
            "base-withdraw__divider-one": twoFactorAuthRequired,
            "base-withdraw__divider-two": !twoFactorAuthRequired,
        });
        const contentFee = `${String(fee)} ${currency.toUpperCase()}`;
        const contentTotal = total
            ? `${this.formatTotal(total, currency)} ${currency.toUpperCase()}`
            : `0 ${currency.toUpperCase()}`;
        const formattedCurrency = currency.toUpperCase();
        return (
            <div className={cx}>
                <div className="base-withdraw-column">
                    <form>
                        <fieldset className="base-withdraw__input">
                            <legend>
                                {formattedCurrency} "Withdrawal Address"
                            </legend>
                            <Input
                                className="base-input-block__input"
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChangeValue={this.handleChangeInputAddress}
                            />
                        </fieldset>
                    </form>
                    <div className="base-withdraw__divider base-withdraw__divider-one" />
                    <form>
                        <fieldset className="base-withdraw__input">
                            <legend>Withdrawal Amount</legend>
                            <Input
                                className="base-input-block__input"
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChangeValue={this.handleChangeInputAmount}
                            />
                        </fieldset>
                    </form>
                    <div className={lastDividerClassName} />
                    {twoFactorAuthRequired && this.renderOtpCodeInput()}
                </div>
                <div className="base-withdraw-column">
                    <div>
                        <SummaryField
                            className="base-withdraw__summary-field "
                            message="Fee"
                            content={contentFee}
                            borderItem={borderItem}
                        />
                        <SummaryField
                            className="base-withdraw__summary-field"
                            message="Total Withdraw Amount"
                            content={contentTotal}
                            borderItem={borderItem}
                        />
                    </div>
                    <div className="base-withdraw__deep">
                        <Button
                            className="base-withdraw__button"
                            label="WITHDRAW"
                            onClick={this.handleClick}
                        />
                    </div>
                </div>
            </div>
        );
    }

    formatTotal(value, currency) {
        const currencyAmountPrecision = 8;
        const bchAmountPrecision = 4;
        return currency.toLowerCase() === "bch"
            ? Number(value).toFixed(bchAmountPrecision)
            : Number(value).toFixed(currencyAmountPrecision);
    }
}

export { Withdraw };
