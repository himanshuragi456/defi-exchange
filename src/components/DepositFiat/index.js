import * as React from "react";
import {bankData} from "../../api";
import {useMemo} from "react";

/**
 * Component to display bank account details which can be used for a
 * deposit
 */

const DepositFiat = (props) => {
    const { description, title, depositEnabledText,
        depositEnabled,
        enabledText,
        disabledText,
        depositFeeText,
        depositFee,
        minDepositAmountText,
        minDepositAmount,
        referenceCodeText, currency, uid, renderProof } = props;


    const renderAlertObject = (obj) => {
        return (
            <p className={`alert ${obj.class}`}>
                {obj.key !== '' ? `${obj.key}: ` : null}{obj.value}
            </p>
        );
    };

    const renderDetails = (detail, index) => {
        return (
            <div className="base-deposit-fiat-detail" key={index}>
                <p className="base-deposit-fiat-detail__label">{detail.key}:</p>
                <p className="base-deposit-fiat-detail__value">
                    {detail.value}
                </p>
            </div>
        );
    };



    const renderStringObject = (obj) => {
        return (
            <div className={'d-flex'}>
                <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold'}>
                    {/*{keyTranslate(key)}&nbsp;:*/}
                    {obj.key}:&nbsp;
                </p>
                <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold'}>
                    {obj.value}
                </p>
            </div>
        );
    };

    const bankDataValues = useMemo(() => {
        return bankData(currency) ? bankData(currency) : bankData('default');
    }, [currency])
    const walletToken = useMemo(() => {
        try {
            return bankDataValues.find((bd) => bd.key === 'Wallet Token').value;
        } catch (e) {
            return undefined
        }
    }, [bankDataValues])

    return (
        <div className="base-deposit-fiat">
            <p className="base-deposit-fiat__title">{title}</p>
            <p className="base-deposit-fiat__description">{description}</p>
            <div className="features-list deposit-fiat__bank-details">
                {
                    (bankData(currency) ? bankData(currency) : bankData('default')).map(obj => {
                        switch (obj.type.toLowerCase()) {
                            case 'alert': return renderAlertObject(obj);
                            default: return;
                        }

                        return <></>;
                    })
                }
                <div className={'d-flex'}>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold'}>
                        {depositEnabledText}:
                    </p>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold ml-1'}>
                        <span className={`badge ${depositEnabled ? 'badge-success' : 'badge-danger'}`}>
                            {depositEnabled ? enabledText : disabledText}
                        </span>
                    </p>
                </div>
                <div className={'d-flex'}>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold'}>
                        {depositFeeText}:
                    </p>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold ml-1'}>
                        {depositFee}
                    </p>
                </div>
                <div className={'d-flex'}>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold'}>
                        {minDepositAmountText}:
                    </p>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold ml-1'}>
                        {minDepositAmount}
                    </p>
                </div>
                <div className={'d-flex'}>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold'}>
                        {referenceCodeText}:
                    </p>
                    <p className={'form-desc mb-1 pb-0 border-bottom-0 font-weight-bold ml-1'}>
                        {uid}{walletToken ? `-${walletToken}` : ''}
                    </p>
                </div>
                {
                    depositEnabled ? (
                        (bankDataValues).map(obj => {
                            switch (obj.type.toLowerCase()) {
                                case 'string': return renderStringObject(obj);
                                default: return;
                            }

                            return ;
                        })
                    ) : <></>
                }
            </div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={renderProof}>
                    Submit Proof of Payment
                </button>
            </div>
        </div>
    );
};

export { DepositFiat };
