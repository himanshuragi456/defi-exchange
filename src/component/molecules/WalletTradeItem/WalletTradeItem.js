import classnames from "classnames";
import * as React from "react";
import { CryptoIcon } from "../../atoms";

/**
 * Component for displaying information about wallet, including address and amount of currency.
 */

const WalletTradeItem = (props) => {
    const { className, currency, balance } = props;
    const cx = classnames("base-wallet-trades-item", className);
    const currencyCode = `${currency.toUpperCase()}-alt`;
    return (
        <div className={cx}>
            <div className="base-wallet-trades-item__body">
                <div className="base-wallet-trades-item__body-crypto">
                    <CryptoIcon
                        className="base-wallet-trades-item__body-crypto-icon"
                        code={currencyCode}
                    />
                </div>
                <div className="base-wallet-trades-item__body-data">
                    <div className="base-wallet-trades-item__body-data-currency">
                        {currency.toUpperCase()}
                    </div>
                    <div className="base-wallet-trades-item__body-data-balance">
                        {balance}
                    </div>
                </div>
            </div>
            <div className="base-wallet-trades-item__arrow">
                <img src={iconRight} />
            </div>
        </div>
    );
};

export { WalletTradeItem };
