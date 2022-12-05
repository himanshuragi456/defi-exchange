import * as React from "react";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import { ProfileAccountActivity } from "../ProfileAccountActivity";
import { ProfileApiKeys } from "../ProfileApiKeys";
import { ProfileAuthDetails } from "../ProfileAuthDetails";
import { ProfileVerification } from "../ProfileVerification";
import { ReferralProgram } from "../ReferralProgram"; // import { ProfileTiers } from '../ProfileTiers';

class ProfileComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.goBack = () => {
            this.props.history.goBack();
        };
    }

    render() {
        return (
            <div className="parent-container parent-profile-page">
                <div className="parent-profile-page__details">
                    <div className="parent-profile-page-header">
                        <h3 className="parent-profile-page__text-purple">
                            <FormattedMessage id="page.body.profile.header.account" />
                        </h3>
                    </div>
                    <div className="parent-profile-page__details-box">
                        <div className="parent-profile-page__left-col">
                            <ProfileAuthDetails />
                        </div>
                        <div className="parent-profile-page__right-col">
                            <ProfileVerification />
                        </div>
                    </div>
                    <ReferralProgram />
                </div>
                <ProfileApiKeys />
                <ProfileAccountActivity />
            </div>
        );
    }
}

const Profile = withRouter(ProfileComponent);
export { Profile };
