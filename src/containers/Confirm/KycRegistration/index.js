import React from "react";
import { Dropdown, Checkbox } from "@components/components";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { selectCurrentLanguage, selectUserInfo } from "../../../modules";
import {
    selectSendIdentitySuccess,
    sendIdentity,
} from "../../../modules/user/kyc/identity";
import { alertPush } from "../../../modules/public/alert";
import { labelFetch } from "../../../modules/user/kyc/label";
import { nationalities } from "../../../translations/nationalities";
import {
    statusData,
    industryData,
    accountType,
    expectedVol,
    sourceData,
} from "./formData";

class KycRegistrationComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            nationality: "",
            employment_status: "",
            industry: "",
            purpose: "",
            address: {
                apartment: "",
                block: "",
                street: "",
                city: "",
                country: "",
                postalCode: "",
            },
            monthly_volume: "",
            funds_source: "",
            pep: false,
            tnc: false,
            privacyPolicy: false,
            cryptoRisk: false,
        };

        this.translate = (e) => {
            return this.props.intl.formatMessage({
                id: e,
            });
        };

        this.selectStatus = (value) =>
            this.setState({ employment_status: statusData[value] });

        this.selectIndustry = (value) =>
            this.setState({ industry: industryData[value] });

        this.selectType = (value) =>
            this.setState({ purpose: accountType[value] });

        this.selectVol = (value) =>
            this.setState({ monthly_volume: expectedVol[value] });

        this.selectSource = (value) =>
            this.setState({ funds_source: sourceData[value] });

        this.handleChange = (e) => {
            const name = e.target.name;
            const value = e.target.value;

            this.setState({
                address: { ...this.state.address, [name]: value },
            });
        };

        this.handleSubmit = () => {
            const {
                tnc,
                pep,
                privacyPolicy,
                cryptoRisk,
                nationality,
                employment_status,
                industry,
                purpose,
                address,
                monthly_volume,
                funds_source,
            } = this.state;

            const data = {
                nationality,
                employment_status,
                industry,
                apartment: address.apartment,
                block_name: address.block,
                street_name: address.street,
                city: address.city,
                country: address.country,
                post_code: address.postalCode,
                purpose,
                monthly_volume,
                funds_source,
                pep_checked: pep,
                terms_agreed: tnc,
                privacy_agreed: privacyPolicy,
                risk_agreed: cryptoRisk,
            };

            const checkErr = !tnc
                ? "Terms and Coditions are not checked"
                : !privacyPolicy
                ? "Privacy Policy are not checked"
                : !cryptoRisk && "Cryptocurrency related risks are not checked";

            if (!tnc || !privacyPolicy || !cryptoRisk) {
                this.props.alertPush({
                    message: [checkErr],
                    type: "error",
                });
            } else {
                console.log(data);
            }
        };
    }
    render() {
        const dataNationalities = nationalities.map((value) => {
            return this.translate(value);
        });
        const onSelectCountry = (value) =>
            this.setState({ nationality: dataNationalities[value] });

        const tncMsg = (
            <>
                I agree with <a href="https://wenbit.com/user-terms-and-conditions/">Terms and Conditions</a>
            </>
        );
        const pepMsg = (
            <>
                Are you yourself/connected with a{" "}
                <a href="https://wenbit.com/politically-exposed-person/">Politically Exposed Person</a> ?
            </>
        );
        const privacyMsg = (
            <>
                I agree with <a href="https://wenbit.com/privacy-policy-2/">Privacy Policy</a>
            </>
        );
        const cryptoMsg = (
            <>
                I have read <a href="https://wenbit.com/risks-associated-with-crypto/">Risks Related to Cryptocurrency.</a>
            </>
        );

        return (
            <div className="col-12 col-md-8 mx-auto">
                <div className="card-innr no-border-radius">
                    <div className="step-head">
                        <div className="step-number text-white">04</div>
                        <div className="step-head-text">
                            <h3 className="text-white">Verification Form</h3>
                        </div>
                    </div>
                </div>
                <div className="form-step-fields card-iner pt-1 pb-5 no-border-radius">
                    <div className="row">
                        <div className="col-12 col-md-6 mb-4">
                            <label className="input-item-label">
                                Nationality
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={dataNationalities}
                                onSelect={onSelectCountry}
                                placeholder="Select Country"
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <label className="input-item-label">
                                Employment Status
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={statusData}
                                onSelect={this.selectStatus}
                                placeholder="Select Status"
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <label className="input-item-label">
                                Industry You Work In
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={industryData}
                                onSelect={this.selectIndustry}
                                placeholder="Select Industry"
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <label className="input-item-label">
                                Purpose of opening account
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={accountType}
                                onSelect={this.selectType}
                                placeholder="Select Purpose"
                            />
                        </div>
                        <div className="col-12 mb-1">
                            <label className="input-item-label">
                                {this.translate(
                                    "page.body.kyc.identity.residentialAddress"
                                )}
                            </label>
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <input
                                        className="input-confirmation-number "
                                        type="number"
                                        name="apartment"
                                        placeholder="Apartment Number"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <input
                                        className="input-confirmation-number "
                                        type="string"
                                        name="block"
                                        placeholder="Block Name / Number"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <input
                                        className="input-confirmation-number "
                                        type="string"
                                        name="street"
                                        placeholder="Street Name"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <input
                                        className="input-confirmation-number "
                                        type="string"
                                        name="city"
                                        placeholder="City / Town"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <input
                                        className="input-confirmation-number "
                                        type="string"
                                        name="country"
                                        placeholder="Country"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <input
                                        className="input-confirmation-number "
                                        type="string"
                                        name="postalCode"
                                        placeholder="Postal Code"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <label className="input-item-label">
                                Expected Monthly Account Volume
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={expectedVol}
                                onSelect={this.selectVol}
                                placeholder="Select Monthly Volume"
                            />
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <label className="input-item-label">
                                What are your source of funds?
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={sourceData}
                                onSelect={this.selectSource}
                                placeholder="Select Fund Source"
                            />
                        </div>
                        <div className="col-12">
                            <Checkbox
                                checked={this.state.tnc}
                                className="base-sign-up-form__checkbox"
                                onChange={() =>
                                    this.setState({ tnc: !this.state.tnc })
                                }
                                label={tncMsg}
                            />
                        </div>

                        <div className="col-12">
                            <Checkbox
                                checked={this.state.pep}
                                className="base-sign-up-form__checkbox"
                                onChange={() =>
                                    this.setState({ pep: !this.state.pep })
                                }
                                label={pepMsg}
                            />
                        </div>
                        <div className="col-12">
                            <Checkbox
                                checked={this.state.privacyPolicy}
                                className="base-sign-up-form__checkbox"
                                onChange={() =>
                                    this.setState({
                                        privacyPolicy:
                                            !this.state.privacyPolicy,
                                    })
                                }
                                label={privacyMsg}
                            />
                        </div>
                        <div className="col-12">
                            <Checkbox
                                checked={this.state.cryptoRisk}
                                className="base-sign-up-form__checkbox"
                                onChange={() =>
                                    this.setState({
                                        cryptoRisk: !this.state.cryptoRisk,
                                    })
                                }
                                label={cryptoMsg}
                            />
                        </div>
                        <div className="col-12 my-4">
                            <button
                                className="btn btn-primary"
                                onClick={this.handleSubmit}
                            >
                                {this.translate("page.body.kyc.submit")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    success: selectSendIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
    userData: selectUserInfo(state),
});

const mapDispatchProps = (dispatch) => ({
    sendIdentity: (payload) => dispatch(sendIdentity(payload)),
    labelFetch: () => dispatch(labelFetch()),
    alertPush: (payload) => dispatch(alertPush(payload)),
});

export const KycRegistration = injectIntl(
    connect(mapStateToProps, mapDispatchProps)(KycRegistrationComponent)
);
