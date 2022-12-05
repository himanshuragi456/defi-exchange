import { Button } from "@components/components";
import cr from "classnames";
import { CustomInput } from "../";
import * as React from "react";

class TwoFactorAuthComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.handleCancel = () => {
            this.props.handleClose2fa();
        };

        this.handleSubmit = () => {
            this.props.onSubmit();
        };

        this.handleEnterPress = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.handleSubmit();
            }
        };
    }

    render() {
        const {
            errorMessage,
            isLoading,
            title,
            label,
            buttonLabel,
            message,
            error,
            otpCode,
            codeFocused,
        } = this.props;
        const errors = errorMessage || error;
        const buttonWrapperClass = cr("base-email-form__button-wrapper", {
            "base-email-form__button-wrapper--empty": !errors,
        });
        const emailGroupClass = cr("base-email-form__group", {
            "base-email-form__group--focused": codeFocused,
        });
        return (
            <div className="parent-2fa___form">
                <form>
                    <div className="base-email-form">
                        <div className="base-email-form__options-group">
                            <div className="base-email-form__option">
                                <div className="base-email-form__option-inner">
                                    {title || "2FA verification"}
                                    <div
                                        className="base-email-form__cros-icon"
                                        onClick={this.handleCancel}
                                    >
                                        <img
                                            src={require("../EmailForm/close.svg")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="base-email-form__form-content">
                            <div className="base-email-form__header">
                                {message}
                            </div>
                            <div className={emailGroupClass}>
                                <CustomInput
                                    type="number"
                                    label={
                                        label ||
                                        "6-digit Google Authenticator Code"
                                    }
                                    placeholder={
                                        label ||
                                        "6-digit Google Authenticator Code"
                                    }
                                    defaultLabel="6-digit Google Authenticator Code"
                                    handleChangeInput={
                                        this.props.handleOtpCodeChange
                                    }
                                    inputValue={otpCode}
                                    handleFocusInput={
                                        this.props.handleChangeFocusField
                                    }
                                    classNameLabel="base-email-form__label"
                                    classNameInput="base-email-form__input"
                                    onKeyPress={this.handleEnterPress}
                                    autoFocus={true}
                                />
                                {errorMessage && (
                                    <div className="base-email-form__error">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                            <div className={buttonWrapperClass}>
                                <Button
                                    label={
                                        isLoading
                                            ? "Loading..."
                                            : buttonLabel
                                            ? buttonLabel
                                            : "Sign in"
                                    }
                                    className={
                                        otpCode
                                            ? "base-email-form__button"
                                            : "base-email-form__button base-email-form__button--disabled"
                                    }
                                    disabled={
                                        isLoading || !otpCode.match(/.{6}/g)
                                    }
                                    onClick={this.handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export const TwoFactorAuth = TwoFactorAuthComponent;
