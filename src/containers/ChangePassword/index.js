import { Button, Input } from "@components/components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

class ChangePasswordComponent extends React.Component {
    constructor(props) {
        super(props);

        this.renderPasswordView = () => {
            return (
                <React.Fragment>
                    <Button
                        className="parent-profile-page__btn-secondary"
                        onClick={this.toggleShowForm}
                        label={this.props.intl.formatMessage({
                            id: "page.body.profile.header.account.content.password.button.change",
                        })}
                    />
                </React.Fragment>
            );
        };

        this.renderForm = () => {
            const { oldPassword, newPassword } = this.state;
            return (
                <div>
                    <div className="parent-change-password-form">
                        <div className="parent-change-password-form__group">
                            <label className="parent-change-password-form__label">
                                <FormattedMessage id="page.body.profile.header.account.content.password.old" />
                            </label>
                            <Input
                                type="password"
                                value={oldPassword}
                                onChangeValue={this.handleOldPasswordChange}
                            />
                        </div>
                        <div className="parent-change-password-form__group">
                            <label className="parent-change-password-form__label">
                                <FormattedMessage id="page.body.profile.header.account.content.password.new" />
                            </label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChangeValue={this.handleNewPasswordChange}
                            />
                        </div>
                        <Button
                            className="parent-profile-page__btn-secondary"
                            label={this.props.intl.formatMessage({
                                id: "page.body.profile.header.account.content.password.button.save",
                            })}
                            onClick={this.handleSubmit}
                        />
                        <Button
                            className="parent-profile-page__btn-secondary"
                            label={this.props.intl.formatMessage({
                                id: "page.body.profile.header.account.content.password.button.cancel",
                            })}
                            onClick={this.handleCancel}
                        />
                    </div>
                </div>
            );
        };

        this.toggleShowForm = () => {
            this.setState((state) => ({
                showForm: !state.showForm,
            }));
        };

        this.handleOldPasswordChange = (value) => {
            this.setState({
                oldPassword: value,
            });
        };

        this.handleNewPasswordChange = (value) => {
            this.setState({
                newPassword: value,
            });
        };

        this.handleSubmit = () => {
            this.props.onSubmit(
                this.state.oldPassword,
                this.state.newPassword,
                this.state.newPassword
            );
        };

        this.handleCancel = () => {
            this.setState({
                showForm: false,
                oldPassword: "",
                newPassword: "",
            });
            this.props.onClearError();
        };

        this.state = {
            showForm: false,
            oldPassword: "",
            newPassword: "",
        };
    }

    componentWillReceiveProps(next) {
        if (!this.props.success && next.success) {
            this.handleCancel();
        }
    }

    render() {
        const { showForm } = this.state;
        return (
            <React.Fragment>
                <label className="parent-profile-page__label">
                    <div>
                        <FormattedMessage id="page.body.profile.header.account.content.password" />
                    </div>
                    <span className="parent-profile-page__label-value">
                        ***********
                    </span>
                </label>
                {showForm ? this.renderForm() : this.renderPasswordView()}
            </React.Fragment>
        );
    }
}

export const ChangePassword = injectIntl(ChangePasswordComponent);
