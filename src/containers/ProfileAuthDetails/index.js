import { Button, Dropdown } from "@components/components";
import cr from "classnames";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CustomInput } from "../../components";
import { PASSWORD_REGEX } from "../../helpers";
import {
    alertPush,
    selectUserInfo,
    updateUserCurrencyFetch,
} from "../../modules";
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
} from "../../modules/user/profile";
import { ProfileTwoFactorAuth } from "../ProfileTwoFactorAuth";
import { selectCurrencies } from "../../modules/user/beneficiaries/selectors";
import { currenciesFetch } from "../../modules/user/beneficiaries";

class ProfileAuthDetailsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.renderModalHeader = () => {
            return (
                <div className="parent-exchange-modal-submit-header">
                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader" />
                </div>
            );
        };

        this.renderModalBody = () => {
            return (
                <div className="parent-exchange-modal-submit-body">
                    <h2>
                        <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalBody" />
                    </h2>
                </div>
            );
        };

        this.renderModalFooter = () => {
            return (
                <div className="parent-exchange-modal-submit-footer">
                    <Button
                        className="parent-exchange-modal-submit-footer__button-inverse"
                        label="OK"
                        onClick={this.closeModal}
                    />
                </div>
            );
        };

        this.renderChangeModalHeader = () => (
            <div className="base-email-form__options-group">
                <div className="base-email-form__option">
                    <div className="base-email-form__option-inner">
                        <FormattedMessage id="page.body.profile.header.account.content.password.change" />
                        <div
                            className="base-email-form__cros-icon"
                            onClick={this.handleCancel}
                        >
                            <img src={require("./close.svg")} />
                        </div>
                    </div>
                </div>
            </div>
        );

        this.handleChangePassword = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.props.changePassword({
                old_password: this.state.oldPassword,
                new_password: this.state.newPassword,
                confirm_password: this.state.confirmationPassword,
            });
        };

        this.closeModal = () => {
            this.setState({
                showModal: false,
            });
        };

        this.showChangeModal = () => {
            this.setState({
                showChangeModal: true,
            });
        };

        this.handleNavigateTo2fa = (enable2fa) => {
            if (enable2fa) {
                this.props.history.push("/security/2fa", {
                    enable2fa,
                });
            } else {
                this.setState({
                    showModal: !this.state.showModal,
                });
            }
        };

        this.handleOldPassword = (value) => {
            this.setState({
                oldPassword: value,
            });
        };

        this.handleConfPassword = (value) => {
            this.setState({
                confirmationPassword: value,
            });
        };

        this.handleNewPassword = (value) => {
            this.setState({
                newPassword: value,
            });
        };

        this.handleCancel = () => {
            this.setState({
                showChangeModal: false,
                oldPassword: "",
                newPassword: "",
                confirmationPassword: "",
            });
        };

        this.handleFieldFocus = (field) => {
            return () => {
                switch (field) {
                    case "oldPassword":
                        this.setState({
                            oldPasswordFocus: !this.state.oldPasswordFocus,
                        });
                        break;

                    case "newPassword":
                        this.setState({
                            newPasswordFocus: !this.state.newPasswordFocus,
                        });
                        break;

                    case "confirmationPassword":
                        this.setState({
                            confirmPasswordFocus:
                                !this.state.confirmPasswordFocus,
                        });
                        break;

                    default:
                        break;
                }
            };
        };

        this.handleChangePayableCurrency = (currency_id) => {
            if (currency_id === this.props.user.payable_currency) {
                alertPush({
                    message: ["error.currency_already_assigned"],
                    type: "success",
                });
            }

            this.props.updateUserCurrencyFetch({
                currency_id: currency_id,
            });
        };

        this.state = {
            showChangeModal: false,
            showModal: false,
            oldPassword: "",
            newPassword: "",
            confirmationPassword: "",
            oldPasswordFocus: false,
            newPasswordFocus: false,
            confirmPasswordFocus: false,
        };
    }

    componentWillReceiveProps(next) {
        // if (next.user.payable_currency && this.state.currentPayableCurrency !== next.user.payable_currency) {
        //     this.setState({currentPayableCurrency: next.user.payable_currency});
        // }
        if (next.passwordChangeSuccess) {
            this.setState({
                showChangeModal: false,
                oldPassword: "",
                newPassword: "",
                confirmationPassword: "",
                confirmPasswordFocus: false,
            });
        }
    }

    componentDidMount() {
        this.props.fetchCurrencies();
    }

    render() {
        const { user, currencies, payableCurrencyPlaceholder } = this.props;
        const currencyList = currencies
            .filter((currency) => currency.is_payable)
            .map((currency) => currency.id.toUpperCase());
        const renderDropdown = user.payable_currency ? (
            <Dropdown
                list={currencyList}
                onSelect={(e) =>
                    this.handleChangePayableCurrency(
                        currencyList[e].toLowerCase()
                    )
                }
                placeholder={user.payable_currency.toUpperCase()}
            />
        ) : (
            <Dropdown
                list={currencyList}
                onSelect={(e) =>
                    this.handleChangePayableCurrency(
                        currencyList[e].toLowerCase()
                    )
                }
                placeholder={payableCurrencyPlaceholder}
            />
        );
        const {
            oldPasswordFocus,
            newPasswordFocus,
            confirmationPassword,
            oldPassword,
            newPassword,
            confirmPasswordFocus,
            showConfirmationModal,
        } = this.state;
        const oldPasswordClass = cr("base-email-form__group", {
            "base-email-form__group--focused": oldPasswordFocus,
        });
        const newPasswordClass = cr("base-email-form__group", {
            "base-email-form__group--focused": newPasswordFocus,
        });
        const confirmPasswordClass = cr("base-email-form__group", {
            "base-email-form__group--focused": confirmPasswordFocus,
        });
        const changeModalBody = (
            <div className="base-email-form__form-content">
                <div className={oldPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.old",
                        })}
                        placeholder={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.old",
                        })}
                        defaultLabel="Old password"
                        handleChangeInput={this.handleOldPassword}
                        inputValue={oldPassword}
                        handleFocusInput={this.handleFieldFocus("oldPassword")}
                        classNameLabel="base-email-form__label"
                        classNameInput="base-email-form__input"
                        autoFocus={true}
                    />
                </div>
                <div className={newPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.new",
                        })}
                        placeholder={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.new",
                        })}
                        defaultLabel="New password"
                        handleChangeInput={this.handleNewPassword}
                        inputValue={newPassword}
                        handleFocusInput={this.handleFieldFocus("newPassword")}
                        classNameLabel="base-email-form__label"
                        classNameInput="base-email-form__input"
                        autoFocus={false}
                    />
                </div>
                <div className={confirmPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.conf",
                        })}
                        placeholder={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.conf",
                        })}
                        defaultLabel="Password confirmation"
                        handleChangeInput={this.handleConfPassword}
                        inputValue={confirmationPassword}
                        handleFocusInput={this.handleFieldFocus(
                            "confirmationPassword"
                        )}
                        classNameLabel="base-email-form__label"
                        classNameInput="base-email-form__input"
                        autoFocus={false}
                    />
                </div>
                <div className="base-email-form__button-wrapper">
                    <input
                        type="submit"
                        value={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.button.change",
                        })}
                        className={
                            this.isValidForm()
                                ? "base-email-form__button"
                                : "base-email-form__button base-email-form__button--disabled"
                        }
                        disabled={!this.isValidForm()}
                    />
                </div>
            </div>
        );
        const modal = this.state.showChangeModal ? (
            <div className="base-modal">
                <form
                    className="base-email-form background-white-modal"
                    onSubmit={this.handleChangePassword}
                >
                    <div className="parent-change-password-screen">
                        {this.renderChangeModalHeader()}
                        {changeModalBody}
                    </div>
                </form>
            </div>
        ) : null;
        return (
            <React.Fragment>
                <div>
                    <div className="content-area card">
                        <div className="card-innr">
                            <div className="card-head">
                                <h4 className="card-title">
                                    {this.props.intl.formatMessage({
                                        id: "page.profile.profileDetailsTitle",
                                    })}
                                </h4>
                            </div>
                            <div className="tab-content" id="profile-details">
                                <div
                                    className="tab-pane fade active show"
                                    id="personal-data"
                                >
                                    <form action="#">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-item input-with-label">
                                                    <label
                                                        htmlFor="email-address"
                                                        className="input-item-label"
                                                    >
                                                        {this.props.intl.formatMessage(
                                                            {
                                                                id: "page.emailAddress",
                                                            }
                                                        )}
                                                    </label>
                                                    <CustomInput
                                                        type="email"
                                                        inputValue={user.email}
                                                        classNameLabel="base-sign-in-form__label"
                                                        classNameInput="form-control"
                                                        disabled={true}
                                                        style={{
                                                            color: "grey",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-item input-with-label">
                                                    <label
                                                        htmlFor="uid"
                                                        className="input-item-label"
                                                    >
                                                        {this.props.intl.formatMessage(
                                                            {
                                                                id: "page.uid",
                                                            }
                                                        )}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        id="uid"
                                                        name="uid"
                                                        value={user.uid}
                                                        disabled={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="gaps-1x" />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProfileTwoFactorAuth
                        is2faEnabled={user.otp}
                        navigateTo2fa={this.handleNavigateTo2fa}
                        title={this.props.intl.formatMessage({
                            id: "page.profile.2faTitle",
                        })}
                    />
                </div>
            </React.Fragment>
        );
    }

    isValidForm() {
        const { confirmationPassword, oldPassword, newPassword } = this.state;
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;
        return oldPassword && isNewPasswordValid && isConfirmPasswordValid;
    }
}

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps = (dispatch) => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(
            changePasswordFetch({
                old_password,
                new_password,
                confirm_password,
            })
        ),
    updateUserCurrencyFetch: ({ currency_id }) =>
        dispatch(
            updateUserCurrencyFetch({
                currency_id,
            })
        ),
    fetchCurrencies: () => dispatch(currenciesFetch()),
});

const ProfileAuthDetailsConnected = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent)
);
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected);
export { ProfileAuthDetails };
