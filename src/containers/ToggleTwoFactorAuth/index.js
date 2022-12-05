import { Button, CopyableTextField, Input } from "@components/components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { alertPush } from "../../modules";
import {
    enableUser2fa,
    generate2faQRFetch,
    selectTwoFactorAuthBarcode,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
} from "../../modules/user/profile";

const copy = (id) => {
    const copyText = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
    }
};

class ToggleTwoFactorAuthComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            otpCode: "",
        };

        this.translate = (e) => {
            return this.props.intl.formatMessage({
                id: e,
            });
        };

        this.doCopy = () => {
            copy("referral-id");
            this.props.fetchSuccess({
                message: ["page.body.wallets.tabs.deposit.ccy.message.success"],
                type: "success",
            });
        };

        this.renderToggle2fa = (enable2fa) => {
            const { barcode, qrUrl } = this.props;
            const { otpCode } = this.state;
            const secretRegex = /secret=(\w+)/;
            const secretMatch = qrUrl.match(secretRegex);
            const secret = secretMatch ? secretMatch[1] : null;
            const submitHandler = enable2fa
                ? this.handleEnable2fa
                : this.handleDisable2fa;
            return (
                <div className="parent-profile-two-factor-auth__form">
                    <div className="parent-profile-two-factor-auth__header">
                        <div />
                        <div className="parent-profile-two-factor-auth__title">
                            {this.translate(
                                "page.body.profile.header.account.content.twoFactorAuthentication.header"
                            )}
                        </div>
                        <div
                            className="base-email-form__cros-icon"
                            onClick={this.goBack}
                        >
                            <img src={require("./close.svg")} />
                        </div>
                    </div>
                    <div className="parent-profile-two-factor-auth__body">
                        <div className="parent-profile-two-factor-auth__body--text">
                            <div className="parent-profile-two-factor-auth__body--text--group">
                                <span>1</span>
                                <div>
                                    {this.translate(
                                        "page.body.profile.header.account.content.twoFactorAuthentication.message.1"
                                    )}
                                    <a
                                        target="_blank"
                                        href="https://itunes.apple.com/ru/app/google-authenticator/id388497605?mt=8"
                                    >
                                        AppStore{" "}
                                    </a>
                                    {this.translate(
                                        "page.body.profile.header.account.content.twoFactorAuthentication.message.or"
                                    )}
                                    <a
                                        target="_blank"
                                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl"
                                    >
                                        Google play
                                    </a>
                                </div>
                            </div>
                            <div className="parent-profile-two-factor-auth__body--text--group">
                                <span>2</span>
                                <div>
                                    {this.translate(
                                        "page.body.profile.header.account.content.twoFactorAuthentication.message.2"
                                    )}
                                    <br />
                                    {this.translate(
                                        "page.body.profile.header.account.content.twoFactorAuthentication.message.3"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="parent-profile-two-factor-auth__body--barcode">
                            {enable2fa && this.renderTwoFactorAuthQR(barcode)}
                        </div>
                    </div>
                    <div className="parent-profile-two-factor-auth__copyablefield">
                        {enable2fa && secret && this.renderSecret(secret)}
                    </div>
                    <div className="parent-profile-two-factor-auth__body">
                        <div className="parent-profile-two-factor-auth__body--text--last">
                            <div className="parent-profile-two-factor-auth__body--text--group">
                                <span>3</span>
                                <div>
                                    {this.translate(
                                        "page.body.profile.header.account.content.twoFactorAuthentication.message.4"
                                    )}
                                </div>
                            </div>
                        </div>
                        <fieldset className="parent-profile-two-factor-auth__body--input">
                            {otpCode && (
                                <legend>
                                    {this.translate(
                                        "page.body.profile.header.account.content.twoFactorAuthentication.subHeader"
                                    )}
                                </legend>
                            )}
                            <Input
                                onChangeValue={this.handleOtpCodeChange}
                                type="tel"
                                value={otpCode}
                                placeholder={this.translate(
                                    "page.body.profile.header.account.content.twoFactorAuthentication.subHeader"
                                )}
                                onKeyPress={this.handleEnterPress}
                            />
                        </fieldset>
                    </div>
                    <Button
                        className="parent-profile-two-factor-auth__button"
                        label={this.translate(
                            "page.body.profile.header.account.content.twoFactorAuthentication.enable"
                        )}
                        onClick={submitHandler}
                    />
                </div>
            );
        };

        this.handleOtpCodeChange = (value) => {
            this.setState({
                otpCode: value,
            });
        };

        this.handleEnterPress = (event) => {
            const enable2fa = this.get2faAction();
            const submitHandler = enable2fa
                ? this.handleEnable2fa
                : this.handleDisable2fa;

            if (event.key === "Enter") {
                event.preventDefault();
                submitHandler();
            }
        };

        this.handleEnable2fa = () => {
            this.props.toggle2fa({
                code: this.state.otpCode,
                enable: true,
            });
        };

        this.handleDisable2fa = () => {
            this.props.toggle2fa({
                code: this.state.otpCode,
                enable: false,
            });
        };

        this.handleNavigateToProfile = () => {
            this.props.history.push("/profile");
        };

        this.get2faAction = () => {
            const routingState = this.props.history.location.state;
            return routingState ? routingState.enable2fa : false;
        };
    }

    componentDidMount() {
        const enable2fa = this.get2faAction();

        if (enable2fa) {
            this.props.generateQR();
        }
    }

    componentWillReceiveProps(next) {
        if (!this.props.success && next.success) {
            this.handleNavigateToProfile();
        }
    }

    render() {
        const enable2fa = this.get2faAction();
        return (
            <div className="parent-profile-two-factor-auth">
                {this.renderToggle2fa(enable2fa)}
            </div>
        );
    }

    componentDidUpdate(prev) {
        if (!prev.success && this.props.success) {
            this.props.enableUser2fa();
        }
    }

    renderTwoFactorAuthQR(barcode) {
        const src = `data:image/png;base64,${barcode}`;
        return (
            barcode.length > 0 && (
                <img className="parent-profile-two-factor-auth__qr" src={src} />
            )
        );
    }

    renderSecret(secret) {
        return (
            <fieldset onClick={this.doCopy}>
                <legend>
                    {this.translate(
                        "page.body.profile.header.account.content.twoFactorAuthentication.message.mfa"
                    )}
                </legend>
                {secret && (
                    <CopyableTextField value={secret} fieldId="secret-2fa" />
                )}
            </fieldset>
        );
    }

    goBack() {
        window.history.back();
    }
}

const mapStateToProps = (state) => ({
    qrUrl: selectTwoFactorAuthQR(state),
    barcode: selectTwoFactorAuthBarcode(state),
    success: selectTwoFactorAuthSuccess(state),
});

const mapDispatchToProps = (dispatch) => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) =>
        dispatch(
            toggle2faFetch({
                code,
                enable,
            })
        ),
    enableUser2fa: () => dispatch(enableUser2fa()),
    fetchSuccess: (payload) => dispatch(alertPush(payload)),
});

const connected = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ToggleTwoFactorAuthComponent)
);
const ToggleTwoFactorAuth = withRouter(connected);
export { ToggleTwoFactorAuth };
