import { Button } from "@components/components";
import * as React from "react";
import { CustomInput } from "../";
import { EMAIL_REGEX } from "../../helpers";
import ReCAPTCHA from "react-google-recaptcha";
import { captchaType, siteKey } from "../../api";
import { Link } from "react-router-dom";

class SignInComponent extends React.Component {
    constructor() {
        super(...arguments);
        (this.state = {
            passwordType: "password",
        }),
            (this.togglePassword = () => {
                this.setState({
                    passwordType:
                        this.state.passwordType === "input"
                            ? "password"
                            : "input",
                });
            }),
            (this.handleChangeEmail = (value) => {
                this.props.changeEmail(value);
            });

        this.handleChangePassword = (value) => {
            this.props.changePassword(value);
        };

        this.handleFieldFocus = (field) => {
            this.props.handleChangeFocusField(field);
        };

        this.handleSubmitForm = () => {
            this.props.refreshError();
            this.props.onSignIn();
        };

        this.isValidForm = () => {
            const { email, password } = this.props;
            const isEmailValid = email.match(EMAIL_REGEX);
            return email && isEmailValid;
        };

        this.handleValidateForm = () => {
            this.props.isFormValid();
        };

        this.handleClick = (label, e) => {
            if (e) {
                e.preventDefault();
            }

            if (!this.isValidForm()) {
                this.handleValidateForm();
            } else {
                this.handleSubmitForm();
            }
        };
    }

    render() {
        const {
            emailError,
            signUpExists,
            signUpText,
            forgetPasswordText,
            exchangeSignInText,
            email,
            label2fa,
            hasConfirmed,
            recaptchaConfirmed,
            emailPlaceholder,
            password,
            otpCode,
            passwordPlaceholder,
            isLoading,
            onForgotPassword,
            labelSignIn,
            emailLabel,
            passwordLabel,
            require2fa,
            welcomeLabel,
        } = this.props;
        const exchangeName = window.env.name || "Exchange";
        const captcha =
            captchaType() === "recaptcha" ? (
                <div className="base-sign-up-form__recaptcha">
                    <ReCAPTCHA
                        sitekey={siteKey()}
                        onChange={this.props.recaptchaOnChange}
                    />
                </div>
            ) : null;
        return (
            <div className="page-ath-form">
                <form>
                    <div
                        className="input-item"
                        style={{
                            display: require2fa ? "none" : "block",
                        }}
                    >
                        <CustomInput
                            type="email"
                            label={emailLabel || "Email"}
                            placeholder={emailPlaceholder}
                            defaultLabel="Email"
                            handleChangeInput={this.handleChangeEmail}
                            inputValue={email}
                            handleFocusInput={() =>
                                this.handleFieldFocus("email")
                            }
                            classNameLabel="base-sign-in-form__label"
                            classNameInput="base-sign-in-form__input"
                            autoFocus={true}
                        />
                        {emailError && (
                            <div className="base-sign-up-form__error">
                                {emailError}
                            </div>
                        )}
                    </div>
                    <div
                        className="input-item"
                        style={{
                            display: require2fa ? "none" : "block",
                        }}
                    >
                        <CustomInput
                            type={this.state.passwordType}
                            label={passwordLabel || "Password"}
                            placeholder={passwordPlaceholder}
                            defaultLabel="Password"
                            handleChangeInput={this.handleChangePassword}
                            inputValue={password}
                            handleFocusInput={() =>
                                this.handleFieldFocus("password")
                            }
                            classNameLabel="base-sign-in-form__label"
                            classNameInput="base-sign-in-form__input"
                            autoFocus={false}
                        />
                        {
                            <i
                                onClick={this.togglePassword}
                                className={`fa fa-lg fa-eye${
                                    this.state.passwordType === "password"
                                        ? "-slash"
                                        : ""
                                }`}
                                style={{
                                    position: "absolute",
                                    top: "22px",
                                    right: "15px",
                                    color: "#777",
                                }}
                                aria-hidden="true"
                            ></i>
                        }
                    </div>
                    <div
                        className="forgot-password-link d-flex justify-content-end"
                        style={{
                            color: "var(--accent)",
                        }}
                    >
                        <Link to={onForgotPassword(email)}>
                            {forgetPasswordText}
                        </Link>
                    </div>
                    {require2fa && (
                        <div className="input-item">
                            <CustomInput
                                type="number"
                                label={
                                    label2fa ||
                                    "6-digit Google Authenticator Code"
                                }
                                placeholder={
                                    label2fa ||
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
                                classNameInput="base-email-form__input"
                                autoFocus={false}
                            />
                        </div>
                    )}
                    <div className="">
                        <div className="input-item text-left">{captcha}</div>
                    </div>
                    <Button
                        label={
                            isLoading
                                ? "Loading..."
                                : labelSignIn
                                ? labelSignIn
                                : "Sign in"
                        }
                        type="submit"
                        className="base-sign-in-form__button"
                        onClick={this.handleClick}
                    />
                </form>
                <div className="gaps-1x" />
                <div className="text-center">
                    <span
                        style={{
                            fontWeight: "500",
                        }}
                    >
                        {signUpExists}
                    </span>
                    <Link className="form-note" to={this.props.onSignUp()}>
                        {signUpText}
                    </Link>
                </div>
            </div>
        );
    }
}

export { SignInComponent };
