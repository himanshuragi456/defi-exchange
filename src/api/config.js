import {
    ORDER_BOOK_DEFAULT_SIDE_LIMIT,
    STORAGE_DEFAULT_LIMIT,
} from "../constants";

export const defaultConfig = {
    api: {
        authUrl: "",
        tradeUrl: "",
        applogicUrl: "",
        rangerUrl: "",
    },
    authLogout: "60",
    rangerReconnectPeriod: "1000",
    orderBookSideLimit: 25,
    withCredentials: false,
    payable_currency: true,
    incrementalOrderBook: false,
    captcha: {
        captchaType: "none",
        siteKey: "",
    },
    storage: {},
    msAlertDisplayTime: "5000",
    balancesFetchInterval: "3000",
    publicRoute: [],
    privateRoute: [],
    productsList: [],
    walletCustomCurrency: ["BTC", "ETH", "DOGE", "USDT"],
    languages: ["en", "ar", "ur", "es"],
    PEPUrl: "https://wenbit.com/politically-exposed-person",
    TNCUrl: "https://wenbit.com/user-terms-and-conditions",
    PPUrl: "https://wenbit.com/privacy-policy-2",
    RRCUrl: "https://wenbit.com/risks-associated-with-crypto",
    customMarketTabs: [],
    underConstruction: false,
    considerMarketsDown: true,
    primaryCurrency: "usdt",
    homepageUrl: "",
    bankData: {

        eur: [
            {
                key: "Bank Name",
                value: "Euro Bank",
                type: "string",
            },
            {
                key: "Company Name",
                value: "Wenbit",
                type: "string",
            },
            {
                key: "CUI",
                value: "123456789",
                type: "string",
            },
            {

                key: "IBAN",
                value: "IBAN_123456",
                type: "string",
            },
            {
                key: "SWIFT",
                value: "SWIFT",
                type: "string",
            },
            {
                key: "Wallet Token",
                value: "123456789",
                type: "string",
            },
            {
                key: "",
                value: "Do not go to a bank office and try to deposit cash directly into our account, do a bank transfer so we can identify your IBAN.",
                type: "alert",
                class: "alert-danger",
            },
            {
                key: "",
                value: "The following bank accounts are to be used only for EUR. Sending any other currency will not be accepted, and it may take a few days before your funds are returned by the involved banks.",
                type: "alert",
                class: "alert-danger",
            },
            {
                key: "",
                value: "Please note that all bank transfer fees are your responsibility.",
                type: "alert",
                class: "alert-danger",
            },
            {
                key: "",
                value: "Please mention following Reference Code in the bank transfer, we won't be able to process your payment without the Reference Code.",
                type: "alert",
                class: "alert-warning",
            },
        ],
        default:  [],
    },
    kyc: {
        provider: "sumsub", // local, sumsub
        key: "",
        production: false,
        flow: "basic-kyc",
    },
};
export const App = {
    config: defaultConfig,
};
window.env = window.env || defaultConfig;
App.config = { ...defaultConfig, ...window.env };
App.config.storage = App.config.storage || {};
App.config.captcha = App.config.captcha || defaultConfig.captcha;
export const authUrl = () => App.config.api.authUrl;
export const tradeUrl = () => App.config.api.tradeUrl;
export const applogicUrl = () => App.config.api.applogicUrl;
export const rangerUrl = () => App.config.api.rangerUrl;
export const minutesUntilAutoLogout = () => App.config.authLogout || "60";
export const withCredentials = () => App.config.withCredentials;
export const defaultStorageLimit = () =>
    App.config.storage.defaultStorageLimit || STORAGE_DEFAULT_LIMIT;
export const siteKey = () => App.config.captcha.siteKey;
export const captchaType = () => App.config.captcha.captchaType;
export const msAlertDisplayTime = () => App.config.msAlertDisplayTime || "5000";
export const rangerReconnectPeriod = () =>
    App.config.rangerReconnectPeriod
        ? Number(App.config.rangerReconnectPeriod)
        : 1;
export const payableCurrencySupport = () => App.config.payable_currency;
export const publicRoute = () => App.config.publicRoute;
export const privateRoute = () => App.config.privateRoute;
export const incrementalOrderBook = () =>
    App.config.incrementalOrderBook || false;
export const orderBookSideLimit = () =>
    App.config.storage.orderBookSideLimit || ORDER_BOOK_DEFAULT_SIDE_LIMIT;
export const customMarketTabs = () => App.config.customMarketTabs;
export const languages = () =>
    App.config.languages.length > 0
        ? App.config.languages
        : ["en", "ar", "ur", "es"];
export const productList = () =>
    App.config.productsList.length > 0
        ? App.config.productsList
        : [
              ["page.productMenu.home", "/", "/images/icon-home.svg", "a"],
              [
                  "page.productMenu.market",
                  "/markets",
                  "/images/icon-otc.svg",
                  "a",
              ],
              [
                  "page.productMenu.exchange",
                  "/trading",
                  "/images/icon-exchange.svg",
                  "a",
              ],
              ['page.productMenu.convert', '/convert', '/images/icon-otc.svg', 'a']
              // ["page.productMenu.app", "/app-view", "/images/icon-home.svg", "a"],
              // ["page.productMenu.cards", "/card", "/images/icon-exchange.svg", "a"],
              // [
              //   "page.productMenu.mining",
              //   "/mining",
              //   "/images/icon-exchange.svg",
              //   "a",
              // ],
              // ["page.productMenu.p2p", "/p2p", "/images/icon-otc.svg", "a"],
              // [
              //   "page.productMenu.staking",
              //   "/staking",
              //   "/images/icon-exchange.svg",
              //   "a",
              // ],
              // ["page.productMenu.defi", "/defi", "/images/icon-otc.svg", "a"],
          ];
export const walletCustomCurrency = () => App.config.walletCustomCurrency;
export const PEPUrl = () => App.config.PEPUrl;
export const TNCUrl = () => App.config.TNCUrl;
export const PPUrl = () => App.config.PPUrl;
export const RRCUrl = () => App.config.RRCUrl;
export const underConstruction = () => App.config.underConstruction || false;
export const considerMarketsDown = () => App.config.considerMarketsDown;
export const KycProvider = () => App.config.kyc.provider;
export const KycKey = () => App.config.kyc.key;
export const KycIsProduction = () => App.config.kyc.production;
export const KycFlow = () => App.config.kyc.flow;
export const primaryCurrency = () => App.config.primaryCurrency;
export const homePageUrl = () => App.config.homepageUrl;
export const bankData = (value) => App.config.bankData ? App.config.bankData[value] : defaultConfig.bankData[value];
