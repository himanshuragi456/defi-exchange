import classNames from "classnames";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { accumulateVolume, calcMaxVolume, sortBids } from "../../helpers";
import {
    selectCurrentMarket,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthLoading,
    selectMarketTickers,
    selectOpenOrdersList,
    setCurrentPrice,
} from "../../modules";
import { Decimal } from "../../component/molecules/Decimal/Decimal";
import { CombinedOrderBooksComponent } from "../CombinedOrderBook";
import { Table } from "semantic-ui-react";
import ArrowDown from "./../../assets/images/arrow-down-red.svg";
import ArrowUp from "./../../assets/images/arrow-up-green.svg";
import {
    rangerSubscribeMarket,
    rangerUnsubscribeMarket,
} from "../../modules/public/ranger"; // render big/small breakpoint

const breakpoint = 449;

class OrderBookDesktopContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundPriceColor: "var(--color-red-opa)",
            priceArrow: ArrowDown,
        };
        /*========This function is not used in this page==========*/
        this.reverse = React.createRef();

        this.orderBook = (bids, asks) => {
            const isLarge = this.state.width >= breakpoint;
            const asksData = isLarge ? asks : asks.slice(0).reverse();
            return (
                <React.Fragment>
                    <div className="base-table-header__content">
                        {this.props.intl.formatMessage({
                            id: "page.body.trade.orderbook",
                        })}
                    </div>
                    <CombinedOrderBooksComponent
                        maxVolume={calcMaxVolume(bids, asks)}
                        orderBookEntryAsks={accumulateVolume(asks)}
                        orderBookEntryBids={accumulateVolume(bids)}
                        rowBackgroundColorAsks="rgba(232, 94, 89, 0.4)"
                        rowBackgroundColorBids="rgba(84, 180, 137, 0.4)"
                        dataAsks={this.renderOrderBook(
                            asksData,
                            "asks",
                            this.props.intl.formatMessage({
                                id: "page.noDataToShow",
                            }),
                            this.props.currentMarket
                        )}
                        dataBids={this.renderOrderBook(
                            bids,
                            "bids",
                            this.props.intl.formatMessage({
                                id: "page.noDataToShow",
                            }),
                            this.props.currentMarket
                        )}
                        headers={this.renderHeaders()}
                        lastPrice={this.lastPrice()}
                        onSelectAsks={this.handleOnSelectAsks}
                        onSelectBids={this.handleOnSelectBids}
                        isLarge={isLarge}
                    />
                </React.Fragment>
            );
        };

        this.lastPrice = () => {
            const { marketTickers, currentMarket } = this.props;
            const defaultTicker = {
                last: 0,
                price_change_percent: "+0.00%",
            };

            if (
                currentMarket &&
                marketTickers[currentMarket.id] &&
                marketTickers[currentMarket.id].price_change_percent
            ) {
                const cn = classNames("", {
                    "base-combined-order-book__market-negative": (
                        marketTickers[currentMarket.id] || defaultTicker
                    ).price_change_percent.includes("-"),
                    "base-combined-order-book__market-positive": (
                        marketTickers[currentMarket.id] || defaultTicker
                    ).price_change_percent.includes("+"),
                });
                return (
                    <React.Fragment>
                        <span
                            style={{
                                color: this.state.priceColor,
                            }}
                            className={cn}
                        >
                            {
                                // React.createElement('img', {
                                //     className: 'order-book-arrow',
                                //     src: this.state.priceArrow ? this.state.priceArrow : ''
                                // }),
                                Decimal.format(
                                    Number(
                                        (
                                            marketTickers[currentMarket.id] ||
                                            defaultTicker
                                        ).last
                                    ),
                                    currentMarket.price_precision
                                )
                            }{" "}
                        </span>
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <span className="base-combined-order-book__market-negative">
                            0
                        </span>
                    </React.Fragment>
                );
            }
        };

        this.renderHeaders = () => {
            return [
                this.props.intl.formatMessage({
                    id: "page.body.trade.orderbook.header.price",
                }),
                this.props.intl.formatMessage({
                    id: "page.body.trade.orderbook.header.amount",
                }),
                this.props.intl.formatMessage({
                    id: "page.body.trade.orderbook.header.volume",
                }),
            ];
        };

        this.updateUserOrdersState = (combinedOrders, type) => {
            let returnArray = {
                buy: [],
                sell: [],
            };

            _(combinedOrders).forEach(function (order) {
                order.side === "buy"
                    ? returnArray.buy.push(order.price)
                    : returnArray.sell.push(order.price);
            });

            this.setState({
                userOrders: returnArray,
            });
        };

        this.renderOrderBook = (array, side, message, currentMarket) => {
            let total = accumulateVolume(array);
            const isLarge = this.state.width > breakpoint;
            const priceFixed = currentMarket
                ? currentMarket.price_precision
                : 0;
            const amountFixed = currentMarket
                ? currentMarket.amount_precision
                : 0;
            return array.length > 0
                ? array.map((item, i) => {
                      const [price, volume] = item;
                      const shouldHighlight =
                          i === array.length - 1 && side === "asks"
                              ? true
                              : i === 0 && side === "bids"
                              ? true
                              : null;
                      const markExistingPriceClass =
                          side === "bids" &&
                          this.state.userOrders &&
                          _.includes(this.state.userOrders.buy, Number(price))
                              ? "mark_present_bid"
                              : side === "asks" &&
                                this.state.userOrders &&
                                _.includes(
                                    this.state.userOrders.sell,
                                    Number(price)
                                )
                              ? "mark_present_ask"
                              : "";
                      const textColor =
                          side === "bids"
                              ? " order-book-text-bids"
                              : " order-book-text-asks";
                      const index = array.length - i - 1;

                      switch (side) {
                          case "bids":
                              return [
                                  <span
                                      key={i}
                                      className={
                                          markExistingPriceClass + textColor
                                      }
                                  >
                                      <Decimal
                                          fixed={priceFixed}
                                          fromOrderBooks={true}
                                          shouldHighlight={shouldHighlight}
                                      >
                                          {price}
                                      </Decimal>
                                  </span>,
                                  <Decimal key={i} fixed={amountFixed}>
                                      {volume}
                                  </Decimal>,
                                  <Decimal
                                      key={i}
                                      fixed={amountFixed + priceFixed}
                                  >
                                      {total[i]}
                                  </Decimal>,
                              ];

                          default:
                              if (isLarge) {
                                  return [
                                      <Decimal
                                          key={i}
                                          fixed={amountFixed + priceFixed}
                                      >
                                          {total[i]}
                                      </Decimal>,
                                      <Decimal key={i} fixed={amountFixed}>
                                          {volume}
                                      </Decimal>,
                                      <span
                                          key={i}
                                          className={
                                              markExistingPriceClass + textColor
                                          }
                                      >
                                          <Decimal
                                              fixed={priceFixed}
                                              fromOrderBooks={true}
                                              shouldHighlight={shouldHighlight}
                                          >
                                              {price}
                                          </Decimal>
                                      </span>,
                                  ];
                              } else {
                                  total = accumulateVolume(
                                      array.slice(0).reverse()
                                  );
                                  return [
                                      <span
                                          key={i}
                                          className={
                                              markExistingPriceClass + textColor
                                          }
                                      >
                                          <Decimal
                                              fixed={priceFixed}
                                              fromOrderBooks={true}
                                              shouldHighlight={shouldHighlight}
                                          >
                                              {price}
                                          </Decimal>
                                      </span>,
                                      <Decimal key={i} fixed={amountFixed}>
                                          {volume}
                                      </Decimal>,
                                      <Decimal
                                          key={i}
                                          fixed={amountFixed + priceFixed}
                                      >
                                          {total[index]}
                                      </Decimal>,
                                  ];
                              }
                      }
                  })
                : [
                      [
                          [""],
                          <span className="order-book-no-data">{message}</span>,
                      ],
                  ];
        };

        this.handleRowWidth = (data, index) => {
            const { asks, bids } = this.props;

            const mapValues = (maxVolume, data) => {
                const resultData =
                    data && maxVolume && data.length
                        ? data.map((currentVolume) => {
                              // tslint:disable-next-line:no-magic-numbers
                              return {
                                  value: (currentVolume / maxVolume) * 100,
                              };
                          })
                        : [];
                return resultData.sort((a, b) => a.value - b.value);
            };

            const resultData = mapValues(
                calcMaxVolume(bids, asks),
                accumulateVolume(data)
            );
            if (resultData && resultData.length) return resultData[index].value;
        };

        this.renderOrderBookTable = (array, side, message, currentMarket) => {
            const { asks, bids } = this.props;
            const priceFixed = currentMarket
                ? currentMarket.price_precision
                : 0;
            const amountFixed = currentMarket
                ? currentMarket.amount_precision
                : 0;
            return array.length > 0
                ? array.map((item, i) => {
                      const [price, volume] = item;
                      const shouldHighlight =
                          i === array.length - 1 && side === "asks"
                              ? true
                              : i === 0 && side === "bids";
                      const markExistingPriceClass =
                          side === "bids" &&
                          this.state.userOrders &&
                          _.includes(this.state.userOrders.buy, Number(price))
                              ? "mark_present_bid"
                              : side === "asks" &&
                                this.state.userOrders &&
                                _.includes(
                                    this.state.userOrders.sell,
                                    Number(price)
                                )
                              ? "mark_present_ask"
                              : "";
                      const textColor =
                          side === "bids"
                              ? " order-book-text-bids"
                              : " order-book-text-asks";
                      const index = array.length - i - 1;

                      switch (side) {
                          case "bids":
                              return (
                                  <Table.Row
                                      style={{
                                          backgroundImage:
                                              "linear-gradient(var(--bids-bg-color),var(--bids-bg-color))",
                                          backgroundSize: `${this.handleRowWidth(
                                              bids,
                                              index
                                          )}% 100%`,
                                          backgroundPosition: "left",
                                          padding: "5px 0",
                                          backgroundRepeat: "no-repeat",
                                          display: "flex",
                                      }}
                                  >
                                      <Table.Cell
                                          width={6}
                                          style={{
                                              padding: "2px 16px",
                                              textAlign: "center",
                                              width: "33%",
                                              flex: 1,
                                              order: 2,
                                          }}
                                      >
                                          <span
                                              style={{
                                                  paddingRight: 0,
                                                  color: "var(--trading-page-table-data-color)",
                                              }}
                                          >
                                              <Decimal
                                                  fixed={amountFixed}
                                                  fromOrderBooks={true}
                                                  shouldHighlight={
                                                      shouldHighlight
                                                  }
                                              >
                                                  {volume}
                                              </Decimal>
                                          </span>
                                      </Table.Cell>
                                      <Table.Cell
                                          onClick={() =>
                                              this.handleOnSelectBids(index)
                                          }
                                          className={
                                              markExistingPriceClass + textColor
                                          }
                                          width={6}
                                          style={{
                                              padding: "2px 16px",
                                              textAlign: "center",
                                              cursor: "pointer",
                                              width: "33%",
                                              flex: 1,
                                          }}
                                      >
                                          <span
                                              style={{
                                                  paddingRight: 0,
                                                  color: "var(--color-green)",
                                              }}
                                              className={"order-book-positive"}
                                          >
                                              <Decimal
                                                  fixed={priceFixed}
                                                  fromOrderBooks={true}
                                                  shouldHighlight={
                                                      shouldHighlight
                                                  }
                                              >
                                                  {price}
                                              </Decimal>
                                          </span>
                                      </Table.Cell>
                                  </Table.Row>
                              );

                          default:
                              // total = accumulateVolume(array.slice(0).reverse());
                              return (
                                  <Table.Row
                                      style={{
                                          backgroundImage:
                                              "linear-gradient(var(--asks-bg-color),var(--asks-bg-color))",
                                          backgroundSize: `${this.handleRowWidth(
                                              asks,
                                              index
                                          )}% 100%`,
                                          padding: "5px 0",
                                          backgroundRepeat: "no-repeat",
                                          display: "flex",
                                      }}
                                  >
                                      <Table.Cell
                                          width={6}
                                          style={{
                                              padding: "2px 16px",
                                              textAlign: "center",
                                              width: "33%",
                                              flex: 1,
                                              order: 2,
                                          }}
                                      >
                                          <span
                                              style={{
                                                  paddingRight: 0,
                                                  color: "var(--trading-page-table-data-color)",
                                              }}
                                          >
                                              <Decimal
                                                  fixed={amountFixed}
                                                  fromOrderBooks={true}
                                                  shouldHighlight={
                                                      shouldHighlight
                                                  }
                                              >
                                                  {volume}
                                              </Decimal>
                                          </span>
                                      </Table.Cell>
                                      <Table.Cell
                                          onClick={() =>
                                              this.handleOnSelectAsks(index)
                                          }
                                          className={
                                              markExistingPriceClass + textColor
                                          }
                                          width={6}
                                          style={{
                                              padding: "2px 16px",
                                              textAlign: "center",
                                              cursor: "pointer",
                                              width: "33%",
                                              flex: 1,
                                          }}
                                      >
                                          <span
                                              style={{
                                                  paddingRight: 0,
                                                  color: "var(--color-red)",
                                              }}
                                              className={"order-book-negative"}
                                          >
                                              <Decimal
                                                  fixed={priceFixed}
                                                  fromOrderBooks={true}
                                                  shouldHighlight={
                                                      shouldHighlight
                                                  }
                                              >
                                                  {price}
                                              </Decimal>
                                          </span>
                                      </Table.Cell>
                                  </Table.Row>
                              );
                      }
                  })
                : [
                      [
                          [""],
                          <span className="order-book-no-data">{message}</span>,
                      ],
                  ];
        };

        this.handleOnSelectBids = (index) => {
            const { currentPrice, bids } = this.props;
            const isLarge = this.state.width >= breakpoint;
            const bidsData = isLarge ? bids : bids.slice(0).reverse();
            const priceToSet = bidsData[Number(index)]
                ? bidsData[Number(index)][0]
                : "";

            if (currentPrice !== priceToSet) {
                this.props.setCurrentPrice(priceToSet);
            }
        };

        this.handleOnSelectAsks = (index) => {
            const { currentPrice, asks } = this.props;
            const isLarge = this.state.width >= breakpoint;
            const asksData = isLarge ? asks : asks.slice(0).reverse();
            const priceToSet = asksData[Number(index)]
                ? asksData[Number(index)][0]
                : "";

            if (currentPrice !== priceToSet) {
                this.props.setCurrentPrice(priceToSet);
            }
        };

        this.state = {
            width: 0,
            userOrders: undefined,
            hasScrolled: false,
        };

        this.getTickerValue = (value) => {
            const { marketTickers, currentMarket } = this.props;
            const defaultTicker = {
                low: 0,
                last: 0,
                high: 0,
                vol: 0,
                price_change_percent: "+0.00%",
            };
            return (
                currentMarket &&
                (marketTickers[currentMarket.id] || defaultTicker)[value]
            );
        };

        this.orderRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.openOrderslist !== this.props.openOrderslist) {
            // updating state as new order is generated
            this.updateUserOrdersState(
                this.props.openOrderslist,
                this.props.type
            );
        }

        if(!this.state.hasScrolled && (prevProps.asks.length === 0 || prevProps.currentMarket.id !== this.props.currentMarket.id)) {
            this.reverse.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }

        if (
            this.orderRef.current &&
            this.state.width !== this.orderRef.current.clientWidth
        ) {
            this.setState({
                width: this.orderRef.current.clientWidth,
            });
        }

        const { marketTickers, currentMarket } = this.props;
        let prevMarketTickers = prevProps.marketTickers;
        let prevCurrentMarket = prevProps.currentMarket;
        const defaultTicker = {
            last: 0,
            price_change_percent: "+0.00%",
        };

        if (
            currentMarket &&
            marketTickers[currentMarket.id] &&
            marketTickers[currentMarket.id].last &&
            prevCurrentMarket &&
            prevMarketTickers[prevCurrentMarket.id] &&
            prevMarketTickers[prevCurrentMarket.id].last
        ) {
            if (currentMarket !== prevCurrentMarket) return;
            let prevLast = parseFloat(
                prevMarketTickers[prevCurrentMarket.id].last
            );
            let last = parseFloat(marketTickers[currentMarket.id].last);
            if (prevLast === last) return;

            if (last > prevLast) {
                this.setState({
                    priceColor: "var(--color-green)",
                    backgroundPriceColor: "var(--color-green-opa)",
                    priceArrow: ArrowUp,
                });
            } else if (last < prevLast) {
                this.setState({
                    priceColor: "var(--color-red)",
                    backgroundPriceColor: "var(--color-red-opa)",
                    priceArrow: ArrowDown,
                });
            }
        }

        if (currentMarket !== prevProps.currentMarket) {
            this.props.subscribeMarket(currentMarket);
            this.setState({hasScrolled: false});
        }
    }

    render() {
        const { bids, marketTickers, asks, currentMarket } = this.props;
        const defaultTicker = {
            last: 0,
            price_change_percent: "+0.00%",
        };
        let color = "var(--color-red-opa)";

        if (
            currentMarket &&
            marketTickers[currentMarket.id] &&
            marketTickers[currentMarket.id].price_change_percent
        ) {
            color = (
                marketTickers[currentMarket.id] || defaultTicker
            ).price_change_percent.includes("-")
                ? "var(--color-red-opa)"
                : "var(--color-green-opa)";
        }

        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        return (
            <div
                style={{
                    position: "relative",
                    height: "100%",
                    overflow: "hidden",
                }}
                className={"base-combined-order-book"}
            >
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            zIndex: 9,
                        }}
                        className="order-book-header"
                    >
                        <div
                            className="base-table-header__content"
                            style={{
                                zIndex: 9,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div className="base-title-component">
                                <FormattedMessage id="page.body.trade.orderbook" />
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            position: "relative",
                            height: "100%",
                        }}
                    >
                        <div
                            style={{
                                zIndex: 1,
                                position: "relative",
                                width: "100%",
                                display: "flex",
                                alignItems: "center", // background: "#131722"
                            }}
                        >
                            <Table
                                basic="very"
                                style={{
                                    padding: 0,
                                    margin: 0,
                                }}
                                unstackable
                            >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell
                                            width={3}
                                            style={{
                                                padding: "3.5px 12px",
                                                // color: "#BABEC9",
                                                color: "var(--table-subheader-text-color)",
                                                letterSpacing: "0.1px",
                                                textTransform: "uppercase",
                                                textAlign: "center",
                                                fontSize: "10px",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                background:
                                                    "var(--table-header-background)",
                                            }}
                                        >
                                            {this.props.intl.formatMessage({
                                                id: "page.body.trade.header.openOrders.content.price",
                                            })}
                                        </Table.HeaderCell>

                                        <Table.HeaderCell
                                            width={3}
                                            style={{
                                                padding: "3.5px 12px",
                                                // color: "#BABEC9",
                                                color: "var(--table-subheader-text-color)",
                                                letterSpacing: "0.1px",
                                                textTransform: "uppercase",
                                                fontSize: "10px",
                                                fontWeight: "700",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                background:
                                                    "var(--table-header-background)",
                                            }}
                                        >
                                            {this.props.intl.formatMessage({
                                                id: "page.body.trade.header.openOrders.content.amount",
                                            })}
                                        </Table.HeaderCell>

                                        {/* <Table.HeaderCell
                                           width={3}
                                           style={{
                                               padding: "3.5px 12px",
                                               // color: "#BABEC9",
                                               color: "var(--table-subheader-text-color)",
                                               letterSpacing: "0.1px",
                                               textTransform: "uppercase",
                                               fontSize: "10px",
                                               fontWeight: "700",
                                               textAlign: "center",
                                               cursor: "pointer",
                                               background: 'var(--table-header-background)',
                                           }}
                                        >
                                           {this.props.intl.formatMessage({id: 'page.body.trade.header.openOrders.content.price'})}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                           width={3}
                                           style={{
                                               padding: "3.5px 12px",
                                               // color: "#BABEC9",
                                               color: "var(--table-subheader-text-color)",
                                               letterSpacing: "0.1px",
                                               textTransform: "uppercase",
                                               textAlign: "center",
                                               fontSize: "10px",
                                               fontWeight: "700",
                                               cursor: "pointer",
                                               background: 'var(--table-header-background)',
                                           }}
                                        >
                                           {this.props.intl.formatMessage({id: 'page.body.trade.header.openOrders.content.amount'})}
                                        </Table.HeaderCell> */}
                                    </Table.Row>
                                </Table.Header>
                            </Table>
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                border: "1px solid var(--order-book-last-price-border)",
                                borderRight: "none",
                                borderLeft: "none",
                                left: "0",
                                width: "100%",
                                height: "100%", // backgroundColor: this.state.backgroundPriceColor || color,
                            }}
                            className={"base-order-book"}
                        >
                            {/* <div
                               style={{
                                   position: "absolute",
                                   width: "50%",
                                   height: "100%",
                                   right: 0,
                               }}
                            >
                               <Table
                                   basic="very"
                                   style={{
                                       padding: 0,
                                       margin: 0,
                                       color: "var(--table-header-color)",
                                       textAlign: "center",
                                   }}
                                   unstackable
                               >
                                   <Table.Body>
                                       {this.renderOrderBookTable(
                                           sortBids(asks),
                                           "ask",
                                           this.props.intl.formatMessage({
                                               id: "page.noDataToShow",
                                           }),
                                           this.props.currentMarket
                                       )}
                                   </Table.Body>
                               </Table>
                            </div> */}
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "45%",
                                    left: 0,
                                    overflow: "auto",
                                }}
                            >
                                <Table
                                    basic="very"
                                    style={{
                                        padding: 0,
                                        margin: 0,
                                        color: "var(--table-header-color)",
                                        textAlign: "center",
                                    }}
                                    unstackable
                                    onScroll={() => {
                                        this.setState({hasScrolled: true});
                                    }}
                                >
                                    <Table.Body>
                                        {this.renderOrderBookTable(
                                            sortBids(asks),
                                            "ask",
                                            this.props.intl.formatMessage({
                                                id: "page.noDataToShow",
                                            }),
                                            this.props.currentMarket
                                        )}
                                        <div ref={this.reverse}></div>
                                    </Table.Body>
                                </Table>
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "7%",
                                    top: "45%",
                                    left: 0,
                                }}
                            >
                                <Table
                                    style={{
                                        background: "var(--main-bg)",
                                        fontSize: "1.5rem",
                                        textAlign: "center",
                                        margin: "5px 0",
                                        border: "0",
                                    }}
                                >
                                    <Table.Body>{this.lastPrice()}</Table.Body>
                                </Table>
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "41%",
                                    top: "53%",
                                    left: 0,
                                    overflow: "auto",
                                }}
                            >
                                {/* <Table style={{ background: "var(--main-bg)", fontSize: "1.5rem", textAlign: "center"}}>
                                   <Table.Body>
                                       {this.lastPrice()}
                                   </Table.Body>
                                </Table> */}
                                <Table
                                    basic="very"
                                    style={{
                                        padding: 0,
                                        margin: 0,
                                        color: "var(--table-header-color)",
                                        textAlign: "center",
                                    }}
                                    unstackable
                                >
                                    <Table.Body>
                                        {this.renderOrderBookTable(
                                            sortBids(bids),
                                            "bids",
                                            this.props.intl.formatMessage({
                                                id: "page.noDataToShow",
                                            }),
                                            this.props.currentMarket
                                        )}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    isLoading: selectDepthLoading(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    marketTickers: selectMarketTickers(state),
    openOrderslist: selectOpenOrdersList(state),
});

const mapDispatchToProps = (dispatch) => ({
    setCurrentPrice: (payload) => dispatch(setCurrentPrice(payload)),
    subscribeMarket: (payload) => dispatch(rangerSubscribeMarket(payload)),
    unSubscribeMarket: (payload) => dispatch(rangerUnsubscribeMarket(payload)),
});

const OrderBookDesktop = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(OrderBookDesktopContainer)
);
export { OrderBookDesktop };
