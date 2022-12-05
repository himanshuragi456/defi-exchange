import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  selectWallets,
  walletsFetch,
  selectUserInfo,
  selectMarkets,
  marketsFetch,
  selectMarketTickers,
  orderExecuteFetch,
  selectUserLoggedIn, marketsTickersFetch, rootHistorySaga
} from "../../modules";
import { selectCurrentMarket } from '../../modules/public/markets';
import { selectCurrencies } from "../../modules/user/beneficiaries/selectors";
import { currenciesFetch } from "../../modules/user/beneficiaries";
import { Dropdown } from "react-bootstrap";
import { estimateUnitValue } from "../../helpers";
import usdt from "../../assets/images/coins/USDT.svg"
import { ClipLoader } from "react-spinners";
import LoginModal from "../../containers/LoginModal";
import { Modal } from "../../components";

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.translate = (id) => this.props.intl.formatMessage({ id });
    this.state = {
      fromCurrency: "btc",
      toCurrency: "usdt",
      convertAmt: '',
      searchCurrency: '',
      showModal: false,
      preview: false,
    };

    this.handleSubmit = (market, type, amount) => {
      const { fromCurrency, toCurrency } = this.state;

      const resultData = {
        market: market?.id,
        side: type,
        volume: amount,
        ord_type: 'market',
      };
      console.log("ORD", resultData);
      this.props.orderExecute(resultData);
      this.setState({
        convertAmt: '',
        // amount: 0,
      });
    };
  }

  componentDidMount() {
    this.props.fetchWallets();
    this.props.fetchCurrencies();
    this.props.marketsFetch();
    this.props.marketsTickersFetch();

    const { currentMarket } = this.props;

    if (currentMarket) {
      this.setState({
        fromCurrency: currentMarket?.base_unit,
        toCurrency: currentMarket?.quote_unit
      })
    }

  }

  componentWillReceiveProps(next) {
    if (next.currentMarket && !this.props.currentMarket) {
      this.setState({
        fromCurrency: next.currentMarket?.base_unit,
        toCurrency: next.currentMarket?.quote_unit
      })
    }
  }

  render() {
    console.log("base", this.state.fromCurrency, "quote", this.state.toCurrency);
    const { currencies, markets, marketTickers, wallets } = this.props;
    const { toCurrency, fromCurrency } = this.state;

    const convertValue = this.state.convertAmt;

    const max = wallets?.find(w => w.currency === fromCurrency)
    const quoteBalance = wallets?.find(w => w.currency === toCurrency)

    const CryptoIcon = (value) => {
      return currencies.find(w => w.id === value)?.icon_url
    }

    const totalEstimatedValue = estimateUnitValue(
      toCurrency,
      fromCurrency,
      convertValue,
      currencies,
      markets,
      marketTickers
    );
    const estimateValue = estimateUnitValue(
      toCurrency,
      fromCurrency,
      1,
      currencies,
      markets,
      marketTickers
    );
    const inverseValue = estimateUnitValue(
      fromCurrency,
      toCurrency,
      1,
      currencies,
      markets,
      marketTickers
    );

    const convertMarket = markets.find(m => {
      return (m.base_unit === fromCurrency || m.quote_unit === fromCurrency) && (m.base_unit === toCurrency || m.quote_unit === toCurrency)
    })

    if (!convertMarket || !markets)
      return React.createElement(
        "div",
        {
          className: "d-flex justify-content-center align-items-center w-100",
          style: { height: "calc(100vh - 50px)" }
        },
        React.createElement(ClipLoader, {
          sizeUnit: "px",
          size: 35,
          loading: true,
          color: "var(--accent)",
        })
      );

    const orderSide = convertMarket.base_unit === fromCurrency ? "sell" : "buy";

    const modalHeader = () => {
      return (
        <div className='d-flex justify-content-start'>
          <h1 style={{ fontSize: "16px" }}>Confirm</h1>
        </div>
      )
    }

    const modalBody = () => {
      return (
        <>
          <div className="mb-5 payment" style={{ color: "#fff" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <img width={35} src={this.state.fromCurrency === "usdt" ? usdt : CryptoIcon(this.state.fromCurrency)} />
                <h2 className="ml-2">{this.state.convertAmt}</h2>
              </div>
              <div>
                <h2 className="text-uppercase">{this.state.fromCurrency}</h2>
              </div>
            </div>
            <div className="my-2" style={{ fontSize: "1.5rem" }}>
              <i class="fas fa-long-arrow-alt-down mx-3"></i>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <img width={35} src={this.state.toCurrency === "usdt" ? usdt : CryptoIcon(this.state.toCurrency)} />
                <h2 className="ml-2">
                  {totalEstimatedValue.slice(0, totalEstimatedValue.length - 3)}
                </h2>
              </div>
              <div>
                <h2 className="text-uppercase">{this.state.toCurrency}</h2>
              </div>
            </div>
          </div>
          <div style={{ color: "#fff" }}>
            <div className="d-flex justify-content-between mb-2">
              <label className="font-weight-light">Rate:</label>
              <span className="mb-0 font-weight-bold">
                1 {fromCurrency.toUpperCase()} ≈{" "}
                {estimateValue} {toCurrency.toUpperCase()}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <label className="font-weight-light">Inverse Rate:</label>
              <span className="mb-0 font-weight-bold">
                1 {toCurrency.toUpperCase()} ≈{" "}
                {inverseValue} {fromCurrency.toUpperCase()}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <label className="font-weight-light">Payment Method:</label>
              <span className="mb-0 font-weight-bold">Spot Wallet</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <label className="font-weight-light">Transaction Fees:</label>
              <span className="mb-0 font-weight-bold">No Fees</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <label className="font-weight-light">You Will Receive:</label>
              <label className="font-weight-bold">{totalEstimatedValue}</label>
            </div>
          </div>
        </>
      )
    }

    const modalFooter = () => {
      return (
        <div className='d-flex justify-content-center flex-wrap flex-column-reverse flex-md-row mb-5 mt-3'>
          <button
            onClick={() => this.setState({ preview: !this.state.preview })}
            className='btn m-2 text-center'
          >
            Back
          </button>
          <button
            className='btn btn-wenbit m-2 text-center font-weight-bold'
            onClick={() => this.handleSubmit(convertMarket, orderSide, orderSide === "sell" ? convertValue : totalEstimatedValue)}
          >
            Convert
          </button>
        </div>
      )
    }

    return (
      <div className="convert-page py-5">
        <div className="text-center mx-auto pb-0 pb-md-4 title position-relative">
          <h1 style={{ fontSize: "44px" }} className="font-weight-normal">Wenbit Convert</h1>
          <button className="btn btn-wenbit history font-weight-bold" style={{ fontSize: "12px" }} onClick={() => this.props.history.push('/convert-history')}>
            Conversion History <i class="fas fa-long-arrow-alt-right mx-2"></i>
          </button>
        </div>
        <div className="card mb-4 mt-4 mb-md-0 mx-auto">
          <div className="convert-wrapper my-3 my-md-5">
            <div className="btn-wenbit rounded py-2 w-25 text-center" style={{ fontSize: "16px" }}><span className="font-weight-bold">Market</span></div>
            <div className="p-2 my-2 my-md-4 text-right font-weight-normal" style={{ fontSize: "14px" }}>
              <i class="fas fa-wallet mx-2"></i> <span>Spot Wallet</span>
            </div>
            <div className="input-wrapper w-100 p-3">
              <label className="d-flex justify-content-between">
                <span>From</span>
                <span>Balance: {max?.balance || 0}</span>
              </label>
              <div className="d-flex input-box align-items-center pt-2">
                <input
                  className="form-control pl-0 pb-0 input-from"
                  type="number"
                  placeholder="0.00"
                  value={convertValue}
                  onChange={e => this.setState({ convertAmt: e.target.value })}
                />
                {/* <span
                  className="py-2 pr-4 max"
                  style={{cursor: "pointer"}}
                  onClick={() => {
                    this.setState({convertAmt: max?.balance || 0})
                  }}>Max</span> */}
                <Dropdown>
                  <Dropdown.Toggle id="convert-dropdown">
                    <div className="d-flex align-items-center c-list">
                      <div style={{ width: '29px', height: "29px" }} className="mx-2 overflow-hidden">
                        <img
                          src={fromCurrency === "usdt" ? usdt : CryptoIcon(fromCurrency)}
                          alt={`${fromCurrency}`}
                        />
                      </div>
                      <div className="text-uppercase mx-1 font-weight-bold">
                        {fromCurrency}
                      </div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: "200px", overflow: "auto" }}>
                    <div className="m-2">
                      <input
                        placeholder="Search"
                        className="form-control search py-2"
                        onChange={(e) => this.setState({ searchCurrency: e.target.value })}
                      />
                    </div>
                    {currencies.filter(c => {
                      const market = markets.find(m => {
                        return (m.base_unit === c.id || m.quote_unit === c.id) && (m.base_unit === this.state.toCurrency || m.quote_unit === this.state.toCurrency)
                      })
                      if (!market) return false;
                      return (this.state.searchCurrency !== "" ? c.id.toLowerCase().includes(this.state.searchCurrency.toLowerCase()) : true) && !c.id.toLowerCase().includes(this.state.toCurrency)
                    }).map((v) => {

                      const symbol = v.id
                      return (
                        <Dropdown.Item
                          key={v.id}
                          className="d-flex align-items-center"
                          onClick={() => {
                            this.setState({ fromCurrency: v.id })
                          }}
                        >
                          <div style={{ width: '29px', height: "29px" }} className="mx-2">
                            <img
                              src={symbol === "usdt" ? usdt : CryptoIcon(symbol)}
                              alt={`${symbol}`}
                            />
                          </div>
                          <div className="text-uppercase mx-2">{symbol}</div>
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="w-100 py-3 py-md-5 text-center">
              <i
                className="fas fa-exchange-alt"
                style={{ cursor: "pointer" }}
                onClick={() => this.setState({
                  fromCurrency: this.state.toCurrency,
                  toCurrency: this.state.fromCurrency,
                })}
              ></i>
            </div>
            <div className="input-wrapper w-100 p-3">
              <label className="d-flex justify-content-between">
                <span>To</span>
                <span>Balance: {quoteBalance?.balance || 0}</span>
              </label>
              <div className="d-flex input-box align-items-center pt-2">
                <input
                  className="form-control pl-0 input-from"
                  type="number"
                  placeholder="0.0000"
                  value={totalEstimatedValue || 0}
                />
                <Dropdown>
                  <Dropdown.Toggle id="convert-dropdown">
                    <div className="d-flex align-items-center c-list">
                      <div style={{ width: '29px', height: "29px" }} className="mx-2 overflow-hidden">
                        <img
                          src={toCurrency === "usdt" ? usdt : CryptoIcon(toCurrency ? toCurrency : "usdt")}
                          alt={`${toCurrency}`}
                        />
                      </div>
                      <div className="text-uppercase mx-1 mx-md-2 font-weight-bold">
                        {toCurrency ? toCurrency : "usdt"}
                      </div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: "200px", overflow: "auto" }}>
                    {currencies.filter(c => {
                      const arr = [c.id.toLowerCase(), c.name.toLowerCase()];
                      const market = markets.find(m => {
                        return (m.base_unit === c.id || m.quote_unit === c.id) && (m.base_unit === this.state.fromCurrency || m.quote_unit === this.state.fromCurrency)
                      })
                      if (!market) return false;
                      return !arr.includes(this.state.fromCurrency)
                    }).map((v) => {

                      const symbol = v.id
                      return (
                        <Dropdown.Item
                          key={symbol}
                          className="d-flex align-items-center"
                          onClick={() => {
                            this.setState({ toCurrency: symbol })
                          }}
                        >
                          <div style={{ width: '29px', height: "29px" }} className="mx-2">
                            <img
                              src={symbol === "usdt" ? usdt : CryptoIcon(symbol)}
                              alt={`${symbol}`}
                            />
                          </div>
                          <div className="text-uppercase mx-2">{symbol.toUpperCase()}</div>
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="w-100 mt-5">
              <button
                className="btn btn-convert w-100 py-3 mb-5 mb-md-0 d-block text-center font-weight-bold"
                style={{ fontSize: "14px" }}
                disabled={!this.state.convertAmt}
                onClick={() => {
                  if (this.props.userLoggedIn) {
                    this.setState({ preview: true })
                  } else {
                    this.setState({ showModal: true })
                  }
                }}
              >
                Preview Conversion
              </button>
            </div>
          </div>
        </div>
        <LoginModal
          show={this.state.showModal}
          hide={() => this.setState({ showModal: !this.state.showModal })}
        />
        <Modal
          show={this.state.preview}
          header={modalHeader()}
          content={modalBody()}
          footer={modalFooter()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  wallets: selectWallets(state),
  currencies: selectCurrencies(state),
  user: selectUserInfo(state),
  marketTickers: selectMarketTickers(state),
  markets: selectMarkets(state),
  currentMarket: selectCurrentMarket(state),
  userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchWallets: () => dispatch(walletsFetch()),
  fetchCurrencies: () => dispatch(currenciesFetch()),
  marketsFetch: () => dispatch(marketsFetch()),
  marketsTickersFetch: () => dispatch(marketsTickersFetch()),
  orderExecute: payload => dispatch(orderExecuteFetch(payload)),
});

export const ConverterScreen = injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(Converter))
);