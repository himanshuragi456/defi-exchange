import {Button} from "@components/components";
import {Checkbox, Dropdown} from "../../component";
import {CustomInput} from "..";
import * as React from "react";
import {withRouter} from "react-router-dom";
import {PEPUrl, PPUrl, RRCUrl, TNCUrl} from "../../api";
import {
    selectCurrentLanguage,
    selectSendRegistrationError,
    selectSendRegistrationLoading,
    selectSendRegistrationSuccess,
    sendRegistration
} from "../../modules";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import countries from "i18n-iso-countries";
import {nationalities} from "../../translations/nationalities";

class RegistrationProcessComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            country: "AL",
            nationality: "Afghan",
            postcode: "",
            employment: "Employee in Private Sector",
            industry: "Finance",
            apartment: "",
            block: "",
            street: "",
            postal_code: "",
            purpose: "Trading",
            volume: "0 - 5,000",
            source: "Employment",
            pep: false,
            tnc: false,
            privacy: false,
            risks: false,
        };

        this.translate = (e) => {
            return this.props.intl.formatMessage({
                id: e,
            });
        };
        this.selectCountry = (value) => {
            this.setState({
                country: countries.getAlpha2Code(value, this.props.lang),
            });
        };

        this.onChange = (e, field, value) => {
            let key = field;
            if (!key) {
                key = e.target.label;
            }
            let _value = e?.target?.value;
            if (value) _value = value

            this.setState({[key]: _value})
            this.handleCheckButtonDisabled()
        }
        this.handleCheckButtonDisabled = () => {
            const {
                city,
                country,
                nationality,
                employment,
                industry,
                apartment,
                block,
                street,
                postal_code,
                purpose,
                volume,
                source,
                pep,
                tnc,
                privacy,
                risks,
            } = this.state;
            this.setState({
                cityError: city === "",
                countryError: country === "",
                nationalityError: nationality === "",
                employmentError: employment === "",
                industryError: industry === "",
                apartmentError: apartment === "",
                blockError: block === "",
                streetError: street === "",
                purposeError: purpose === "",
                sourceError: source === "",
                volumeError: volume === "",
                postal_codeError: postal_code === "",
                tncError: tnc === false,
                privacyError: privacy === false,
                risksError: risks === false
            });
            return (
                city === "" ||
                country === "" || nationality === "" ||
                employment === "" || industry === "" ||
                apartment === "" || block === "" ||
                street === "" || purpose === "" ||
                source === "" || volume === "" ||
                postal_code === "" ||
                tnc === false ||
                privacy === false || risks === false
            );
        };
    }

    componentWillReceiveProps(next) {
        console.log("RECEIVE", next)
        if (next.success === "success.registration.submitted") {
            this.props.history.push("/profile");
        }
        if (next.error?.message?.includes("resource.registration_details.exists")) {
            this.props.history.push("/profile");
        }
    }

    render() {
        const {
            lang
        } = this.props;
        const dataNationalities = nationalities.map((value) => {
            return this.translate(value);
        });
        countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
        countries.registerLocale(require("i18n-iso-countries/langs/ru.json"));
        countries.registerLocale(require("i18n-iso-countries/langs/zh.json"));
        const dataCountries = Object.values(countries.getNames(lang));
        const onSelectCountry = (value) =>
            this.selectCountry(dataCountries[value]);

        const employments = [
            "Employee in Private Sector",
            "Employee in Public Sector",
            "Self-Employed",
            "Student",
            "Retired",
            "Unemployed"
        ];
        const industries = [
            "Finance",
            "Entertainment",
            "Medical",
            "Software & Technology",
            "Education",
            "Textile",
            "Media and news",
            "Hospitality",
            "Construction",
            "Law",
            "Advertising",
            "Aviation",
            "Arts",
            "Education",
            "Service",
            "Retail",
        ];
        const volumes = [
            "0 - 5,000",
            "5,001 - 15,000",
            "15,001 +"
        ];
        const purposes = [
            "Trading",
            "Holding",
            "Other"
        ];
        const sources = [
            "Employment",
            "Pension/Social Benefits",
            "Savings",
            "Investments",
            "Scholarship",
            "Inheritance",
            "Sale/Rental of Real Estate",
        ];
        const onSelectNationality = (value) =>
            this.onChange(undefined, "nationality", dataNationalities[value]);
        return (
            <div className="form-step registration-card form-step1 col-12 col-md-8 mt-3 container card">
                <div className="card-innr no-border-radius">
                    <div className="step-head">
                        <div className="step-number text-white">04</div>
                        <div className="step-head-text">
                            <h3 className="text-white">Verification Form</h3>
                        </div>
                    </div>
                </div>
                <form action="#" onSubmit={(e) => {
                    e.preventDefault();
                    const {
                        nationality,
                        employment,
                        industry,
                        purpose,
                        volume,
                        source,
                        apartment,
                        block,
                        city,
                        postal_code,
                        street,
                        country,
                    } = this.state;
                    console.log('VALUES', {
                        nationality,
                        employment_status: employment,
                        industry: industry,
                        account_opening_purpose: purpose,
                        expected_monthly_volume: volume,
                        source_of_funds: source,
                        apartment_number: apartment,
                        block_name: block,
                        city,
                        street_name: street,
                        postal_code,
                        country,
                    })
                    if (this.handleCheckButtonDisabled()) return;

                    this.props.sendRegistration({
                        nationality,
                        employment_status: employment,
                        industry: industry,
                        account_opening_purpose: purpose,
                        expected_monthly_volume: volume,
                        source_of_funds: source,
                        apartment_number: apartment,
                        block_name: block,
                        city,
                        street_name: street,
                        postal_code,
                        country,
                    })
                }}>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.nationality")}
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={dataNationalities}
                                onSelect={onSelectNationality}
                                placeholder={this.translate(
                                    "page.body.kyc.registration.nationality"
                                )}
                            />
                            {this.state.nationalityError && <div className={'text-danger'}>
                                Please select {this.translate(
                                "page.body.kyc.registration.nationality"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.employment")}
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={employments}
                                onSelect={(value) => {
                                    this.onChange(undefined, "employment", employments[value])
                                }}
                                placeholder={this.translate(
                                    "page.body.kyc.registration.employment"
                                )}
                            />
                            {this.state.employmentError && <div className={'text-danger'}>
                                Please select {this.translate(
                                "page.body.kyc.registration.employment"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.industry")}
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={industries}
                                onSelect={(value) => {
                                    this.onChange(undefined, "industry", industries[value])
                                }}
                                placeholder={this.translate(
                                    "page.body.kyc.registration.industry"
                                )}
                            />
                            {this.state.industryError && <div className={'text-danger'}>
                                Please select {this.translate(
                                "page.body.kyc.registration.industry"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.apartment")}
                            </label>
                            <CustomInput
                                type="text"
                                label={"apartment"}
                                inputValue={this.state.apartment}
                                placeholder={this.translate("page.body.kyc.registration.apartment")}
                                handleChangeInput={(v) => this.onChange(undefined, "apartment", v)}
                                // handleChangeInput={this.props.handleChangeUserName}
                                // inputValue={username}
                                // handleFocusInput={this.props.handleFocusUserName}
                                classNameLabel="base-sign-up-form__label"
                                classNameInput="base-sign-up-form__input"
                            />
                            {this.state.apartmentError && <div className={'text-danger'}>
                                Please input {this.translate(
                                "page.body.kyc.registration.apartment"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.block")}
                            </label>
                            <CustomInput
                                type="text"
                                label={"block"}
                                inputValue={this.state.block}
                                placeholder={this.translate("page.body.kyc.registration.block")}
                                handleChangeInput={(v) => this.onChange(undefined, "block", v)}
                                // handleChangeInput={this.props.handleChangeUserName}
                                // inputValue={username}
                                // handleFocusInput={this.props.handleFocusUserName}
                                classNameLabel="base-sign-up-form__label"
                                classNameInput="base-sign-up-form__input"
                            />
                            {this.state.blockError && <div className={'text-danger'}>
                                Please input {this.translate(
                                "page.body.kyc.registration.block"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.street")}
                            </label>
                            <CustomInput
                                type="text"
                                label={"street"}
                                inputValue={this.state.street}
                                placeholder={this.translate("page.body.kyc.registration.street")}
                                handleChangeInput={(v) => this.onChange(undefined, "street", v)}
                                // handleChangeInput={this.props.handleChangeUserName}
                                // inputValue={username}
                                // handleFocusInput={this.props.handleFocusUserName}
                                classNameLabel="base-sign-up-form__label"
                                classNameInput="base-sign-up-form__input"
                            />
                            {this.state.streetError && <div className={'text-danger'}>
                                Please input {this.translate(
                                "page.body.kyc.registration.street"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.city")}
                            </label>
                            <CustomInput
                                type="text"
                                label={"city"}
                                inputValue={this.state.city}
                                placeholder={this.translate("page.body.kyc.registration.city")}
                                handleChangeInput={(v) => this.onChange(undefined, "city", v)}
                                // handleChangeInput={this.props.handleChangeUserName}
                                // inputValue={username}
                                // handleFocusInput={this.props.handleFocusUserName}
                                classNameLabel="base-sign-up-form__label"
                                classNameInput="base-sign-up-form__input"
                            />
                            {this.state.cityError && <div className={'text-danger'}>
                                Please input {this.translate(
                                "page.body.kyc.registration.city"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.country")}
                            </label>
                            <Dropdown
                                className="dropdown_list_white"
                                list={dataCountries}
                                onSelect={onSelectCountry}
                                placeholder={this.translate(
                                    "page.body.kyc.identity.CoR"
                                )}
                            />
                            {this.state.countryError && <div className={'text-danger'}>
                                Please select {this.translate(
                                "page.body.kyc.identity.CoR"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="input-item-label">
                                {this.translate("page.body.kyc.registration.postal_code")}
                            </label>
                            <CustomInput
                                type="text"
                                label={"postal_code"}
                                inputValue={this.state.postal_code}
                                placeholder={this.translate("page.body.kyc.registration.postal_code")}
                                handleChangeInput={(v) => this.onChange(undefined, "postal_code", v)}
                                classNameLabel="base-sign-up-form__label"
                                classNameInput="base-sign-up-form__input"
                            />
                            {this.state.postal_codeError && <div className={'text-danger'}>
                                Please input {this.translate(
                                "page.body.kyc.registration.postal_code"
                            )}
                            </div>}
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-item">
                                <label className="input-item-label">
                                    {this.translate(
                                        "page.body.kyc.registration.purpose"
                                    )}
                                </label>
                                <Dropdown
                                    className="dropdown_list_white"
                                    list={purposes}
                                    placeholder={this.translate(
                                        "page.body.kyc.registration.purpose"
                                    )}
                                    onSelect={(value) => {
                                        this.onChange(undefined, "purpose", purposes[value])
                                    }}
                                />
                                {this.state.purposeError && <div className={'text-danger'}>
                                    Please select {this.translate(
                                    "page.body.kyc.registration.purpose"
                                )}
                                </div>}
                            </div>
                        </div>
                        <div className="col-12 col-md-6">

                            <div className="input-item">
                                <label className="input-item-label">
                                    {this.translate(
                                        "page.body.kyc.registration.volume"
                                    )}
                                </label>
                                <Dropdown
                                    className="dropdown_list_white"
                                    list={volumes}
                                    placeholder={this.translate(
                                        "page.body.kyc.registration.volume"
                                    )}
                                    onSelect={(value) => {
                                        this.onChange(undefined, "volume", volumes[value])
                                    }}
                                />
                                {this.state.volumeError && <div className={'text-danger'}>
                                    Please select {this.translate(
                                    "page.body.kyc.registration.volume"
                                )}
                                </div>}
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-item">
                                <label className="input-item-label">
                                    {this.translate(
                                        "page.body.kyc.registration.source"
                                    )}
                                </label>
                                <Dropdown
                                    className="dropdown_list_white"
                                    list={sources}
                                    placeholder={this.translate(
                                        "page.body.kyc.registration.source"
                                    )}
                                    onSelect={(value) => {
                                        this.onChange(undefined, "source", sources[value])
                                    }}
                                />
                                {this.state.sourceError && <div className={'text-danger'}>
                                    Please select {this.translate(
                                    "page.body.kyc.registration.source"
                                )}
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="input-item text-left">
                                <Checkbox
                                    checked={this.state.pep}
                                    className="base-sign-up-form__checkbox"
                                    onChange={(e) => {
                                        this.onChange(undefined, 'pep', !this.state.pep)
                                    }}
                                    label={<>
                                        Are you a
                                        &nbsp;
                                        <a target={'_blank'} href={PEPUrl()}>Politically exposed person?</a>
                                    </>}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="input-item text-left">
                                <Checkbox
                                    checked={this.state.tnc}
                                    className="base-sign-up-form__checkbox"
                                    checkboxClass={this.state.tncError ? "border-danger border" : ""}
                                    onChange={(e) => {
                                        this.onChange(undefined, 'tnc', !this.state.tnc)
                                    }}
                                    label={<>
                                        I have read & agree to the
                                        &nbsp;
                                        <a target={'_blank'} href={TNCUrl()}>Terms and Conditions</a>
                                    </>}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="input-item text-left">
                                <Checkbox
                                    checked={this.state.privacy}
                                    className="base-sign-up-form__checkbox"
                                    checkboxClass={this.state.privacyError ? "border-danger border" : ""}
                                    onChange={(e) => {
                                        this.onChange(undefined, 'privacy', !this.state.privacy)
                                    }}
                                    label={<>
                                        I have read & agree to the
                                        &nbsp;
                                        <a target={'_blank'} href={PPUrl()}>Privacy Policy</a>
                                    </>}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="input-item text-left">
                                <Checkbox
                                    checked={this.state.risks}
                                    className="base-sign-up-form__checkbox"
                                    checkboxClass={this.state.risksError ? "border-danger border" : ""}
                                    onChange={(e) => {
                                        this.onChange(undefined, 'risks', !this.state.risks)
                                    }}
                                    label={<>
                                        I have read & understood the
                                        &nbsp;
                                        <a target={'_blank'} href={RRCUrl()}>Risks Related to Cryptocurrency</a>
                                    </>}
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="base-sign-up-form__button"
                        disabled={this.props.loading}
                        label={
                            "Submit"
                        }
                    />
                </form>
                <div className="gaps-1x"/>
                <div className="gaps-md-2x"/>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    success: selectSendRegistrationSuccess(state),
    error: selectSendRegistrationError(state),
    loading: selectSendRegistrationLoading(state),
    lang: selectCurrentLanguage(state),
});

const mapDispatchProps = (dispatch) => ({
    sendRegistration: (payload) => dispatch(sendRegistration(payload)),
});

const RegistrationProcess = injectIntl(
    withRouter(connect(mapStateToProps, mapDispatchProps)(RegistrationProcessComponent))
);


export {RegistrationProcess};
