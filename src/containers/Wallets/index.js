import {
    Button,
    Decimal,
    DepositCrypto,
    DepositFiat,
    FilterInput,
    TabPanel,
    WalletList,
} from "@components/components";
import classnames from "classnames";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { alertPush, selectHistory, selectUserInfo } from "../../modules";
import {
    selectWallets,
    selectWalletsAddressError,
    selectWalletsLoading,
    selectWithdrawSuccess,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
} from "../../modules/user/wallets";
import { ModalWithdrawConfirmation } from "../ModalWithdrawConfirmation";
import { ModalWithdrawSubmit } from "../ModalWithdrawSubmit";
import { Withdraw } from "./Withdraw";
import { WalletHistory } from "./History";
import { rangerConnectFetch } from "../../modules/public/ranger";

class WalletsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.translate = (id) =>
            this.props.intl.formatMessage({
                id,
            });

        this.bankData = [
            {
                key: this.translate(
                    "page.body.wallets.tabs.deposit.fiat.bankName"
                ),
                value: "Diamant Bank",
            },
            {
                key: this.translate(
                    "page.body.wallets.tabs.deposit.fiat.accountNumber"
                ),
                value: "10120212",
            },
            {
                key: this.translate(
                    "page.body.wallets.tabs.deposit.fiat.accountName"
                ),
                value: "name",
            },
            {
                key: this.translate(
                    "page.body.wallets.tabs.deposit.fiat.phoneNumber"
                ),
                value: "+3 8093 1212 12 12",
            },
            {
                key: this.translate(
                    "page.body.wallets.tabs.deposit.fiat.referenceCode"
                ),
                value: "8374982374",
            },
        ];
        this.title = this.translate(
            "page.body.wallets.tabs.deposit.fiat.message1"
        );
        this.description = this.translate(
            "page.body.wallets.tabs.deposit.fiat.message2"
        );

        this.onTabChange = (index, label) =>
            this.setState({
                tab: label,
            });

        this.toggleSubmitModal = () => {
            this.setState((state) => ({
                withdrawSubmitModal: !state.withdrawSubmitModal,
                withdrawDone: true,
            }));
        };

        this.toggleConfirmModal = (
            amount,
            total,
            beneficiary_id,
            beneficiary_details,
            otpCode
        ) => {
            this.setState((state) => ({
                amount: amount ? amount : 0,
                beneficiary_id: beneficiary_id ? beneficiary_id : "",
                otpCode: otpCode ? otpCode : "",
                withdrawConfirmModal: !state.withdrawConfirmModal,
                total: total ? total : 0,
                beneficiary_details: beneficiary_details
                    ? beneficiary_details
                    : null,
            }));
        };

        this.handleFilter = (item, term) => {
            return this.consist(item.currency, term);
        };

        this.searchCallback = (value) => {
            this.setState({
                filteredWallets: value,
            });
        };

        this.handleWithdraw = () => {
            const { selectedWalletIndex, otpCode, amount, beneficiary_id } =
                this.state;

            if (selectedWalletIndex === -1) {
                return;
            }

            const { currency } = this.props.wallets[selectedWalletIndex];
            const withdrawRequest = {
                amount,
                currency: currency.toLowerCase(),
                otp: otpCode,
                beneficiary_id,
            };
            this.props.walletsWithdrawCcy(withdrawRequest);
            this.toggleConfirmModal();
        };

        this.renderSingle = () => {
            const { selectedWalletIndex } = this.state;
            const { wallets } = this.props;
            const balance = (
                wallets[selectedWalletIndex] || {
                    balance: 0,
                }
            ).balance;
            const lockedAmount = (
                wallets[selectedWalletIndex] || {
                    locked: 0,
                }
            ).locked;
            const currency = (
                wallets[selectedWalletIndex] || {
                    currency: "",
                }
            ).currency;
            const selectedFixed = (
                wallets[selectedWalletIndex] || {
                    fixed: 0,
                }
            ).fixed;
            const stringBalance = balance.toString();
            const stringLocked = lockedAmount
                ? lockedAmount.toString()
                : undefined;
            const formattedCurrency = currency.toUpperCase();
            const locked = (
                <div>
                    <div className="base-wallet-item__amount-locked">
                        <FormattedMessage id="page.body.wallets.locked" />
                    </div>
                    <span className="base-wallet-item__balance-locked">
                        <Decimal fixed={selectedFixed}>{stringLocked}</Decimal>
                    </span>
                </div>
            );
            const displayBalance = (
                <div>
                    <span className="base-wallet-item__balance">
                        {formattedCurrency}{" "}
                        {this.translate("page.body.wallets.balance")}
                    </span>
                    <span className="base-wallet-item__balance-amount">
                        <Decimal fixed={selectedFixed}>{stringBalance}</Decimal>
                    </span>
                </div>
            );
            return (
                <div className="base-wallet-item__single">
                    <span
                        className={`base-wallet-item__icon-code base-crypto-font-${formattedCurrency}`}
                    />
                    <div className="base-wallet-item__single-balance">
                        {locked}
                        {displayBalance}
                    </div>
                </div>
            );
        };

        this.handleOnCopy = () => {
            this.props.fetchSuccess({
                message: ["page.body.wallets.tabs.deposit.ccy.message.success"],
                type: "success",
            });
        };

        this.isOtpDisabled = () => {
            return (
                <React.Fragment>
                    <p className="parent-wallet__enable-2fa-message">
                        {this.translate(
                            "page.body.wallets.tabs.withdraw.content.enable2fa"
                        )}
                    </p>
                    <Button
                        className="parent-wallet__button-2fa"
                        label={this.translate(
                            "page.body.wallets.tabs.withdraw.content.enable2faButton"
                        )}
                        onClick={this.redirectToEnable2fa}
                    />
                </React.Fragment>
            );
        };

        this.redirectToEnable2fa = (e) => {
            this.props.history.push("/security/2fa", {
                enable2fa: true,
            });
        };

        this.onWalletSelectionChange = (value) => {
            if (
                !value.address &&
                !this.props.walletsLoading &&
                value.type !== "fiat"
            ) {
                this.props.fetchAddress({
                    currency: value.currency,
                });
            }

            const nextWalletIndex = this.props.wallets.findIndex(
                (wallet) =>
                    wallet.currency.toLowerCase() ===
                    value.currency.toLowerCase()
            );
            this.setState({
                selectedWalletIndex: nextWalletIndex,
                withdrawDone: false,
            });
        };

        this.state = {
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: "",
            amount: 0,
            beneficiary_id: "",
            beneficiary_details: null,
            tab: this.translate("page.body.wallets.tabs.deposit"),
            withdrawDone: false,
            total: 0,
        };
    }

    componentDidMount() {
        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        } else {
            this.props.fetchAddress({
                currency: this.props.wallets[0].currency,
            });
        }

        if (
            this.state.selectedWalletIndex === -1 &&
            this.props.wallets.length
        ) {
            this.setState({
                selectedWalletIndex: 0,
            });
        }
    }

    componentWillUnmount() {
        this.props.clearWallets();
    }

    componentWillReceiveProps(next) {
        if (this.props.wallets.length === 0 && next.wallets.length > 0) {
            this.setState({
                selectedWalletIndex: 0,
            });
            this.props.fetchAddress({
                currency: next.wallets[0].currency,
            });
            this.props.rangerConnect({
                withAuth: true,
            });
        }

        if (!this.props.withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }
    }

    render() {
        const { wallets, historyList } = this.props;
        const {
            total,
            beneficiary_id,
            beneficiary_details,
            selectedWalletIndex,
            filteredWallets,
            withdrawSubmitModal,
            withdrawConfirmModal,
        } = this.state;
        const formattedWallets = wallets.map((wallet) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : "",
        }));
        const maybeNoResults =
            filteredWallets && !filteredWallets.length ? "No results..." : null;
        const selectedCurrency = (
            wallets[selectedWalletIndex] || {
                currency: "",
            }
        ).currency;
        const maybeSelectedTab = selectedWalletIndex !== -1 && (
            <TabPanel
                panels={this.renderTabs(selectedWalletIndex)}
                onTabChange={this.onTabChange}
            />
        );
        return (
            <div className="parent-wallet parent-container">
                <FilterInput
                    filter={this.handleFilter}
                    onFilter={this.searchCallback}
                    data={formattedWallets}
                />
                <p className="parent-wallet__no-results">{maybeNoResults}</p>
                <div
                    className={`parent-wallet__tabs-content ${
                        !historyList.length &&
                        "parent-wallet__tabs-content-height"
                    }`}
                >
                    <WalletList
                        onWalletSelectionChange={this.onWalletSelectionChange}
                        walletItems={filteredWallets || formattedWallets}
                    />
                    <div className="parent-wallet__tabs">
                        {maybeSelectedTab}
                    </div>
                </div>
                <ModalWithdrawSubmit
                    show={withdrawSubmitModal}
                    currency={selectedCurrency}
                    onSubmit={this.toggleSubmitModal}
                />
                <ModalWithdrawConfirmation
                    show={withdrawConfirmModal}
                    amount={total}
                    currency={selectedCurrency}
                    beneficiary_id={beneficiary_id}
                    beneficiary_details={beneficiary_details}
                    onSubmit={this.handleWithdraw}
                    onDismiss={this.toggleConfirmModal}
                />
            </div>
        );
    }

    consist(a, b) {
        return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
    }

    renderTabs(walletIndex) {
        const { tab, withdrawDone } = this.state;

        if (walletIndex === -1) {
            return [
                {
                    content: null,
                    label: "",
                },
            ];
        }

        const {
            user: { level, otp },
            wallets,
        } = this.props;
        const wallet = wallets[walletIndex];
        const { currency, fee, type } = wallet;
        const fixed = (
            wallet || {
                fixed: 0,
            }
        ).fixed;
        const withdraw_limit_24h = (
            wallet || {
                withdraw_limit_24h: 0,
            }
        ).withdraw_limit_24h;
        const withdraw_limit_72h = (
            wallet || {
                withdraw_limit_72h: 0,
            }
        ).withdraw_limit_72h;
        const withdrawProps = {
            withdrawDone,
            currency,
            fee,
            withdraw_limit_24h,
            withdraw_limit_72h,
            onClick: this.toggleConfirmModal,
            borderItem: "empty-circle",
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
            fixed,
            withdrawAddressLabel: this.props.intl.formatMessage({
                id: "page.body.wallets.tabs.withdraw.content.address",
            }),
            withdrawAmountLabel: this.props.intl.formatMessage({
                id: "page.body.wallets.tabs.withdraw.content.amount",
            }),
            withdraw2faLabel: this.props.intl.formatMessage({
                id: "page.body.wallets.tabs.withdraw.content.code2fa",
            }),
            withdrawFeeLabel: this.props.intl.formatMessage({
                id: "page.body.wallets.tabs.withdraw.content.fee",
            }),
            withdrawTotalLabel: this.props.intl.formatMessage({
                id: "page.body.wallets.tabs.withdraw.content.total",
            }),
            withdrawButtonLabel: this.props.intl.formatMessage({
                id: "page.body.wallets.tabs.withdraw.content.button",
            }),
            withdrawAddressLabelPlaceholder: this.props.intl.formatMessage({
                id: "page.body.wallets.tabs.withdraw.content.addressPlaceholder",
            }),
        };
        return [
            {
                content:
                    tab === this.translate("page.body.wallets.tabs.deposit")
                        ? this.renderDeposit(wallet)
                        : null,
                label: this.translate("page.body.wallets.tabs.deposit"),
            },
            {
                content:
                    tab === this.translate("page.body.wallets.tabs.withdraw")
                        ? this.renderWithdraw(withdrawProps, type)
                        : null,
                label: this.translate("page.body.wallets.tabs.withdraw"),
            },
        ];
    }

    renderDeposit(wallet) {
        const { addressDepositError, wallets } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (
            wallets[selectedWalletIndex] || {
                currency: "",
            }
        ).currency;
        const text = this.props.intl.formatMessage({
            id: "page.body.wallets.tabs.deposit.ccy.message.submit",
        });
        const error = addressDepositError
            ? this.props.intl.formatMessage({
                  id: addressDepositError.message,
              })
            : this.props.intl.formatMessage({
                  id: "page.body.wallets.tabs.deposit.ccy.message.error",
              });
        const walletAddress =
            wallet.currency === "BCH" && wallet.address
                ? bch
                      .Address(wallet.address)
                      .toString(bch.Address.CashAddrFormat)
                : wallet.address || "";
        const className = classnames({
            "base-copyable-text-field__disabled": walletAddress === "",
        });

        if (wallet.type === "coin") {
            return (
                <React.Fragment>
                    {this.renderSingle()}
                    <div className={className}>
                        <DepositCrypto
                            data={walletAddress}
                            handleOnCopy={
                                walletAddress !== ""
                                    ? this.handleOnCopy
                                    : () => {}
                            }
                            error={error}
                            text={text}
                            copiableTextFieldText={this.translate(
                                "page.body.wallets.tabs.deposit.ccy.message.address"
                            )}
                            copyButtonText={this.translate(
                                "page.body.wallets.tabs.deposit.ccy.message.button"
                            )}
                        />
                    </div>
                    {currency && (
                        <WalletHistory
                            label="deposit"
                            type="deposits"
                            currency={currency}
                        />
                    )}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {this.renderSingle()}
                    <DepositFiat
                        title={this.title}
                        description={this.description}
                        data={this.bankData}
                    />
                    {currency && (
                        <WalletHistory
                            label="deposit"
                            type="deposits"
                            currency={currency}
                        />
                    )}
                </React.Fragment>
            );
        }
    }

    renderWithdraw(withdrawProps, type) {
        const { walletsError, user, wallets } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (
            wallets[selectedWalletIndex] || {
                currency: "",
            }
        ).currency;

        if (type === "fiat") {
            return (
                <div>
                    <p className="base-deposit-fiat__title">
                        {this.translate(
                            "page.body.wallets.tabs.deposit.fiat.admin"
                        )}
                    </p>
                    <p className="base-deposit-fiat__title">
                        {this.translate(
                            "page.body.wallets.tabs.deposit.fiat.email"
                        )}
                        : fund@auroratokens.com
                    </p>
                </div>
            );
        }

        return (
            <React.Fragment>
                {this.renderSingle()}
                {walletsError && (
                    <p className="parent-wallet__error">
                        {walletsError.message}
                    </p>
                )}
                {user.otp ? (
                    <Withdraw {...Object.assign({}, withdrawProps)} />
                ) : (
                    this.isOtpDisabled()
                )}
                {user.otp && currency && (
                    <WalletHistory
                        label="withdraw"
                        type="withdraws"
                        currency={currency}
                    />
                )}
            </React.Fragment>
        );
    }

    isTwoFactorAuthRequired(level, is2faEnabled) {
        return level > 1 || (level === 1 && is2faEnabled);
    }
}

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    addressDepositError: selectWalletsAddressError(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) =>
        dispatch(
            walletsAddressFetch({
                currency,
            })
        ),
    walletsWithdrawCcy: (params) => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    rangerConnect: (payload) => dispatch(rangerConnectFetch(payload)),
    fetchSuccess: (payload) => dispatch(alertPush(payload)),
});

export const Wallets = injectIntl(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent))
);
