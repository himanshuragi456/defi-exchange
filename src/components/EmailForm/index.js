import { Button } from "@components/components";
import cr from "classnames";
import { CustomInput } from "../";
import * as React from "react";
import { EMAIL_REGEX } from "../../helpers";
import { Link } from "react-router-dom";

class EmailForm extends React.Component {
    constructor() {
        super(...arguments);

        this.handleCancel = () => {
            return "/signin";
            this.props.handleReturnBack();
        };

        this.handleClick = (label, e) => {
            if (e) {
                e.preventDefault();
            }

            if (!this.isValidForm()) {
                this.props.validateForm();
            } else {
                this.handleSubmitForm();
            }
        };
    }

    render() {
        const {
            description,
            back,
            signUp,
            title,
            buttonLabel,
            isLoading,
            emailLabel,
            message,
            email,
            emailFocused,
            emailError,
        } = this.props;
        const emailGroupClass = cr("base-email-form__group", {
            "base-email-form__group--focused": emailFocused,
        });
        return (
            <div className="page-ath-form">
                <h2 className="page-ath-heading">
                    {title ? title : "Reset password "}
                    <span className="text-white">{description}</span>
                </h2>
                <form>
                    <div className="input-item">
                        <CustomInput
                            type="email"
                            label={emailLabel || "Email"}
                            placeholder={emailLabel || "Email"}
                            defaultLabel="Email"
                            handleChangeInput={this.props.handleInputEmail}
                            inputValue={email}
                            handleFocusInput={this.props.handleFieldFocus}
                            classNameLabel="base-email-form__label"
                            classNameInput="base-email-form__input"
                            autoFocus={true}
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="input-item text-left" />
                        <div>
                            <div className="gaps-2x" />
                        </div>
                    </div>
                    <div class="flex-md-row flex-column d-flex justify-content-between align-items-center">
                        <div>
                            <Button
                                label={
                                    isLoading
                                        ? "Loading..."
                                        : buttonLabel
                                        ? buttonLabel
                                        : "Send Reset Link"
                                }
                                type="submit"
                                className={
                                    email
                                        ? "btn btn-primary btn-block"
                                        : "btn btn-primary btn-block base-email-form__button--disabled"
                                }
                                disabled={
                                    isLoading || !email.match(EMAIL_REGEX)
                                }
                                onClick={this.handleClick}
                            />
                        </div>
                        <div>
                            <Link
                                to={this.handleCancel()}
                                style={{
                                    color: "var(--auth-page-text-color)",
                                }}
                            >
                                {back}
                            </Link>
                        </div>
                    </div>
                </form>
                <div className="gaps-2x" />
                <div className="gaps-2x" />
                <Link to="/signup" className="form-note">
                    {signUp}
                </Link>
            </div>
        );
    }

    handleSubmitForm() {
        this.props.OnSubmit();
    }

    isValidForm() {
        const { email } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);
        return email && isEmailValid;
    }
}

export { EmailForm };
