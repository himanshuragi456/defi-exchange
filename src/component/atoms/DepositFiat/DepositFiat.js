import * as React from "react";

/**
 * Component to display bank account details which can be used for a
 * deposit
 */

class DepositFiat extends React.PureComponent {
    constructor() {
        super(...arguments);

        this.renderDetail = (detail, index) => {
            return (
                <div className="base-deposit-fiat-detail" key={index}>
                    <p className="base-deposit-fiat-detail__label">{`${detail.key}:`}</p>
                    <p className="base-deposit-fiat-detail__value">
                        {detail.value}
                    </p>
                </div>
            );
        };
    }

    render() {
        const { data, description, title } = this.props;
        return (
            <div className="base-deposit-fiat">
                <p className="base-deposit-fiat__title">{title}</p>
                <p className="base-deposit-fiat__description">{description}</p>
                <div className="base-deposit-fiat-credentials">
                    {data.map(this.renderDetail)}
                </div>
            </div>
        );
    }
}

export { DepositFiat };
