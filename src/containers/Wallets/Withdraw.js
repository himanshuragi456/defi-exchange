import { Button, Decimal, Dropdown, Input } from "@components/components";
import classnames from "classnames";
import * as React from "react";
import { CustomInput, SummaryField } from "../../components";
import { Checkbox } from "../../component/atoms/Checkbox/Checkbox";
import { Link } from "react-router-dom";

class Withdraw extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            address: "",
            amount: "",
            otpCode: "",
            withdrawAddressFocused: false,
            withdrawAmountFocused: false,
            withdrawCodeFocused: false,
            total: 0,
            beneficiary_id: 0,
            beneficiary_details: null,
            showDropDown: true,
            useBeneficiary: true,
        };

        this.renderFee = () => {
            const { fee, fixed, currency } = this.props;
            return (
                <span>
                    <Decimal fixed={fixed}>{fee.toString()}</Decimal>{" "}
                    {currency.toUpperCase()}
                </span>
            );
        };

        this.renderBalance = () => {
            const { balance, currency, fixed } = this.props;
            return (
                <span
                    onClick={this.mapBalanceToAmount}
                    style={{
                        cursor: "pointer",
                    }}
                >
                    <Decimal fixed={fixed}>{balance.toString()}</Decimal>{" "}
                    {currency.toUpperCase()}
                </span>
            );
        };

        this.renderTotal = () => {
            const total = this.state.total;
            const { fixed, currency, walletBalance } = this.props;
            const color = total > walletBalance ? "red" : "";
            return total ? (
                <span
                    style={{
                        color: color,
                    }}
                >
                    <Decimal
                        fixed={fixed}
                        style={{
                            color: "red",
                        }}
                    >
                        {total.toString()}
                    </Decimal>{" "}
                    {currency.toUpperCase()}
                </span>
            ) : (
                <span
                    style={{
                        color: color,
                    }}
                >
                    0 {currency.toUpperCase()}
                </span>
            );
        };

        this.renderOtpCodeInput = () => {
            const { otpCode, withdrawCodeFocused } = this.state;
            const { withdraw2faLabel } = this.props;
            const withdrawCodeClass = classnames("base-withdraw__group__code", {
                "base-withdraw__group__code--focused": withdrawCodeFocused,
            });
            return (
                <React.Fragment>
                    <div
                        className={withdrawCodeClass}
                        style={
                            {
                                // background: "white",
                            }
                        }
                    >
                        <CustomInput
                            type="number"
                            label={withdraw2faLabel || "2FA code"}
                            placeholder={withdraw2faLabel || "2FA code"}
                            defaultLabel="2FA code"
                            handleChangeInput={this.handleChangeInputOtpCode}
                            inputValue={otpCode}
                            handleFocusInput={() =>
                                this.handleFieldFocus("code")
                            }
                            classNameLabel="base-withdraw__label d-none"
                            classNameInput="form-control"
                            autoFocus={false}
                        />
                    </div>
                    <div className="base-withdraw__divider base-withdraw__divider-two" />
                </React.Fragment>
            );
        }; // this.handleClick = () => this.props.onClick(parseFloat(this.state.amount), this.state.total, this.state.beneficiary_id, this.state.beneficiary_details, this.state.otpCode);

        this.handleClick = () => {
            const {
                useBeneficiary,
                address,
                otpCode,
                amount,
                beneficiary_id,
                total,
                beneficiary_details,
            } = this.state;
            if (this.props.type === "coin" && !useBeneficiary)
                return this.props.onClick({
                    amount: amount ? amount : 0,
                    rid: address ? address : "",
                    otpCode: otpCode ? otpCode : "",
                    total: total ? total : 0,
                    useBeneficiary: useBeneficiary,
                });
            this.props.onClick({
                amount: amount ? amount : 0,
                beneficiary_id: beneficiary_id ? beneficiary_id : 0,
                otpCode: otpCode ? otpCode : "",
                total: total ? total : 0,
                beneficiary_details: beneficiary_details || null,
                useBeneficiary: useBeneficiary,
            });
        };

        this.mapBalanceToAmount = () => {
            this.setState({
                amount: this.props.walletBalance,
            });
            this.handleChangeInputAmount(this.props.walletBalance);
            this.renderTotal();
        };

        this.handleFieldFocus = (field) => {
            switch (field) {
                case "amount":
                    this.setState((prev) => ({
                        withdrawAmountFocused: !prev.withdrawAmountFocused,
                    }));
                    break;

                case "address":
                    this.setState((prev) => ({
                        withdrawAddressFocused: !prev.withdrawAddressFocused,
                    }));
                    break;

                case "code":
                    this.setState((prev) => ({
                        withdrawCodeFocused: !prev.withdrawCodeFocused,
                    }));
                    break;

                default:
                    break;
            }
        };

        this.handleChangeInputAmount = (text) => {
            const { fixed } = this.props;
            const value =
                text !== "" ? Number(parseFloat(text).toFixed(fixed)) : "";
            const total = value !== "" ? value - this.props.fee : 0;

            if (total < 0) {
                this.setTotal(0);
            } else {
                this.setTotal(total);
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

        this.handleChangeInputAddress = (v) => {
            //TODO: Do validation if the v is empty or not
            // if(this.props.type === 'coin')  return this.setState({ address: v });
            if (!this.state.useBeneficiary)
                return this.setState({
                    address: v,
                });
            this.setState({
                beneficiary_id: this.props.beneficiaries[v].id || 0,
                beneficiary_details: this.props.beneficiaries[v],
            });
        };

        this.handleChangeAddressType = () => {
            this.setState({
                showDropDown: !this.state.showDropDown,
                useBeneficiary: !this.state.useBeneficiary,
            });
            this.setState({
                address: "",
                beneficiary_id: false,
            });
        };

        this.handleChangeInputOtpCode = (otpCode) => {
            this.setState({
                otpCode,
            });
        };

        this.getBeneficiaryData = () => {
            if (this.props.beneficiaries.length <= 0) return [];
            return this.props.beneficiaries.map((v) => v.name);
        };

        this.handleAddBeneficiary = () => {
            const { currency } = this.props;
            this.props.createBeneficiaryFromWallets({
                create: true,
                currency: currency,
            });
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.currency !== nextProps.currency ||
            nextProps.withdrawDone
        ) {
            this.setState({
                address: "",
                beneficiary_id: 0,
                beneficiary_details: null,
                amount: "",
                otpCode: "",
                total: 0,
            });
        }
    }

    render() {
        const {
            address,
            beneficiary_id,
            amount,
            total,
            withdrawAddressFocused,
            withdrawAmountFocused,
            otpCode,
        } = this.state;
        const {
            borderItem,
            className,
            twoFactorAuthRequired,
            type,
            withdrawBeneficiaryAdd,
            withdrawAddressLabelPlaceholder,
            withdrawBeneficiaryPlaceholder,
            withdrawAddressLabel,
            withdrawAmountLabel,
            withdrawBalanceLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
            withdrawUseBeneficiaryIdToggleLabel,
        } = this.props;
        const cx = classnames("base-withdraw", className);
        const lastDividerClassName = classnames("base-withdraw__divider", {
            "base-withdraw__divider-one": twoFactorAuthRequired,
            "base-withdraw__divider-two": !twoFactorAuthRequired,
        });
        const withdrawAddressClass = classnames(
            "base-withdraw__group__address",
            {
                "base-withdraw__group__address--focused":
                    withdrawAddressFocused,
            }
        );
        const withdrawAmountClass = classnames("base-withdraw__group__amount", {
            "base-withdraw__group__amount--focused": withdrawAmountFocused,
        });
        const dropDown = (
            <div className={withdrawAddressClass}>
                <Dropdown
                    className=""
                    list={this.getBeneficiaryData()}
                    onSelect={(v) => this.handleChangeInputAddress(v)}
                    placeholder={withdrawBeneficiaryPlaceholder}
                />
                {this.state.showDropDown ? (
                    <div className={withdrawAddressClass}>
                        <div
                            className="withdraw-add-new-beneficiary"
                            onClick={() => this.handleAddBeneficiary()}
                        >
                            <Link to="/profile">{withdrawBeneficiaryAdd}</Link>
                        </div>
                    </div>
                ) : this.props.type === "fiat" ? (
                    <div className="withdraw-add-new-beneficiary">
                        <Link to="/profile">{withdrawBeneficiaryAdd}</Link>
                    </div>
                ) : null}
            </div>
        );
        let renderAddress =
            type === "coin" ? (
                <div className={withdrawAddressClass}>
                    <CustomInput
                        type="email"
                        label={withdrawAddressLabel || "Withdrawal Address"}
                        placeholder={withdrawAddressLabelPlaceholder}
                        defaultLabel={withdrawAddressLabel}
                        handleChangeInput={this.handleChangeInputAddress}
                        inputValue={address}
                        handleFocusInput={() =>
                            this.handleFieldFocus("address")
                        }
                        classNameLabel="base-withdraw__label d-none"
                        classNameInput="form-control"
                        autoFocus={false}
                    />
                    <Checkbox
                        className="base-wallet-form-toggle"
                        checked={false}
                        onChange={() => this.handleChangeAddressType()}
                        label={withdrawUseBeneficiaryIdToggleLabel}
                    />
                </div>
            ) : (
                dropDown
            );
        {
            this.state.showDropDown ? (renderAddress = dropDown) : null;
        }
        return (
            <div className={cx}>
                <div className="base-withdraw-column">
                    {renderAddress}
                    <div className="base-withdraw__divider base-withdraw__divider-one" />
                    <div className={`${withdrawAmountClass}`}>
                        <label className="base-withdraw__label d-none">
                            {Number(amount) !== 0 &&
                                amount &&
                                (withdrawAmountLabel || "Withdrawal Amount")}
                        </label>
                        <Input
                            type="number"
                            value={amount}
                            placeholder={withdrawAmountLabel || "Amount"}
                            className="form-control"
                            onFocus={() => this.handleFieldFocus("amount")}
                            onBlur={() => this.handleFieldFocus("amount")}
                            onChangeValue={this.handleChangeInputAmount}
                        />
                    </div>
                    <div className={lastDividerClassName} />
                    {twoFactorAuthRequired && this.renderOtpCodeInput()}
                </div>
                <div className="">
                    <div>
                        <SummaryField
                            className="base-withdraw__summary-field"
                            message={
                                withdrawFeeLabel ? withdrawFeeLabel : "Fee"
                            }
                            content={this.renderFee()}
                            borderItem={borderItem}
                        />
                        <SummaryField
                            className="base-withdraw__summary-field"
                            message={
                                withdrawBalanceLabel
                                    ? withdrawBalanceLabel
                                    : "Fallback text"
                            }
                            content={this.renderBalance()}
                            borderItem={borderItem}
                        />
                        <SummaryField
                            className="base-withdraw__summary-field"
                            message={
                                withdrawTotalLabel
                                    ? withdrawTotalLabel
                                    : "Total Withdraw Amount"
                            }
                            content={this.renderTotal()}
                            borderItem={borderItem}
                        />
                    </div>
                    <div className="mt-2">
                        <Button
                            className="btn btn-primary no-margin-left"
                            label={
                                withdrawButtonLabel
                                    ? withdrawButtonLabel
                                    : "WITHDRAW"
                            }
                            onClick={this.handleClick}
                            disabled={
                                Number(total) <= 0 ||
                                !(
                                    Boolean(beneficiary_id) || Boolean(address)
                                ) ||
                                (twoFactorAuthRequired &&  otpCode.length < 6)
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export { Withdraw };
