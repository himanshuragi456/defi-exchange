import * as React from "react";
import { injectIntl, intlShape } from "react-intl";
import { connect } from "react-redux";
import { CopyableTextField } from "../../components";
import { alertPush, selectUserInfo } from "../../modules";

const copy = (id) => {
    const copyText = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
    }
};

class ReferralProgramClass extends React.Component {
    constructor() {
        super(...arguments);

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
    }

    render() {
        const { user } = this.props;
        const referralLink = `${window.document.location.origin}/signup?refid=${user.uid}`;
        return (
            <div className="copy-wrap mgb-0-5x">
                <span className="copy-feedback" />
                <CopyableTextField
                    className="parent-copyable-text-field__input"
                    value={referralLink}
                    fieldId="referral-id"
                    showQr={true}
                    widthProp="100%"
                    copyButtonText={this.translate(
                        "page.body.profile.content.copyLink"
                    )}
                />
            </div>
        );
    }
}

ReferralProgramClass.propsTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchSuccess: (payload) => dispatch(alertPush(payload)),
});

export const ReferralProgram = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ReferralProgramClass)
);
