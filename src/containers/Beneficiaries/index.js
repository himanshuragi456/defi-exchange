import { Button, Table } from "@components/components";
import { Dropdown } from "../../component/molecules/Dropdown/Dropdown";
import cr from "classnames";
import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { CustomInput } from "../../components";
import {
    alertPush,
    beneficiariesFetch,
    beneficiariesModal,
    beneficiaryCreateFetch,
    beneficiaryDeleteFetch,
    beneficiaryUpdateFetch,
    selectUserInfo,
} from "../../modules";
import {
    selectBeneficiaries,
    selectBeneficiariesDataLoaded,
    selectBeneficiariesModal,
    selectCurrencies,
} from "../../modules/user/beneficiaries/selectors";
import { ClipLoader } from "react-spinners";
import { beneficiaryResendPinFetch } from "../../modules/user/beneficiaries";
import {
    createBeneficiaryFromWallets,
    selectCreateBeneficiary,
    selectCurrencyForBeneficiary,
} from "../../modules/public/generic";

class BeneficiariesComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            code: "",
            activationCode: "",
            codeFocused: false,
            currency: null,
            name: "",
            fullName: "",
            description: "",
            swift: "",
            accountNumber: "",
            beneficiaryData: {},
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

        this.handleChange = (key) => {
            return (e) => {
                    this.setState({
                        [key]: e.target.value,
                    });
            };
        };

        this.getTableHeaders = () => {
            return [
                this.t("page.body.profile.beneficiaries.table.header.currency"),
                this.t("page.body.profile.beneficiaries.table.header.name"),
                this.t(
                    "page.body.profile.beneficiaries.table.header.description"
                ),
                this.t("page.body.profile.beneficiaries.table.header.state"),
                "",
                "",
            ];
        };

        this.renderModalHeader = () => {
            const headerText =
                this.props.modal.action === "createSuccess"
                    ? this.t(
                          "page.body.profile.beneficiaries.modal.created_header"
                      )
                    : this.t("page.body.profile.beneficiaries.modal.header");
            return (
                <div className="base-email-form__options-group">
                    <div className="base-email-form__option">
                        <div className="base-email-form__option-inner pointer">
                            {headerText}
                            <span
                                className="parent-profile-page__close parent-profile-page__pull-right"
                                onClick={this.handleHideModal}
                            />
                        </div>
                    </div>
                </div>
            );
        };

        this.renderModalBody = () => {
            const { otpCode, codeFocused, activationCode } = this.state;
            const emailGroupClass = cr("base-email-form__group", {
                "base-email-form__group--focused": codeFocused,
            });
            let body;
            let button;
            let resentCodeBtn;

            switch (this.props.modal.action) {
                case "getBeneficiaries":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.beneficiaries.modal.btn.close"
                            )}
                            onClick={this.handleGetBeneficiaries}
                            className={
                                otpCode ? "btn btn-primary" : "btn btn-primary"
                            }
                        />
                    );
                    body = (
                        <div className="card p-4 mb-0 rounded-0">
                            <div className="row p-4">
                                {this.props.currencies && (
                                    <div className="col-md-6 p-2">
                                        <label className="input-item-label">
                                            {this.t(
                                                "page.body.profile.beneficiaries.modal.form.selectCurrency"
                                            )}
                                        </label>
                                        <input
                                            className="form-control"
                                            disabled={true}
                                            type="string"
                                            placeholder={this.t(
                                                "page.body.profile.beneficiaries.modal.form.selectCurrency"
                                            )}
                                            value={
                                                this.props.modal.beneficiary.currency.toUpperCase() ||
                                                ""
                                            }
                                        />
                                    </div>
                                )}
                                <div className="col-md-6 p-2">
                                    <label className="input-item-label">
                                        {this.t(
                                            "page.body.profile.beneficiaries.modal.form.name"
                                        )}
                                    </label>
                                    <input
                                        className="form-control"
                                        disabled={true}
                                        type="string"
                                        placeholder={this.t(
                                            "page.body.profile.beneficiaries.modal.form.name"
                                        )}
                                        value={
                                            this.props.modal.beneficiary.name ||
                                            ""
                                        }
                                    />
                                </div>
                                <div className="col-md-6 p-2">
                                    <label className="input-item-label">
                                        {this.t(
                                            "page.body.profile.beneficiaries.modal.form.description"
                                        )}
                                    </label>
                                    <input
                                        className="form-control"
                                        disabled={true}
                                        type="string"
                                        placeholder={this.t(
                                            "page.body.profile.beneficiaries.modal.form.description"
                                        )}
                                        value={
                                            this.props.modal.beneficiary
                                                .description || ""
                                        }
                                    />
                                </div>
                                {this.props.modal.beneficiary.data.address && (
                                    <div className="col-md-6 p-2">
                                        <label className="input-item-label">
                                            {this.t(
                                                "page.body.profile.beneficiaries.modal.form.address"
                                            )}
                                        </label>
                                        <input
                                            className="form-control"
                                            disabled={true}
                                            type="string"
                                            placeholder={this.t(
                                                "page.body.profile.beneficiaries.modal.form.address"
                                            )}
                                            value={
                                                this.props.modal.beneficiary
                                                    .data.address || ""
                                            }
                                        />
                                    </div>
                                )}
                                {this.props.modal.beneficiary.data
                                    .full_name && (
                                    <div className="col-md-6 p-2">
                                        <label className="input-item-label">
                                            {this.t(
                                                "page.body.profile.beneficiaries.modal.form.fullName"
                                            )}
                                        </label>
                                        <input
                                            className="form-control"
                                            disabled={true}
                                            type="string"
                                            placeholder={this.t(
                                                "page.body.profile.beneficiaries.modal.form.fullName"
                                            )}
                                            value={
                                                this.props.modal.beneficiary
                                                    .data.full_name || ""
                                            }
                                        />
                                    </div>
                                )}
                                {this.props.modal.beneficiary.data
                                    .account_number && (
                                    <div className="col-md-6 p-2">
                                        <label className="input-item-label">
                                            {this.t(
                                                "page.body.profile.beneficiaries.modal.form.accountNumber"
                                            )}
                                        </label>
                                        <input
                                            className="form-control"
                                            disabled={true}
                                            type="string"
                                            placeholder={this.t(
                                                "page.body.profile.beneficiaries.modal.form.accountNumber"
                                            )}
                                            value={
                                                this.props.modal.beneficiary
                                                    .data.account_number || ""
                                            }
                                        />
                                    </div>
                                )}
                                {this.props.modal.beneficiary.data.swift && (
                                    <div className="col-md-6 p-2">
                                        <label className="input-item-label">
                                            {this.t(
                                                "page.body.profile.beneficiaries.modal.form.swift"
                                            )}
                                        </label>
                                        <input
                                            className="form-control"
                                            disabled={true}
                                            type="string"
                                            placeholder={this.t(
                                                "page.body.profile.beneficiaries.modal.form.swift"
                                            )}
                                            value={
                                                this.props.modal.beneficiary
                                                    .data.swift || ""
                                            }
                                        />
                                    </div>
                                )}
                                <div className="col-12 px-2">
                                    <div className="button-confirmation">
                                        {button}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;

                case "createBeneficiary":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.beneficiaries.modal.btn.create"
                            )}
                            onClick={this.handleCreateBeneficiary}
                            disabled={!this.canSubmit()}
                            className={
                                this.canSubmit()
                                    ? "btn btn-primary mx-0"
                                    : "btn btn-secondary mx-0"
                            }
                        />
                    );
                    body = (
                        <div className="card rounded-0 p-4 mb-0 create-beneficiary">
                            <div className="row p-4">
                                {this.props.currencies && (
                                    <div className="col-md-6 p-2">
                                        <label className="input-item-label">
                                            {this.t(
                                                "page.body.profile.beneficiaries.modal.form.selectCurrency"
                                            )}
                                        </label>
                                        <Dropdown
                                            className=""
                                            list={this.props.currencies.map(
                                                (v) => v.name
                                            )}
                                            onSelect={(v) => {
                                                this.setState({
                                                    currency:
                                                        this.props.currencies[
                                                            v
                                                        ],
                                                });
                                                this.state.curreency =
                                                    this.props.currencies[v];
                                            }}
                                            placeholder={this.t(
                                                "page.body.profile.beneficiaries.modal.form.selectCurrency"
                                            )}
                                            defaultSelectedValue={
                                                this.state.currency
                                                    ? this.state.currency.name
                                                    : this.t(
                                                          "page.body.profile.beneficiaries.modal.form.selectCurrency"
                                                      )
                                            }
                                        />
                                    </div>
                                )}
                                <div className="col-md-6 p-2">
                                    <label className="input-item-label">
                                        {this.t(
                                            "page.body.profile.beneficiaries.modal.form.name"
                                        )}
                                    </label>
                                    <input
                                        className="form-control"
                                        type="string"
                                        placeholder={this.t(
                                            "page.body.profile.beneficiaries.modal.form.name"
                                        )}
                                        onChange={this.handleChange("name")}
                                    />
                                </div>
                                <div className="col-md-6 p-2">
                                    <label className="input-item-label">
                                        {this.t(
                                            "page.body.profile.beneficiaries.modal.form.description"
                                        )}
                                    </label>
                                    <input
                                        className="form-control"
                                        type="string"
                                        placeholder={this.t(
                                            "page.body.profile.beneficiaries.modal.form.description"
                                        )}
                                        onChange={this.handleChange(
                                            "description"
                                        )}
                                    />
                                </div>
                                {this.state.currency &&
                                    this.state.currency.type === "coin" && (
                                        <div className="col-md-6 p-2">
                                            <label className="input-item-label">
                                                {this.t(
                                                    "page.body.profile.beneficiaries.modal.form.address"
                                                )}
                                            </label>
                                            <input
                                                className="form-control"
                                                type="string"
                                                placeholder={this.t(
                                                    "page.body.profile.beneficiaries.modal.form.address"
                                                )}
                                                onChange={this.handleChange(
                                                    "address"
                                                )}
                                            />
                                        </div>
                                    )}
                                {this.state.currency &&
                                    this.state.currency.type === "fiat" && (
                                        <div className="col-md-6 p-2">
                                            <label className="input-item-label">
                                                {this.t(
                                                    "page.body.profile.beneficiaries.modal.form.fullName"
                                                )}
                                            </label>
                                            <input
                                                className="form-control"
                                                type="string"
                                                placeholder={this.t(
                                                    "page.body.profile.beneficiaries.modal.form.fullName"
                                                )}
                                                onChange={this.handleChange(
                                                    "fullName"
                                                )}
                                            />
                                        </div>
                                    )}
                                {this.state.currency &&
                                    this.state.currency.type === "fiat" && (
                                        <div className="col-md-6 p-2">
                                            <label className="input-item-label">
                                                {this.t(
                                                    "page.body.profile.beneficiaries.modal.form.accountNumber"
                                                )}
                                            </label>
                                            <input
                                                className="form-control"
                                                type="string"
                                                placeholder={this.t(
                                                    "page.body.profile.beneficiaries.modal.form.accountNumber"
                                                )}
                                                onChange={this.handleChange(
                                                    "accountNumber"
                                                )}
                                            />
                                        </div>
                                    )}
                                {this.state.currency &&
                                    this.state.currency.type === "fiat" && (
                                        <div className="col-md-6 p-2">
                                            <label className="input-item-label">
                                                {this.t(
                                                    "page.body.profile.beneficiaries.modal.form.swift"
                                                )}
                                            </label>
                                            <input
                                                className="form-control"
                                                type="string"
                                                placeholder={this.t(
                                                    "page.body.profile.beneficiaries.modal.form.swift"
                                                )}
                                                onChange={this.handleChange(
                                                    "swift"
                                                )}
                                            />
                                        </div>
                                    )}
                                <div className="col-12 px-2">
                                    <div className="button-confirmation">
                                        {button}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    break;

                case "updateBeneficiary":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.beneficiaries.modal.btn.activate"
                            )}
                            onClick={this.handleUpdateBeneficiary}
                            className={
                                otpCode
                                    ? "btn btn-primary mx-0"
                                    : "btn btn-primary mx-0"
                            }
                            disabled={!activationCode}
                        />
                    );
                    resentCodeBtn = (
                        <Button
                            label={this.t("page.body.kyc.phone.resend")}
                            onClick={() =>
                                this.handleResendPinClick(
                                    this.state.beneficiaryData
                                )
                            }
                            className="btn btn-success mx-0"
                        />
                    );
                    body = (
                        <div className="card p-4 mb-0 rounded-0">
                            <div className="row p-4">
                                <div className="col-12 px-0">
                                    <label className="input-item-label">
                                        {this.t(
                                            "page.body.profile.beneficiaries.modal.form.activationCode"
                                        )}
                                    </label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        placeholder={this.t(
                                            "page.body.profile.beneficiaries.modal.form.activationCode"
                                        )}
                                        onChange={this.handleChange(
                                            "activationCode"
                                        )}
                                        onKeyDown={evt => (evt.key === "e" || evt.key === "." || evt.key === "+" || evt.key === "-" ) && evt.preventDefault()}
                                    />
                                </div>
                            </div>
                            <div className="">
                                {button}
                                {resentCodeBtn}
                            </div>
                        </div>
                    );
                    break;

                case "deleteBeneficiary":
                    button = (
                        <Button
                            label={this.t(
                                "page.body.profile.beneficiaries.modal.btn.delete"
                            )}
                            onClick={this.handleDeleteBeneficiary}
                            className={
                                otpCode ? "btn btn-danger" : "btn btn-danger"
                            }
                        />
                    );
                    body = (
                        <div className="card p-4 mb-0 rounded-0">
                            <div className="row p-4">
                                <div className="col-12 p-2">
                                    <label className="input-item-label">
                                        {this.t(
                                            "page.body.profile.beneficiaries.modal.form.deleteConfirm"
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="">{button}</div>
                        </div>
                    );
                    break;

                default:
                    break;
            }

            body = !body ? (
                <div className="base-email-form__form-content">
                    <div className="base-email-form__header">
                        {this.t("page.body.profile.beneficiaries.modal.title")}
                    </div>
                    <div className={emailGroupClass}>
                        <CustomInput
                            type="number"
                            label={this.t(
                                "page.body.profile.beneficiaries.modal.label"
                            )}
                            placeholder={this.t(
                                "page.body.profile.beneficiaries.modal.placeholder"
                            )}
                            defaultLabel="2FA code"
                            handleChangeInput={this.handleOtpCodeChange}
                            inputValue={otpCode || ""}
                            handleFocusInput={this.handleChangeFocusField}
                            classNameLabel="base-email-form__label"
                            classNameInput="base-email-form__input"
                            autoFocus={true}
                            onBeneficiaryPress={this.handleEnterPress}
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

        this.handleHideModal = () => {
            const payload = {
                active: false,
            };
            this.props.toggleBeneficiariesModal(payload);
        };

        this.handleOtpCodeChange = (value) => {
            this.setState({
                otpCode: value,
            });
        };

        this.renderOnClick = () => {
            switch (this.props.modal.action) {
                case "getBeneficiaries":
                    this.handleGetBeneficiaries();
                    break;

                case "createBeneficiary":
                    this.handleCreateBeneficiary();
                    break;

                case "createSuccess":
                    this.handleCreateSuccess();
                    break;

                case "updateBeneficiary":
                    this.handleUpdateBeneficiary();
                    break;

                case "deleteBeneficiary":
                    this.handleDeleteBeneficiary();
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

        this.handleGetBeneficiariesClick = (beneficiary) => {
            const payload = {
                active: true,
                action: "getBeneficiaries",
                beneficiary,
            };
            this.props.toggleBeneficiariesModal(payload);
        };

        this.handleGetBeneficiaries = () => {
            this.handleHideModal();
            this.setState({
                otpCode: "",
            });
        };

        this.handleCreateBeneficiaryClick = () => {
            const payload = {
                active: true,
                action: "createBeneficiary",
            };
            this.props.toggleBeneficiariesModal(payload);
        };

        this.canSubmit = () => {
            if (this.state.currency) {
                if (this.state.currency.type === "coin")
                    return (
                        this.state.address &&
                        this.state.name &&
                        this.state.description
                    );
                if (this.state.currency.type === "fiat")
                    return (
                        this.state.fullName &&
                        this.state.swift &&
                        this.state.accountNumber &&
                        this.state.name &&
                        this.state.description
                    );
                return this.state.name && this.state.description;
            }

            return false;
        };

        this.handleCreateBeneficiary = () => {
            if (!this.canSubmit())
                return this.props.fetchSuccess({
                    message: [
                        `page.body.profile.beneficiaries.modal.form.submitFailed`,
                    ],
                    type: "success",
                });
            let data = {};
            if (this.state.curreency.type === "coin")
                data = {
                    ...data,
                    address: this.state.address,
                };
            if (this.state.curreency.type === "fiat")
                data = {
                    ...data,
                    full_name: this.state.fullName,
                    swift: this.state.swift,
                    account_number: this.state.accountNumber,
                };
            let payload = {
                currency: this.state.currency.id,
                name: this.state.name,
                description: this.state.description,
                data,
            };
            this.props.createBeneficiary(payload);
            this.setState({
                otpCode: "",
            });
            this.props.createBeneficiaryFromWallets({
                create: false,
                currency: "",
            });
        };

        this.handleCreateSuccess = () => {
            const payload = {
                active: false,
            };
            this.props.toggleBeneficiariesModal(payload);
        };

        this.handleToggleStateBeneficiaryClick = (beneficiary) => {
            if (beneficiary.state == "active")
                return this.props.fetchSuccess({
                    message: [
                        "page.body.profile.beneficiaries.modal.form.alreadyActive",
                    ],
                    type: "error",
                });
            this.setState({
                beneficiaryData: beneficiary,
            });
            const payload = {
                active: true,
                action: "updateBeneficiary",
                beneficiary,
            };
            this.props.toggleBeneficiariesModal(payload);
        };

        this.handleUpdateBeneficiary = () => {
            const payload = {
                pin: parseInt(this.state.activationCode),
                id: this.props.modal.beneficiary.id,
            };
            this.props.updateBeneficiary(payload);
            this.setState({
                activationCode: "",
            });
        };

        this.handleCopy = (id, type) => {
            this.copy(id);
            this.props.fetchSuccess({
                message: [`success.api_keys.copied.${type}`],
                type: "success",
            });
        };

        this.handleDeleteBeneficiaryClick = (beneficiary) => {
            const payload = {
                active: true,
                action: "deleteBeneficiary",
                beneficiary,
            };
            this.props.toggleBeneficiariesModal(payload);
        };

        this.handleDeleteBeneficiary = () => {
            const payload = {
                id: this.props.modal.beneficiary.id,
            };
            this.props.deleteBeneficiary(payload);
            this.setState({
                otpCode: "",
            });
        };

        this.handleResendPinClick = (beneficiary) => {
            const payload = beneficiary.id;
            this.props.resendPinBeneficiary(payload);
        };
    }

    componentDidMount() {
        const {
            createBeneficiaryState,
            createBeneficiaryCurrency,
            currencies,
        } = this.props;

        if (createBeneficiaryState) {
            const selectedCurrency =
                currencies &&
                currencies.filter((v) => v.id === createBeneficiaryCurrency)[0];
            this.setState({
                currency: selectedCurrency,
            });
            this.state.curreency = selectedCurrency;
            this.handleCreateBeneficiaryClick();
        }

        this.props.getBeneficiaries();
    }

    render() {
        const { user, dataLoaded, beneficiaries } = this.props;
        const modal = this.props.modal.active ? (
            <div className="base-modal">
                <div className="">
                    {this.renderModalHeader()}
                    {this.renderModalBody()}
                </div>
            </div>
        ) : null;
        return (
            <div className="card beneficiary-card">
                <div className="card-innr flex-column">
                    <div className="card-head">
                        <h4 className="card-title d-inline-block">
                            {this.t("page.body.profile.beneficiaries.header")}
                        </h4>

                        <button
                            className="d-block d-sm-inline-block my-3 mx-auto m-sm-0 float-sm-right pointer btn"
                            onClick={this.handleCreateBeneficiaryClick}
                        >
                            {this.t(
                                "page.body.profile.beneficiaries.header.create"
                            )}
                        </button>
                    </div>
                    {!dataLoaded && !beneficiaries.length && (
                        <ClipLoader
                            sizeUnit="px"
                            size={35}
                            loading={true}
                            color="var(--accent)"
                        />
                    )}
                    {dataLoaded && !beneficiaries.length && (
                        <div
                            className="parent-profile-page__label parent-profile-page__text-center"
                            style={{
                                fontWeight: 400,
                            }}
                        >
                            {this.t(
                                "page.body.profile.beneficiaries.noBeneficiaries"
                            )}
                        </div>
                    )}
                    {dataLoaded && beneficiaries.length > 0 && (
                        <Table
                            header={this.getTableHeaders()}
                            data={
                                beneficiaries && beneficiaries.length
                                    ? this.getTableData(beneficiaries)
                                    : [[]]
                            }
                        />
                    )}
                    {modal}
                </div>
            </div>
        );
    }

    getTableData(beneficiariesData) {
        return beneficiariesData.map((item, i) => [
            (this.props.currencies &&
                this.props.currencies.filter((v) => v.id === item.currency)
                    .name) ||
                item.currency.toUpperCase(),
            item.name,
            item.description,
            <div
                className="parent-profile-page__api-keys__state"
                key={`${i}${item.id}state`}
            >
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
            <button
                className={
                    item.state === "active"
                        ? "badge badge-danger badge__beneficiary-button"
                        : "badge badge-success badge__beneficiary-button"
                }
                onClick={() => this.handleToggleStateBeneficiaryClick(item)}
            >
                {item.state === "active" ? "Deactivate" : "Activate"}
            </button>,
            <div className="d-flex">
                <span
                    className="far fa-eye mr-2"
                    style={{
                        fontSize: "1.2rem",
                    }}
                    key={item.id}
                    onClick={() => this.handleGetBeneficiariesClick(item)}
                />
                {item.state !== "active" ? (
                    <span
                        className="far ti-reload mr-2 ml-2"
                        style={{
                            fontSize: "1.2rem",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            cursor: "pointer",
                        }}
                        key={item.id + "_beneficiary_resend_pin_span"}
                        onClick={() => this.handleResendPinClick(item)}
                    />
                ) : (
                    <span className=" mr-3 ml-3" />
                )}
                <span
                    className="fas fa-times-circle  mr-2 ml-2"
                    style={{
                            fontSize: "1.2rem",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            cursor: "pointer",
                        }}
                    key={item.id}
                    onClick={() => this.handleDeleteBeneficiaryClick(item)}
                />
            </div>,
        ]);
    }
}

const mapStateToProps = (state) => ({
    beneficiaries: selectBeneficiaries(state),
    currencies: selectCurrencies(state),
    dataLoaded: selectBeneficiariesDataLoaded(state),
    modal: selectBeneficiariesModal(state),
    user: selectUserInfo(state),
    createBeneficiaryState: selectCreateBeneficiary(state),
    createBeneficiaryCurrency: selectCurrencyForBeneficiary(state),
});

const mapDispatchToProps = (dispatch) => ({
    toggleBeneficiariesModal: (payload) =>
        dispatch(beneficiariesModal(payload)),
    getBeneficiaries: (payload) => dispatch(beneficiariesFetch(payload)),
    createBeneficiary: (payload) => dispatch(beneficiaryCreateFetch(payload)),
    updateBeneficiary: (payload) => dispatch(beneficiaryUpdateFetch(payload)),
    deleteBeneficiary: (payload) => dispatch(beneficiaryDeleteFetch(payload)),
    fetchSuccess: (payload) => dispatch(alertPush(payload)),
    resendPinBeneficiary: (payload) =>
        dispatch(beneficiaryResendPinFetch(payload)),
    createBeneficiaryFromWallets: (payload) =>
        dispatch(createBeneficiaryFromWallets(payload)),
});

const connected = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(BeneficiariesComponent)
);
const Beneficiaries = withRouter(connected);
export { Beneficiaries };
