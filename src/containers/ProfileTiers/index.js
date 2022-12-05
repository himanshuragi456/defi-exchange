import { Button } from "@components/components";
import * as React from "react";
import { connect } from "react-redux";
import { selectUserInfo } from "../../modules";
import {
    selectTiersData,
    selectTiersDisabled,
    selectTiersError,
    tiersFetch,
} from "../../modules/user/profile";

class ProfileTiersComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.handleEnablePayFees = () => {
            // todo: implement
        };
    }

    componentWillReceiveProps(next) {
        const currentUID = this.props.user.uid;
        const isUserLoaded = !!currentUID || currentUID.length > 0;

        if (next.user.uid && !isUserLoaded) {
            this.props.tiers({
                uid: next.user.uid,
                currency: "btc",
            });
        }
    }

    render() {
        const { tier, tiersDisabled, error } = this.props;

        if (tiersDisabled) {
            return null;
        }

        return (
            <div className="parent-profile-page__box parent-profile-page__right-col__token">
                <div className="parent-profile-page__box-header">
                    <h3>
                        <span className="parent-profile-page__text-purple">
                            Exchange token
                        </span>{" "}
                        holder incentives
                    </h3>
                </div>
                <div className="parent-profile-page__row parent-profile-page__pb-gap-6">
                    <h1 className="parent-profile-page__text-purple">
                        {tier.min_holding}
                        <span className="parent-profile-page__currency">
                            Exchange
                        </span>
                    </h1>
                </div>
                <div className="parent-profile-page__row">
                    {error
                        ? this.renderError(error.message)
                        : this.renderTier(tier)}
                </div>
                <div className="parent-profile-page__row">
                    <div className="parent-profile-page__col">
                        <label>Use Exchange to pay trading fee</label>
                    </div>
                    <div className="parent-profile-page__col">
                        <Button
                            className="parent-profile-page__btn-secondary"
                            onClick={this.handleEnablePayFees}
                            label="Off"
                        />
                        <div className="parent-profile-page__vertical-line" />
                        <Button
                            className="parent-profile-page__btn-secondary parent-profile-page__btn-secondary__active"
                            onClick={this.handleEnablePayFees}
                            label="Enable"
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderError(message) {
        return <span className="parent-profile-page__error">{message}</span>;
    }

    renderTier(tier) {
        return (
            <div className="parent-profile-page-tiers">
                <p className="parent-profile-page-tiers__detail">
                    <span className="parent-profile-page-tiers__detail-data">
                        {tier.color}
                    </span>
                    <span className="parent-profile-page-tiers__detail-title">
                        Exchange Tier grant you the following incentives
                    </span>
                </p>
                <p className="parent-profile-page-tiers__detail">
                    <span className="parent-profile-page-tiers__detail-data">{`${tier.fee_discount}%`}</span>
                    <span className="parent-profile-page-tiers__detail-title">
                        Discount on trading fee
                    </span>
                </p>
                <p className="parent-profile-page-tiers__detail">
                    <span className="parent-profile-page-tiers__detail-data">
                        20
                    </span>
                    <span className="parent-profile-page-tiers__detail-title">
                        Token survey points
                    </span>
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
    tier: selectTiersData(state),
    error: selectTiersError(state),
    tiersDisabled: selectTiersDisabled(state),
});

const mapDispatchToProps = (dispatch) => ({
    tiers: ({ uid, currency }) =>
        dispatch(
            tiersFetch({
                uid,
                currency,
            })
        ),
});

const ProfileTiers = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileTiersComponent);
export { ProfileTiers };
