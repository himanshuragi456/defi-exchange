/* tslint:disable:jsx-no-lambda*/
import cr from "classnames";
import * as React from "react";
import { Button, Input, Loader } from "../../atoms";
import {
    EMAIL_REGEX,
    ERROR_EMPTY_PASSWORD,
    ERROR_INVALID_EMAIL,
} from "../../constants";

class SignInForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleInput = (value, type) => {
            switch (type) {
                case "email":
                    this.setState({
                        email: value,
                    });
                    break;

                case "password":
                    this.setState({
                        password: value,
                    });
                    break;

                default:
                    break;
            }
        };

        this.handleClick = (label, e) => {
            if (e) {
                e.preventDefault();
            }

            if (!this.isValidForm()) {
                this.validateForm();
            } else {
                this.handleSubmitForm();
            }
        };

        this.state = {
            email: "",
            emailError: "",
            password: "",
            passwordError: "",
        };
    }

    render() {
        const { email, emailError, password, passwordError } = this.state;
        const { errorMessage, isLoading, onSignUp, onForgotPassword, image } =
            this.props;
        const buttonWrapperClass = cr("base-sign-in-form__button-wrapper", {
            "base-sign-in-form__button-wrapper--empty": !errorMessage,
        });
        return (
            <form>
                <div className="base-sign-in-form">
                    {image ? (
                        <h1 className="base-sign-in-form__title">
                            <img
                                className="base-sign-in-form__image"
                                src={image}
                                alt="logo"
                            />
                            Sign-in
                        </h1>
                    ) : (
                        <h1
                            className="base-sign-in-form__title"
                            style={{
                                marginTop: 119,
                            }}
                        >
                            Sign-in
                        </h1>
                    )}
                    <div className="base-sign-in-form__group">
                        <label className="base-sign-in-form__label">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={email}
                            className="base-sign-in-form__input"
                            onChangeValue={(value) =>
                                this.handleInput(value, "email")
                            }
                        />
                        {emailError && (
                            <div className="base-sign-in-form__error">
                                {emailError}
                            </div>
                        )}
                    </div>
                    <div className="base-sign-in-form__group">
                        <label className="base-sign-in-form__label">
                            Password
                        </label>
                        <Input
                            type="password"
                            value={password}
                            className="base-sign-in-form__input"
                            onChangeValue={(value) =>
                                this.handleInput(value, "password")
                            }
                        />
                        <div
                            className="base-sign-in-form__forgot"
                            onClick={() => onForgotPassword(email)}
                        >
                            Forgot?
                        </div>
                        {passwordError && (
                            <div className="base-sign-in-form__error">
                                {passwordError}
                            </div>
                        )}
                    </div>
                    <div className={buttonWrapperClass}>
                        <div className="base-sign-in-form__error-message">
                            {errorMessage || null}
                        </div>
                        <div className="base-sign-in-form__loader">
                            {isLoading ? <Loader /> : null}
                        </div>
                        <Button
                            label={isLoading ? "Loading..." : "Sign in"}
                            type="submit"
                            className="base-sign-in-form__button"
                            disabled={isLoading}
                            onClick={this.handleClick}
                        />
                    </div>
                    <div className="base-sign-in-form__footer">
                        <p className="base-sign-in-form__footer-create">
                            Create an account?
                        </p>
                        <a
                            className="base-sign-in-form__footer-signup"
                            onClick={onSignUp}
                        >
                            Sign up
                        </a>
                    </div>
                </div>
            </form>
        );
    }

    handleSubmitForm() {
        const { email, password } = this.state;
        this.setState(
            {
                emailError: "",
                passwordError: "",
            },
            () => {
                this.props.onSignIn({
                    email,
                    password,
                });
            }
        );
    }

    isValidForm() {
        const { email, password } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        return email && isEmailValid && password;
    }

    validateForm() {
        const { email, password } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            this.setState({
                emailError: ERROR_INVALID_EMAIL,
                passwordError: "",
            });
            return;
        }

        if (!password) {
            this.setState({
                emailError: "",
                passwordError: ERROR_EMPTY_PASSWORD,
            });
        }
    }
}

export { SignInForm };
