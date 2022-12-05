import { Button } from "@components/components";
import cr from "classnames";
import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CustomInput } from "../../components";
import {
    ERROR_INVALID_PASSWORD,
    PASSWORD_REGEX,
    setDocumentTitle,
} from "../../helpers";
import {
    changeForgotPasswordFetch,
    changeLanguage,
    changePasswordFetch,
    selectChangeForgotPasswordSuccess,
} from "../../modules";

class ChangeForgottenPasswordComponent extends React.Component {
    constructor(props) {
        super(props);

        this.disableButton = () => {
            const { password, confirmPassword, old_password } = this.state;
            const isPasswordValid = password.match(PASSWORD_REGEX);
            const isConfirmPasswordValid = password === confirmPassword;
            const isOldPasswordValid = !this.props.isComponent
                ? true
                : !!old_password;
            return (
                !isPasswordValid ||
                !isConfirmPasswordValid ||
                !isOldPasswordValid
            );
        };

        this.handleFieldFocus = (field) => {
            return () => {
                switch (field) {
                    case "password":
                        this.setState({
                            passwordFocused: !this.state.passwordFocused,
                        });
                        break;

                    case "confirmPassword":
                        this.setState({
                            confirmPasswordFocused:
                                !this.state.confirmPasswordFocused,
                        });
                        break;

                    case "old_password":
                        this.setState({
                            old_passwordFocused:
                                !this.state.old_passwordFocused,
                        });
                        break;

                    default:
                        break;
                }
            };
        };

        this.handleSendNewPassword = () => {
            const { password, confirmPassword, old_password, confirmToken } =
                this.state;
            const isPasswordValid = password.match(PASSWORD_REGEX);
            const isConfirmPasswordValid = password === confirmPassword;
            this.setState(
                {
                    error: !(isPasswordValid && isConfirmPasswordValid),
                },
                () => {
                    if (!this.state.error) {
                        if (!this.props.isComponent) {
                            this.props.changeForgotPasswordFetch({
                                reset_password_token: confirmToken,
                                password: password,
                                confirm_password: confirmPassword,
                            });
                        } else {
                            this.props.changePasswordFetch({
                                old_password,
                                new_password: password,
                                confirm_password: confirmPassword,
                            });
                        }
                    }
                }
            );
        };

        this.handleChange = (key, value) => {
            this.setState({
                [key]: value,
            });
        };

        this.state = {
            error: false,
            confirmToken: "",
            password: "",
            passwordFocused: false,
            confirmPassword: "",
            old_password: "",
            confirmPasswordFocused: false,
            old_passwordPasswordFocused: false,
        };
    }

    componentDidMount() {
        setDocumentTitle(
            this.props.intl.formatMessage({
                id: "page.body.profile.header.account.content.password.change",
            })
        );
        const { history } = this.props;
        const token = new URLSearchParams(history.location.search).get(
            "reset_token"
        );
        const lang = new URLSearchParams(history.location.search).get("lang");

        if (token) {
            this.setState({
                confirmToken: token,
            });
        }

        if (lang) {
            this.props.changeLanguage(lang.toLowerCase());
        }
    }

    componentWillReceiveProps(next) {
        if (next.changeForgotPassword && !this.props.changeForgotPassword) {
            this.props.history.push("/signin");
        }
    }

    render() {
        const {
            error,
            password,
            old_password,
            passwordFocused,
            confirmPassword,
            confirmPasswordFocused,
        } = this.state;
        const passwordFocusedClass = cr("base-email-form__group", {
            "base-email-form__group--focused": passwordFocused,
        });
        const confirmPasswordFocusedClass = cr("base-email-form__group", {
            "base-email-form__group--focused": confirmPasswordFocused,
        });

        const updateOldPassword = (e) => this.handleChange("old_password", e);

        const updatePassword = (e) => this.handleChange("password", e);

        const updateConfirmPassword = (e) =>
            this.handleChange("confirmPassword", e);

        return (
            <>
                {!this.props.isComponent ? (
                    <div
                        className="page-ath-wrap pt-3 pb-5"
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            // "linear-gradient(270deg, rgb(13, 16, 22), rgb(34, 46, 91), rgb(13, 16, 22))",
                            background: "var(--auth-content-bg)",
                        }}
                    >
                        <div className="page-ath-content">
                            <div className="page-ath-form">
                                <h2 className="page-ath-heading">
                                    Reset password{" "}
                                </h2>
                                <form>
                                    <div className="input-item">
                                        <CustomInput
                                            type="password"
                                            label={this.props.intl.formatMessage(
                                                {
                                                    id: "page.header.signIn.resetPassword.newPassword",
                                                }
                                            )}
                                            placeholder={this.props.intl.formatMessage(
                                                {
                                                    id: "page.header.signIn.resetPassword.newPassword",
                                                }
                                            )}
                                            defaultLabel="New password"
                                            handleChangeInput={updatePassword}
                                            inputValue={password}
                                            handleFocusInput={this.handleFieldFocus(
                                                "password"
                                            )}
                                            classNameLabel="base-email-form__label"
                                            classNameInput="base-email-form__input"
                                            autoFocus={true}
                                        />
                                        <div className="base-sign-up-form__info">
                                            {this.props.intl.formatMessage({
                                                id: ERROR_INVALID_PASSWORD,
                                            })}
                                        </div>
                                    </div>
                                    <div className="input-item">
                                        <CustomInput
                                            type="password"
                                            label={this.props.intl.formatMessage(
                                                {
                                                    id: "page.header.signIn.resetPassword.repeatPassword",
                                                }
                                            )}
                                            placeholder={this.props.intl.formatMessage(
                                                {
                                                    id: "page.header.signIn.resetPassword.repeatPassword",
                                                }
                                            )}
                                            defaultLabel="Repeat password"
                                            handleChangeInput={
                                                updateConfirmPassword
                                            }
                                            inputValue={confirmPassword}
                                            handleFocusInput={this.handleFieldFocus(
                                                "confirmPassword"
                                            )}
                                            classNameLabel="base-email-form__label"
                                            classNameInput="base-email-form__input"
                                            autoFocus={false}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="input-item text-left" />
                                        <div>
                                            <div className="gaps-1x" />
                                        </div>
                                    </div>
                                    <div className="flex-md-row flex-column d-flex justify-content-between align-items-center">
                                        <div>
                                            <Button
                                                label={this.props.intl.formatMessage(
                                                    {
                                                        id: "page.header.signIn.resetPassword.button",
                                                    }
                                                )}
                                                className={
                                                    !this.disableButton()
                                                        ? "base-email-form__button"
                                                        : "base-email-form__button base-email-form__button--disabled"
                                                }
                                                disabled={this.disableButton()}
                                                onClick={
                                                    this.handleSendNewPassword
                                                }
                                            />
                                        </div>
                                    </div>
                                </form>
                                <div className="gaps-1x" />
                                <div className="form-note">
                                    <sapn
                                        style={{
                                            fontWeight: "500",
                                            color: "#fff",
                                        }}
                                    >
                                        Don’t have an account?
                                    </sapn>
                                    <a href="/signup">
                                        {" "}
                                        <strong>Sign up here</strong>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="kyc-info card">
                            <div className="card-innr">
                                <h6 className="card-title card-title-sm">
                                    <span>Reset Password</span>
                                </h6>
                                <form>
                                    <div className="d-flex flex-wrap flex-sm-nowrap">
                                        <div
                                            className="input-item"
                                            style={{
                                                width: "49%",
                                                marginRight: "15px",
                                            }}
                                        >
                                            <CustomInput
                                                type="password"
                                                label={this.props.intl.formatMessage(
                                                    {
                                                        id: "page.header.signIn.resetPassword.oldPassword",
                                                    }
                                                )}
                                                placeholder={this.props.intl.formatMessage(
                                                    {
                                                        id: "page.header.signIn.resetPassword.oldPassword",
                                                    }
                                                )}
                                                defaultLabel="Old Password"
                                                handleChangeInput={
                                                    updateOldPassword
                                                }
                                                inputValue={old_password}
                                                handleFocusInput={this.handleFieldFocus(
                                                    "password"
                                                )}
                                                classNameLabel="base-email-form__label"
                                                classNameInput="base-email-form__input text-white"
                                            />
                                        </div>
                                        <div
                                            className="input-item"
                                            style={{
                                                width: "49%",
                                                marginRight: "15px",
                                            }}
                                        >
                                            <CustomInput
                                                type="password"
                                                label={this.props.intl.formatMessage(
                                                    {
                                                        id: "page.header.signIn.resetPassword.newPassword",
                                                    }
                                                )}
                                                placeholder={this.props.intl.formatMessage(
                                                    {
                                                        id: "page.header.signIn.resetPassword.newPassword",
                                                    }
                                                )}
                                                defaultLabel="Repeat password"
                                                handleChangeInput={
                                                    updatePassword
                                                }
                                                inputValue={password}
                                                handleFocusInput={this.handleFieldFocus(
                                                    "password"
                                                )}
                                                classNameLabel="base-email-form__label"
                                                classNameInput="base-email-form__input text-white"
                                            />
                                        </div>
                                        <div
                                            className="input-item"
                                            style={{
                                                width: "49%",
                                            }}
                                        >
                                            <CustomInput
                                                type="password"
                                                label={this.props.intl.formatMessage(
                                                    {
                                                        id: "page.header.signIn.resetPassword.repeatPassword",
                                                    }
                                                )}
                                                placeholder={this.props.intl.formatMessage(
                                                    {
                                                        id: "page.header.signIn.resetPassword.repeatPassword",
                                                    }
                                                )}
                                                defaultLabel="New password"
                                                handleChangeInput={
                                                    updateConfirmPassword
                                                }
                                                inputValue={confirmPassword}
                                                handleFocusInput={this.handleFieldFocus(
                                                    "confirmPassword"
                                                )}
                                                classNameLabel="base-email-form__label"
                                                classNameInput="base-email-form__input text-white"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: "15.61%",
                                        }}
                                    >
                                        <Button
                                            label={this.props.intl.formatMessage(
                                                {
                                                    id: "page.header.signIn.resetPassword.button",
                                                }
                                            )}
                                            className={`btn btn-primary ${
                                                this.disableButton() &&
                                                "btn-disable mx-0"
                                            }`}
                                            disabled={this.disableButton()}
                                            onClick={this.handleSendNewPassword}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    changeForgotPassword: selectChangeForgotPasswordSuccess(state),
});

const mapDispatchProps = (dispatch) => ({
    changeForgotPasswordFetch: (credentials) =>
        dispatch(changeForgotPasswordFetch(credentials)),
    changePasswordFetch: (credentials) =>
        dispatch(changePasswordFetch(credentials)),
    changeLanguage: (lang) => dispatch(changeLanguage(lang)),
});

const ChangeForgottenPasswordScreen = withRouter(
    injectIntl(
        connect(
            mapStateToProps,
            mapDispatchProps
        )(ChangeForgottenPasswordComponent)
    )
);
export { ChangeForgottenPasswordScreen };
