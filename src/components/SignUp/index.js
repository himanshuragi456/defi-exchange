import { Button, Checkbox } from "@components/components";
import { CustomInput } from "../";
import * as React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from "../../helpers";
import { Link } from "react-router-dom";
import { TNCUrl } from "../../api";

class SignUpForm extends React.Component {
    constructor() {
        super(...arguments);
        (this.state = {
            passwordType: "password",
            passwordConfirmType: "password",
        }),
            (this.togglePassword = () => {
                this.setState({
                    passwordType:
                        this.state.passwordType === "input"
                            ? "password"
                            : "input",
                });
            }),
            (this.togglePasswordConfirm = () => {
                this.setState({
                    passwordConfirmType:
                        this.state.passwordConfirmType === "input"
                            ? "password"
                            : "input",
                });
            }),
            (this.disableButton = () => {
                const {
                    email,
                    password,
                    confirmPassword,
                    hasConfirmed,
                    recaptchaConfirmed,
                    isLoading,
                    captchaType,
                    username,
                } = this.props;

                if (
                    !hasConfirmed ||
                    isLoading ||
                    !email.match(EMAIL_REGEX) ||
                    !password ||
                    !confirmPassword ||
                    !username
                ) {
                    return true;
                }

                if (captchaType !== "none" && !recaptchaConfirmed) {
                    return true;
                }

                return false;
            });

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
            signInText,
            signInExists,
            exchangeSignUpText,
            email,
            password,
            confirmPassword,
            refId,
            isLoading,
            siteKey,
            captchaType,
            labelSignUp,
            emailLabel,
            passwordLabel,
            confirmPasswordLabel,
            referalCodeLabel,
            termsMessage,
            hasConfirmed,
            usernameError,
            emailError,
            passwordMessage,
            passwordError,
            confirmationError,
            termsNSText,
            username,
            userNameLabel,
            userNameFocussed,
            buttonText,
        } = this.props;
        const captcha =
            hasConfirmed && captchaType !== "none" ? (
                <div className="base-sign-up-form__recaptcha">
                    <ReCAPTCHA
                        sitekey={siteKey}
                        onChange={this.props.recaptchaOnChange}
                    />
                </div>
            ) : null;
        const exchangeName = window.env.name || "Exchange";
        const TNCMessage = termsMessage ? (
            <>
                {termsMessage}
                &nbsp;
                <a href={TNCUrl()}>{termsNSText}</a>
            </>
        ) : (
            <>
                I agree all statements in &nbsp;
                <a href={TNCUrl()}>{termsNSText}</a>
            </>
        );
        return (
            <div className="page-ath-form">
                <h2 className="page-ath-heading">
                    {labelSignUp}
                    <small>{exchangeSignUpText}</small>
                </h2>
                <form action="#">
                    <div className="input-item">
                        <CustomInput
                            type="text"
                            label={userNameLabel || "Username"}
                            placeholder={userNameLabel || "Username"}
                            defaultLabel="Full Name"
                            handleChangeInput={this.props.handleChangeUserName}
                            inputValue={username}
                            handleFocusInput={this.props.handleFocusUserName}
                            classNameLabel="base-sign-up-form__label"
                            classNameInput="base-sign-up-form__input"
                            autoFocus={true}
                        />
                        {true && (
                            <p
                                style={{
                                    color: "var(--color-red)",
                                    margin: "3px 0 0 3px",
                                }}
                            >
                                {usernameError}
                            </p>
                        )}
                    </div>
                    <div className="input-item">
                        <CustomInput
                            type="email"
                            label={emailLabel || "Email"}
                            placeholder={emailLabel || "Email"}
                            defaultLabel="Email"
                            handleChangeInput={this.props.handleChangeEmail}
                            inputValue={email}
                            handleFocusInput={this.props.handleFocusEmail}
                            classNameLabel="base-sign-up-form__label"
                            classNameInput="base-sign-up-form__input"
                            autoFocus={false}
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
                            position: "relative",
                        }}
                    >
                        <CustomInput
                            type={this.state.passwordType}
                            label={passwordLabel || "Password"}
                            placeholder={passwordLabel || "Password"}
                            defaultLabel="Password"
                            handleChangeInput={this.props.handleChangePassword}
                            inputValue={password}
                            handleFocusInput={this.props.handleFocusPassword}
                            classNameLabel="base-sign-up-form__label"
                            classNameInput="base-sign-up-form__input"
                            autoFocus={false}
                        />
                        {passwordError && (
                            <div className="base-sign-up-form__error">
                                {passwordError}
                            </div>
                        )}
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
                    <div className="input-item">
                        <CustomInput
                            type={this.state.passwordConfirmType}
                            label={confirmPasswordLabel || "Confirm Password"}
                            placeholder={
                                confirmPasswordLabel || "Confirm Password"
                            }
                            defaultLabel="Confirm Password"
                            handleChangeInput={
                                this.props.handleChangeConfirmPassword
                            }
                            inputValue={confirmPassword}
                            handleFocusInput={
                                this.props.handleFocusConfirmPassword
                            }
                            classNameLabel="base-sign-up-form__label"
                            classNameInput="base-sign-up-form__input"
                            autoFocus={false}
                        />
                        {confirmationError && (
                            <div className="base-sign-up-form__error">
                                {confirmationError}
                            </div>
                        )}
                        {
                            <i
                                onClick={this.togglePasswordConfirm}
                                className={`fa fa-lg fa-eye${
                                    this.state.passwordConfirmType ===
                                    "password"
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
                    <div className="input-item text-left">
                        <Checkbox
                            checked={hasConfirmed}
                            className="base-sign-up-form__checkbox"
                            onChange={this.props.clickCheckBox}
                            label={TNCMessage}
                        />
                        {captcha}
                    </div>
                    <Button
                        type="submit"
                        className="base-sign-up-form__button"
                        disabled={!hasConfirmed}
                        label={
                            isLoading
                                ? "Loading..."
                                : labelSignUp
                                ? labelSignUp
                                : "Sign up"
                        }
                        onClick={this.handleClick}
                    />
                </form>
                <div className="gaps-1x" />
                <div className="gaps-md-2x" />
                <div className="text-center">
                    <span
                        style={{
                            fontWeight: "500",
                        }}
                    >
                        {signInExists}
                    </span>
                    <Link className="form-note" to={this.props.onSignIn()}>
                        {signInText}
                    </Link>
                </div>
            </div>
        );
    }

    handleSubmitForm() {
        this.props.onSignUp();
    }

    isValidForm() {
        const { username, email, password, confirmPassword } = this.props;
        const isUsernameValid = username.match(USERNAME_REGEX);
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;
        return (
            username &&
            isUsernameValid &&
            email &&
            isEmailValid &&
            password &&
            isPasswordValid &&
            confirmPassword &&
            isConfirmPasswordValid
        );
    }
}

export { SignUpForm };
