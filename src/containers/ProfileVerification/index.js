import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { labelFetch, selectLabelData, selectUserInfo } from "../../modules";
import {
    fetchDocuments,
    selectDocumentsData,
} from "../../modules/user/kyc/documents";

class ProfileVerificationComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.labelFetch();
        this.props.fetchDocuments();
    }

    render() {
        const { user, documents, label } = this.props;
        const userLevel = user.level;
        const activeClass =
            userLevel === 4
                ? "btn btn-success text-center text-white"
                : userLevel === 3 ?"btn btn-warning text-center text-white"
                    :documents.length === 0
                ? "btn btn-danger text-center text-white"
                : "btn btn-warning text-center text-white";
        let activeTitle =
            userLevel === 4
                ? "page.body.profile.kyc.button.success"
                : userLevel === 3 ? "page.body.profile.kyc.button.registration_pending"
                    : documents.length === 0
                ? "page.body.profile.kyc.button.fail"
                : "page.body.profile.kyc.button.pending";
        const notice = userLevel ? null : (
            <p className="lead text-light pdb-0-5x">
                You have not submitted your KYC application to verify your
                identity.
            </p>
        );
        const userVerified = user.level > 4;
        return (
            <div className="kyc-info card">
                <div className="card-innr">
                    <h6 className="card-title card-title-sm">
                        <FormattedMessage id="page.profile.kycTitle" />
                    </h6>
                    <p className="span-killer">
                        <FormattedMessage id="page.body.profile.kyc.content" />
                    </p>
                    {notice}
                    <div className="kyc-button-checkmark__wrapper">
                        <a
                            onClick={
                                !userVerified ? this.props.onConfirm : null
                            }
                            className={activeClass}
                            style={{
                                padding: "9px 50px",
                                marginRight: "5px",
                            }}
                        >
                            <FormattedMessage id={activeTitle} />
                        </a>
                    </div>
                    {!user.level >= 3 && (
                        <h6 className="kyc-alert text-danger">
                            <FormattedMessage id="page.body.profile.kyc.content.notice" />
                        </h6>
                    )}
                </div>
            </div>
        );
    }

    renderFirstLevel(userLevel) {
        const targetLevel = 1;
        const { titleClassName } = this.getLevelsClassNames(
            userLevel,
            targetLevel
        );
        return (
            <div className="parent-profile-page__row parent-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderVerificationLevel(
                        "page.body.profile.header.account.profile.email",
                        userLevel,
                        targetLevel
                    )}
                    <p>
                        <FormattedMessage id="page.body.profile.header.account.profile.email.message" />
                    </p>
                </div>
            </div>
        );
    }

    renderSecondLevel(userLevel) {
        const targetLevel = 2;
        const { titleClassName } = this.getLevelsClassNames(
            userLevel,
            targetLevel
        );
        return (
            <div className="parent-profile-page__row parent-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderVerificationLevel(
                        "page.body.profile.header.account.profile.phone",
                        userLevel,
                        targetLevel
                    )}
                    <p>
                        <FormattedMessage id="page.body.profile.header.account.profile.phone.message" />
                    </p>
                </div>
            </div>
        );
    }

    renderThirdLevel(userLevel) {
        const targetLevel = 3;
        const documentLabel = this.props.label.find(
            (label) => label.key === "document"
        );
        const isPending =
            documentLabel && documentLabel.value === "pending"
                ? this.renderPendingIcon()
                : "";
        const { titleClassName } = this.getLevelsClassNames(
            userLevel,
            targetLevel
        );
        return (
            <div className="parent-profile-page__row parent-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderIdentityVerification(
                        "page.body.profile.header.account.profile.identity",
                        userLevel,
                        targetLevel,
                        documentLabel
                    )}
                    <p>
                        <FormattedMessage id="page.body.profile.header.account.profile.identity.message" />
                    </p>
                </div>
                {isPending}
            </div>
        );
    }

    renderPendingIcon() {
        return (
            <div className="parent-profile-page__level-verification__pending">
                <p>
                    <FormattedMessage id="page.body.wallets.table.pending" />
                </p>
                <img src={require("../../assets/images/pending.svg")} />
            </div>
        );
    }

    renderVerificationLevel(text, userLevel, targetLevel) {
        if (userLevel === targetLevel - 1) {
            return (
                <a
                    href="/confirm"
                    className="parent-profile-page__level-verification__url"
                >
                    <FormattedMessage id={`${text}.unverified.title`} />
                </a>
            );
        } else {
            if (userLevel < targetLevel) {
                return (
                    <p className="parent-profile-page__level-verification__name">
                        <FormattedMessage id={`${text}.unverified.title`} />
                    </p>
                );
            } else {
                return (
                    <p className="parent-profile-page__level-verification__name">
                        <FormattedMessage id={`${text}.title`} />
                    </p>
                );
            }
        }
    }

    renderIdentityVerification(text, userLevel, targetLevel, documentLabel) {
        const isLabelExist = this.props.label;

        if (isLabelExist.length > 0) {
            switch (userLevel) {
                case targetLevel - 1: {
                    if (documentLabel) {
                        return (
                            <p className="parent-profile-page__level-verification__name">
                                <FormattedMessage
                                    id={`${text}.unverified.title`}
                                />
                            </p>
                        );
                    } else {
                        return (
                            <a
                                href="/confirm"
                                className="parent-profile-page__level-verification__url"
                            >
                                <FormattedMessage
                                    id={`${text}.unverified.title`}
                                />
                            </a>
                        );
                    }
                }

                case targetLevel:
                    return (
                        <p className="parent-profile-page__level-verification__name">
                            <FormattedMessage id={`${text}.title`} />
                        </p>
                    );

                default:
                    return (
                        <p className="parent-profile-page__level-verification__name">
                            <FormattedMessage id={`${text}.unverified.title`} />
                        </p>
                    );
            }
        } else {
            return (
                <p className="parent-profile-page__level-verification__name">
                    <FormattedMessage id={`${text}.unverified.title`} />
                </p>
            );
        }
    }

    getLevelsClassNames(currentLevel, targetLevel) {
        const levelSatisfied = currentLevel >= targetLevel;
        const levelClassName = cn({
            "parent-profile-page__text-purple": levelSatisfied,
        });
        const titleClassName = cn("parent-profile-page__ml-gap", {
            "parent-profile-page__text-success": levelSatisfied,
        });
        return {
            levelClassName,
            titleClassName,
        };
    }
}

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
    label: selectLabelData(state),
    documents: selectDocumentsData(state),
});

const mapDispatchProps = (dispatch) => ({
    labelFetch: () => dispatch(labelFetch()),
    fetchDocuments: () => dispatch(fetchDocuments()),
});

const ProfileVerification = connect(
    mapStateToProps,
    mapDispatchProps
)(ProfileVerificationComponent);
export { ProfileVerification };
