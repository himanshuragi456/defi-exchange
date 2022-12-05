import { Button, Checkbox, Table } from "@components/components";
import cr from "classnames";
import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { CopyableTextField, CustomInput } from "../../components";
import { localeFullDate } from "../../helpers/localeFullDate";
import {
    alertPush,
    apiKeyCreateFetch,
    apiKeyDeleteFetch,
    apiKeys2FAModal,
    apiKeysFetch,
    apiKeyUpdateFetch,
    selectUserInfo,
} from "../../modules";
import {
    selectApiKeys,
    selectApiKeysDataLoaded,
    selectApiKeysModal,
} from "../../modules/user/apiKeys/selectors";

class ProfileApiKeysComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            otpCode: "",
            codeFocused: false,
        };

        this.t = (key) => {
            return this.props.intl.formatMessage({
                id: key,
            });
        };

        this.copy = (id) => {
            const copyText = document.querySelector(`#${id}`);

            if (copyText) {
                copyText.select();
                document.execCommand("copy");
                window.getSelection().removeAllRanges();
            }
        };

        this.getTableHeaders = () => {
            return [
                this.t("page.body.profile.apiKeys.table.header.kid"),
                this.t("page.body.profile.apiKeys.table.header.algorithm"),
                this.t("page.body.profile.apiKeys.table.header.state"),
                "",
                this.t("page.body.profile.apiKeys.table.header.created"),
                this.t("page.body.profile.apiKeys.table.header.updated"),
                "",
            ];
        };

        this.renderModalHeader = () => {
            const headerText =
                this.props.modal.action === "createSuccess"
                    ? this.t("page.body.profile.apiKeys.modal.created_header")
                    : this.t("page.body.profile.apiKeys.modal.header");
            return (
                <div className="base-email-form__options-group">
                    <div className="base-email-form__option">
                        <div className="base-email-form__option-inner background-linear">
                            {headerText}
                            <span
                                className="parent-profile-page__close parent-profile-page__pull-right"
                                onClick={this.handleHide2FAModal}
                            />
                        </div>
                    </div>
                </div>
            );
        };

        this.renderModalBody = () => {
            const { otpCode, codeFocused } = this.state;
            const emailGroupClass = cr("base-email-form__group", {
                "base-email-form__group--focused": codeFocused,
            });
            let body;
            let button;

            switch (this.props.modal.action) {
                case "getKeys":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.apiKeys.modal.btn.show"
                            )}
                            onClick={this.handleGetKeys}
                            disabled={!otpCode.match(/.{6}/g)}
                            className={
                                otpCode ? "btn btn-primary" : "btn btn-primary"
                            }
                        />
                    );
                    break;

                case "createKey":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.apiKeys.modal.btn.create"
                            )}
                            onClick={this.handleCreateKey}
                            className={
                                otpCode ? "btn btn-primary" : "btn btn-primary"
                            }
                        />
                    );
                    break;

                case "createSuccess":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.apiKeys.modal.btn.create"
                            )}
                            onClick={this.handleCreateSuccess}
                            className="btn btn-primary"
                        />
                    );
                    body = (
                        <div className="card p-4 mb-0">
                            <div className="parent-copyable-text__section">
                                <fieldset>
                                    <legend>
                                        <span>
                                            {this.t(
                                                "page.body.profile.apiKeys.modal.access_key"
                                            )}
                                        </span>
                                    </legend>
                                    <CopyableTextField
                                        className="parent-copyable-text-field__input"
                                        copyMessage={[
                                            "success.api_keys.copied.access",
                                        ]}
                                        fieldId="access-key-id"
                                        value={this.props.modal.apiKey.kid}
                                        copyButtonText={this.t(
                                            "page.body.profile.content.copyLink"
                                        )}
                                    />
                                </fieldset>
                            </div>
                            <div className="secret-section">
                                <span className="secret-sign">⚠</span>
                                <p className="secret-warning">
                                    <span>
                                        {this.t(
                                            "page.body.profile.apiKeys.modal.secret_key"
                                        )}
                                    </span>
                                    <br />
                                    {this.t(
                                        "page.body.profile.apiKeys.modal.secret_key_info"
                                    )}
                                    <span>
                                        {" "}
                                        {this.t(
                                            "page.body.profile.apiKeys.modal.secret_key_store"
                                        )}
                                    </span>
                                </p>
                            </div>
                            <div className="parent-copyable-text__section">
                                <fieldset
                                    onClick={() =>
                                        this.handleCopy(
                                            "secret-key-id",
                                            "secret"
                                        )
                                    }
                                >
                                    <legend>
                                        <span>
                                            {this.t(
                                                "page.body.profile.apiKeys.modal.secret_key"
                                            )}
                                        </span>
                                    </legend>
                                    <CopyableTextField
                                        className="parent-copyable-text-field__input"
                                        fieldId="secret_key-id"
                                        value={this.props.modal.apiKey.secret}
                                        copyButtonText={this.t(
                                            "page.body.profile.content.copyLink"
                                        )}
                                    />
                                </fieldset>
                            </div>
                            <p className="note-section">
                                <span>
                                    {this.t(
                                        "page.body.profile.apiKeys.modal.note"
                                    )}{" "}
                                </span>
                                <br />
                                {this.t(
                                    "page.body.profile.apiKeys.modal.note_content"
                                )}
                            </p>
                            <div className="button-confirmation">{button}</div>
                        </div>
                    );
                    break;

                case "updateKey":
                    button =
                        this.props.modal.apiKey.state === "active" ? (
                            <Button
                                label={this.t(
                                    "page.body.profile.apiKeys.modal.btn.disabled"
                                )}
                                onClick={this.handleUpdateKey}
                                className={
                                    otpCode
                                        ? "btn btn-primary"
                                        : "btn btn-primary"
                                }
                            />
                        ) : (
                            <Button
                                label={this.t(
                                    "page.body.profile.apiKeys.modal.btn.activate"
                                )}
                                onClick={this.handleUpdateKey}
                                className={
                                    otpCode
                                        ? "btn btn-primary"
                                        : "btn btn-primary"
                                }
                            />
                        );
                    break;

                case "deleteKey":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.apiKeys.modal.btn.delete"
                            )}
                            onClick={this.handleDeleteKey}
                            className={
                                otpCode ? "btn btn-primary" : "btn btn-primary"
                            }
                        />
                    );
                    break;

                default:
                    break;
            }

            body = !body ? (
                <div className="base-email-form__form-content">
                    <div className="base-email-form__header">
                        {this.t("page.body.profile.apiKeys.modal.title")}
                    </div>
                    <div className={emailGroupClass}>
                        <CustomInput
                            type="number"
                            label={this.t(
                                "page.body.profile.apiKeys.modal.label"
                            )}
                            placeholder={this.t(
                                "page.body.profile.apiKeys.modal.placeholder"
                            )}
                            defaultLabel="2FA code"
                            handleChangeInput={this.handleOtpCodeChange}
                            inputValue={otpCode || ""}
                            handleFocusInput={this.handleChangeFocusField}
                            classNameLabel="base-email-form__label"
                            classNameInput="base-email-form__input"
                            autoFocus={true}
                            onKeyPress={this.handleEnterPress}
                        />
                    </div>
                    <div className="base-email-form__button-wrapper">
                        {button}
                    </div>
                </div>
            ) : (
                body
            );
            return <React.Fragment>{body}</React.Fragment>;
        };

        this.handleChangeFocusField = () => {
            this.setState((prev) => ({
                codeFocused: !prev.codeFocused,
            }));
        };

        this.handleHide2FAModal = () => {
            const payload = {
                active: false,
            };
            this.props.toggleApiKeys2FAModal(payload);
        };

        this.handleOtpCodeChange = (value) => {
            this.setState({
                otpCode: value,
            });
        };

        this.renderOnClick = () => {
            switch (this.props.modal.action) {
                case "getKeys":
                    this.handleGetKeys();
                    break;

                case "createKey":
                    this.handleCreateKey();
                    break;

                case "createSuccess":
                    this.handleCreateSuccess();
                    break;

                case "updateKey":
                    this.handleUpdateKey();
                    break;

                case "deleteKey":
                    this.handleDeleteKey();
                    break;

                default:
                    break;
            }
        };

        this.handleEnterPress = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.renderOnClick();
            }
        };

        this.handleGetKeysClick = () => {
            const payload = {
                active: true,
                action: "getKeys",
            };
            this.props.toggleApiKeys2FAModal(payload);
        };

        this.handleGetKeys = () => {
            const payload = {
                totp_code: this.state.otpCode,
            };
            this.props.getApiKeys(payload);
            this.setState({
                otpCode: "",
            });
        };

        this.handleCreateKeyClick = () => {
            const payload = {
                active: true,
                action: "createKey",
            };
            this.props.toggleApiKeys2FAModal(payload);
        };

        this.handleCreateKey = () => {
            const payload = {
                totp_code: this.state.otpCode,
            };
            this.props.createApiKey(payload);
            this.setState({
                otpCode: "",
            });
        };

        this.handleCreateSuccess = () => {
            const payload = {
                active: false,
            };
            this.props.toggleApiKeys2FAModal(payload);
        };

        this.handleToggleStateKeyClick = (apiKey) => {
            const payload = {
                active: true,
                action: "updateKey",
                apiKey,
            };
            this.props.toggleApiKeys2FAModal(payload);
        };

        this.handleUpdateKey = () => {
            const apiKey = {
                ...this.props.modal.apiKey,
            };
            apiKey.state = apiKey.state === "active" ? "disabled" : "active";
            const payload = {
                totp_code: this.state.otpCode,
                apiKey: apiKey,
            };
            this.props.updateApiKey(payload);
            this.setState({
                otpCode: "",
            });
        };

        this.handleCopy = (id, type) => {
            this.copy(id);
            this.props.fetchSuccess({
                message: [`success.api_keys.copied.${type}`],
                type: "success",
            });
        };

        this.handleDeleteKeyClick = (apiKey) => {
            const payload = {
                active: true,
                action: "deleteKey",
                apiKey,
            };
            this.props.toggleApiKeys2FAModal(payload);
        };

        this.handleDeleteKey = () => {
            const payload = {
                kid: this.props.modal.apiKey.kid,
                totp_code: this.state.otpCode,
            };
            this.props.deleteApiKey(payload);
            this.setState({
                otpCode: "",
            });
        };
    }

    componentDidMount() {
        this.handleGetKeys();
    }

    render() {
        const { user, apiKeys } = this.props;
        const dataLoaded = true;
        const modal = this.props.modal.active ? (
            <div className="base-modal">
                <div className="base-email-form background-white-modal">
                    {this.renderModalHeader()}
                    {this.renderModalBody()}
                </div>
            </div>
        ) : null;
        return (
            <div className="card">
                <div className="card-innr">
                    <div
                        className="card-head"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h4 className="card-title d-inline-block">
                            {this.t("page.body.profile.apiKeys.header")}
                        </h4>
                        {user.otp && dataLoaded && (
                            <button
                                className="btn"
                                onClick={this.handleCreateKeyClick}
                            >
                                {this.t(
                                    "page.body.profile.apiKeys.header.create"
                                )}
                            </button>
                        )}
                    </div>
                    {!user.otp && (
                        <p className="parent-profile-page__label parent-profile-page__text-center">
                            {this.t("page.body.profile.apiKeys.noOtp")}
                        </p>
                    )}
                    {user.otp && !dataLoaded && (
                        <div className="parent-profile-page__text-center">
                            <div className="text-center">
                                <span
                                    className="btn btn-primary"
                                    onClick={this.handleGetKeysClick}
                                >
                                    <span>
                                        {this.props.intl.formatMessage({
                                            id: "page.show",
                                        })}
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                    {user.otp && dataLoaded && !apiKeys.length && (
                        <div className="parent-profile-page__label parent-profile-page__text-center">
                            {this.t("page.body.profile.apiKeys.noKeys")}
                        </div>
                    )}
                    {user.otp && dataLoaded && apiKeys.length > 0 && (
                        <Table
                            header={this.getTableHeaders()}
                            data={
                                apiKeys && apiKeys.length
                                    ? this.getTableData(apiKeys)
                                    : [[]]
                            }
                        />
                    )}
                    {modal}
                </div>
            </div>
        );
    }

    getTableData(apiKeysData) {
        return apiKeysData.map((item) => [
            item.kid,
            item.algorithm,
            <div className="parent-profile-page__api-keys__state">
                <span
                    className={
                        item.state === "active"
                            ? "parent-profile-page__api-keys__state__active"
                            : "parent-profile-page__api-keys__state__disabled"
                    }
                >
                    {item.state}
                </span>
            </div>,
            <div className="parent-profile-page__api-keys__state-checkbox">
                <Checkbox
                    checked={item.state === "active"}
                    className="parent-profile-page__switch"
                    onChange={() => this.handleToggleStateKeyClick(item)}
                    label=""
                    slider={true}
                />
            </div>,
            localeFullDate(item.created_at),
            localeFullDate(item.updated_at),
            <span
                className="parent-profile-page__close"
                key={item.kid}
                onClick={() => this.handleDeleteKeyClick(item)}
            />,
        ]);
    }
}

const mapStateToProps = (state) => ({
    apiKeys: selectApiKeys(state),
    dataLoaded: selectApiKeysDataLoaded(state),
    modal: selectApiKeysModal(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
    toggleApiKeys2FAModal: (payload) => dispatch(apiKeys2FAModal(payload)),
    getApiKeys: (payload) => dispatch(apiKeysFetch(payload)),
    createApiKey: (payload) => dispatch(apiKeyCreateFetch(payload)),
    updateApiKey: (payload) => dispatch(apiKeyUpdateFetch(payload)),
    deleteApiKey: (payload) => dispatch(apiKeyDeleteFetch(payload)),
    fetchSuccess: (payload) => dispatch(alertPush(payload)),
});

const connected = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ProfileApiKeysComponent)
);
const ProfileApiKeys = withRouter(connected);
export { ProfileApiKeys };
