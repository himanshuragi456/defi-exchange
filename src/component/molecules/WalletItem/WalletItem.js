import * as React from "react";
import { CryptoIcon } from "../../atoms";

const style = {
    display: "flex",
    justifyContent: "space-between",
};

const renderLocked = (lockedAmount) => {
    return lockedAmount ? (
        <div className="base-wallet-item__amount-locked">
            Locked: {lockedAmount}
        </div>
    ) : (
        ""
    );
};
/**
 * Component for displaying information about wallet, including address and amount of currency.
 */

const WalletItem = (props) => {
    const { currency, balance, locked, active } = props;
    const cName = `base-wallet-item ${
        active ? "base-wallet-item--active" : ""
    }`;
    return (
        <div style={style} className={cName}>
            <div>
                <CryptoIcon
                    className="base-wallet-item__icon"
                    code={currency.toUpperCase()}
                />
                <span className="base-wallet-item__icon-code"> {currency}</span>
            </div>
            <span className="base-wallet-item__balance">
                {balance}
                <span className="base-wallet-item__currency">{currency}</span> 
                <span className="base-wallet-item__balance-locked">
                    {renderLocked(locked)}
                </span>
            </span>
        </div>
    );
};

export { WalletItem };
