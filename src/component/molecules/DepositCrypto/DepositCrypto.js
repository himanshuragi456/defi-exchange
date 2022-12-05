import * as React from "react";
import { CopyableTextField } from "../../atoms";
import { QRCode } from "../QRCode/QRCode";

const DepositInfo = (props) => {
    return <p className="base-deposit-info">{props.data}</p>;
};

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */

class DepositCrypto extends React.Component {
    render() {
        const { data, dimensions = "lg", error, text } = this.props;
        return (
            <div className="base-deposit-crypto">
                <div>
                    <DepositInfo data={text} />
                    <form className="base-deposit-crypto__copyable">
                        <fieldset className="base-copyable-text-field">
                            <legend className="base-deposit-crypto__copyable-title">
                                Deposit by Wallet Address
                            </legend>
                            {data ? (
                                <CopyableTextField
                                    className="base-deposit-crypto__copyable-area"
                                    value={data}
                                    fieldId="copy_deposit_1"
                                />
                            ) : (
                                <CopyableTextField
                                    className="base-deposit-crypto__copyable-area"
                                    fieldId="copy_deposit_2"
                                    value={error}
                                />
                            )}
                        </fieldset>
                    </form>
                </div>
                <div>
                    <QRCode dimensions={dimensions} data={data} />
                </div>
            </div>
        );
    }
}

export { DepositInfo, DepositCrypto };
