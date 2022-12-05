import { Alert } from "@components/components";
import * as React from "react";
import FadeIn from "react-fade-in";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
    alertDelete,
    alertDeleteByIndex,
    selectAlertState,
} from "../../modules";

class AlertComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.deleteAlertByIndex = (key) => {
            this.props.alertDeleteByIndex(key);
        };

        this.translate = (id) => {
            return id
                ? this.props.intl.formatMessage({
                      id,
                  })
                : "";
        };
    }

    render() {
        return (
            <div className="parent-alerts">
                {this.props.alerts.alerts.map((w) => {
                    if (!w.message) return;
                    return w.message.map((msg, index) => (
                        <FadeIn key={index}>
                            <div onClick={() => this.deleteAlertByIndex(index)}>
                                <Alert
                                    title={this.translate(msg)}
                                    type={w.type}
                                />
                            </div>
                        </FadeIn>
                    ));
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    alerts: selectAlertState(state),
});

const mapDispatchToProps = (dispatch) => ({
    alertDelete: () => dispatch(alertDelete()),
    alertDeleteByIndex: (payload) => dispatch(alertDeleteByIndex(payload)),
});

export const Alerts = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(AlertComponent)
);
