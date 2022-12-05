import { Button } from "@components/components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

class ProfileTwoFactorAuthComponent extends React.Component {
    constructor(props) {
        super(props);

        this.handleToggle2fa = () => {
            this.props.navigateTo2fa(!this.state.is2faEnabled);
        };

        this.state = {
            is2faEnabled: props.is2faEnabled,
        };
    }

    render() {
        const { is2faEnabled } = this.state;
        const { title, description } = this.props;
        return (
            <div className="content-area card">
                <div className="card-innr">
                    <div className="card-head">
                        <h4 className="card-title">{title}</h4>
                    </div>
                    <span>
                        <FormattedMessage id="page.profile.2faDescription" />
                    </span>
                    <div
                        className="d-sm-flex justify-content-between align-items-center pdt-1-5x two-factor-auth"
                        style={
                            {
                                // flexDirection: "column",
                                // display: "flex",
                            }
                        }
                    >
                        <span className="ucap d-inline-flex align-items-center mobile-auth">
                            <span className="mb-0">
                                <span
                                    style={{
                                        fontWeight: 400,
                                    }}
                                >
                                    <FormattedMessage id="page.profile.currentStatus" />
                                </span>
                            </span>{" "}
                            <span
                                className={
                                    is2faEnabled === true
                                        ? "badge ml-2 badge-success"
                                        : "badge ml-2 badge-danger"
                                }
                            >
                                {is2faEnabled ? (
                                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.enable" />
                                ) : (
                                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.disable" />
                                )}
                            </span>
                        </span>
                        <div className="gaps-2x d-sm-none" />
                        {is2faEnabled === false && (
                            <Button
                                className="order-sm-first btn btn-primary enable_2fa__button"
                                onClick={this.props.navigateTo2fa}
                                label={this.props.intl.formatMessage({
                                    id: "page.body.wallets.tabs.withdraw.content.enable2faButton",
                                })}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export const ProfileTwoFactorAuth = injectIntl(ProfileTwoFactorAuthComponent);
