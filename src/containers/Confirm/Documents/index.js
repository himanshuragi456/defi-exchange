import { Loader } from "@components/components";
import cr from "classnames";
import * as React from "react";
import { injectIntl } from "react-intl";
import MaskInput from "react-maskinput";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isDateInFuture } from "../../../helpers/checkDate";
import {
    selectSendDocumentsLoading,
    selectSendDocumentsSuccess,
    sendDocuments,
} from "../../../modules/user/kyc/documents";
import _ from "lodash";
import { alertPush } from "../../../modules/public/alert";
import { selectUserInfo } from "../../../modules/user/profile";
import { API, KycFlow, KycIsProduction, KycProvider } from "../../../api";
import snsWebSdk from "@sumsub/websdk";

class DocumentsComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.translate = (e) => {
            return this.props.intl.formatMessage({
                id: e,
            });
        };

        this.data = [
            this.translate("page.body.kyc.documents.select.passport"),
            this.translate("page.body.kyc.documents.select.identityCard"),
            this.translate("page.body.kyc.documents.select.driverLicense"),
            this.translate("page.body.kyc.documents.select.utilityBill"),
        ];
        this.state = {
            documentsType: "Passport",
            expiration: "",
            expirationFocused: false,
            idNumber: "",
            idNumberFocused: false,
            scans: [],
        };

        this.handleChangeDocumentsType = (value) => {
            this.setState({
                documentsType: value,
            });
        };

        this.handleFileDelete = (key) => () => {
            const fileList = Array.from(this.state.scans);
            fileList.splice(key, 1);
            this.setState({
                scans: fileList,
            });
        };

        this.renderScan = (scan, index) => {
            return (
                <div
                    className="parent-confirm__content-documents-filename"
                    key={index}
                    onClick={this.handleFileDelete(index)}
                >
                    {scan.name.slice(0, 27)}...{" "}
                    <img src={require("../close.svg")} />
                </div>
            );
        };

        this.handleChangeIdNumber = (e) => {
            this.setState({
                idNumber: e.target.value,
            });
        };

        this.handleFieldFocus = (field) => {
            return () => {
                switch (field) {
                    case "expiration":
                        this.setState({
                            expirationFocused: !this.state.expirationFocused,
                        });
                        break;

                    case "idNumber":
                        this.setState({
                            idNumberFocused: !this.state.idNumberFocused,
                        });
                        break;

                    default:
                        break;
                }
            };
        };

        this.formatDate = (date) => {
            const [day, month, year] = date.split("/");
            let formatDay = day ? day : "";
            formatDay =
                formatDay === "" || parseFloat(formatDay) <= 31
                    ? formatDay
                    : "31";
            let formatMonth = month ? month : "";
            formatMonth =
                formatMonth === "" || parseFloat(formatMonth) <= 12
                    ? formatMonth
                    : "12";
            const formatYear = year ? parseFloat(year) : "";
            return formatDay && formatMonth && formatYear
                ? `${formatDay}/${formatMonth}/${formatYear}`
                : date;
        };

        this.handleChangeExpiration = (e) => {
            this.setState({
                expiration: this.formatDate(e.target.value),
            });
        };

        this.handleUploadScan = (uploadEvent) => {
            const allFiles = uploadEvent.target.files;
            const oldFileList = Array.from(this.state.scans);
            const additionalFileList =
                Array.from(allFiles).length > 5
                    ? Array.from(allFiles).slice(0, 5)
                    : Array.from(allFiles);

            if (oldFileList.length !== 5) {
                this.setState({
                    scans: additionalFileList.concat(oldFileList),
                });
            }
        };

        this.handleFileDrop = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const uploadObj = {
                target: event.nativeEvent.dataTransfer,
            };
            this.handleUploadScan(uploadObj);
        };

        this.handleDragOver = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        this.handleCheckButtonDisabled = () => {
            const { expiration, idNumber, scans } = this.state;
            return !scans.length || !idNumber || !expiration;
        };

        this.sendDocuments = () => {
            const { scans, idNumber, expiration, documentsType } = this.state;
            const typeOfDocuments = this.getDocumentsType(documentsType);
            const docExpire = isDateInFuture(expiration) ? expiration : "";

            if (!isDateInFuture(expiration)) {
                this.props.alertPush({
                    message: ["resource.documents.already_expired"],
                    type: "error",
                    code: 422,
                });
                return;
            }

            if (!scans.length) {
                return;
            }

            const request = new FormData();

            for (const scan of scans) {
                request.append("upload[]", scan);
            }

            request.append("doc_expire", docExpire);
            request.append("doc_type", typeOfDocuments);
            request.append("doc_number", idNumber);
            this.props.sendDocuments(request);
        };

        this.getDocumentsType = (value) => {
            switch (value) {
                case this.data[0]:
                    return "Passport";

                case this.data[1]:
                    return "Identity card";

                case this.data[2]:
                    return "Driver license";

                case this.data[3]:
                    return "Utility Bill";

                default:
                    return value;
            }
        };
    }

    componentWillReceiveProps(next) {
        if (next.success === "success.documents.accepted") {
            this.props.history.push("/profile");
        }
    }

    componentDidMount() {
        if (KycProvider() === "sumsub") {
            let url = "test-api.sumsub.com";

            if (KycIsProduction() === true) {
                url = "api.sumsub.com";
            }

            API.post({
                apiVersion: "barong",
            })("/resource/kyc/initialize", []).then(
                function (data) {
                    this.launchWebSdk(
                        `https://${url}`,
                        KycFlow(),
                        data["token"],
                        this.props.user.email
                    );
                }.bind(this)
            );
        }
    }

    launchWebSdk(
        apiUrl,
        flowName,
        accessToken,
        applicantEmail,
        applicantPhone,
        customI18nMessages
    ) {
        let snsWebSdkInstance = snsWebSdk
            .init(accessToken, (newAccessTokenCallback) => {
                // Access token expired
                // get a new one and pass it to the callback to re-initiate the WebSDK
                API.post({
                    apiVersion: "barong",
                })("/kyc/initialize", []).then(function (data) {
                    newAccessTokenCallback(data["token"]);
                });
            })
            .withConf({
                lang: "en",
                email: applicantEmail,
                phone: applicantPhone,
                i18n: customI18nMessages,
                onMessage: (type, payload) => {
                    // see below what kind of messages the WebSDK generates
                    console.log("WebSDK onMessage", type, payload);
                },
                uiConf: {
                    // customCss: "https://url.com/styles.css"
                    // URL to css file in case you need change it dynamically from the code
                    // the similar setting at Applicant flow will rewrite customCss
                    // you may also use to pass string with plain styles `customCssStr:`
                },
                onError: (error) => {
                    console.error("WebSDK onError", error);
                },
            })
            .build(); // you are ready to go:
        // just launch the WebSDK by providing the container element for it

        snsWebSdkInstance.launch("#sumsub-websdk-container");
    }

    render() {
        const {
            documentsType,
            expiration,
            expirationFocused,
            idNumber,
            idNumberFocused,
            scans,
        } = this.state;
        const { loading } = this.props;
        const expirationFocusedClass = cr(
            "parent-confirm__content-documents-col-row-content",
            {
                "parent-confirm__content-documents-col-row-content--focused":
                    expirationFocused,
            }
        );
        const idNumberFocusedClass = cr(
            "parent-confirm__content-documents-col-row-content",
            {
                "parent-confirm__content-documents-col-row-content--focused":
                    idNumberFocused,
            }
        );

        const onSelect = (value) =>
            this.handleChangeDocumentsType(this.data[value]);

        const numberType = `${
            this.translate(
                `page.body.kyc.documents.select.${_.camelCase(documentsType)}`
            ) || this.translate("page.body.kyc.documentsType")
        }${this.translate("page.body.kyc.documents.number")}`;

        const documentActiveClass = (value) =>
            documentsType === value
                ? "nav-link d-flex align-items-center active  background-gradient"
                : "nav-link d-flex align-items-center";

        if (KycProvider() === "sumsub") {
            return <div id="sumsub-websdk-container" />;
        }

        return (
            <div className="form-step identity-card form-step1 col-12 col-md-8 mt-3 pb-4 container card">
                <div className="card-innr no-border-radius">
                    <div className="step-head">
                        <div className="step-number text-white">02</div>
                        <div className="step-head-text">
                            <h3 className="text-white">
                                {this.translate("page.body.kyc.document.head")}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="form-step-fields card-innr pt-1 no-border-radius">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="note note-plane note-light-alt note-md pdb-0-5x">
                                <em className="fas fa-info-circle" />
                                <p>
                                    In order to complete, please upload any of
                                    the following personal document.
                                </p>
                            </div>
                            <ul
                                className="nav nav-tabs nav-tabs-bordered row flex-wrap guttar-20px"
                                role="tablist"
                            >
                                <li className="nav-item flex-grow-0">
                                    <a
                                        className={documentActiveClass(
                                            "Passport"
                                        )}
                                        data-toggle="tab"
                                        onClick={() =>
                                            this.handleChangeDocumentsType(
                                                "Passport"
                                            )
                                        }
                                    >
                                        <div className="nav-tabs-icon">
                                            <img
                                                src="/images/icon-passport.png"
                                                alt="icon"
                                            />
                                            <img
                                                src="/images/icon-passport-color.png"
                                                alt="icon"
                                            />
                                        </div>
                                        <span>
                                            {this.translate(
                                                "page.body.kyc.documents.select.passport"
                                            )}
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item flex-grow-0">
                                    <a
                                        className={documentActiveClass(
                                            "Identity card"
                                        )}
                                        data-toggle="tab"
                                        onClick={() =>
                                            this.handleChangeDocumentsType(
                                                "Identity card"
                                            )
                                        }
                                    >
                                        <div className="nav-tabs-icon">
                                            <img
                                                src="/images/icon-national-id.png"
                                                alt="icon"
                                            />
                                            <img
                                                src="/images/icon-national-id-color.png"
                                                alt="icon"
                                            />
                                        </div>
                                        <span>
                                            {this.translate(
                                                "page.body.kyc.documents.select.identityCard"
                                            )}
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item flex-grow-0">
                                    <a
                                        className={documentActiveClass(
                                            "Driver license"
                                        )}
                                        data-toggle="tab"
                                        onClick={() =>
                                            this.handleChangeDocumentsType(
                                                "Driver license"
                                            )
                                        }
                                    >
                                        <div className="nav-tabs-icon">
                                            <img
                                                src="/images/icon-licence.png"
                                                alt="icon"
                                            />
                                            <img
                                                src="/images/icon-licence-color.png"
                                                alt="icon"
                                            />
                                        </div>
                                        <span>
                                            {this.translate(
                                                "page.body.kyc.documents.select.driverLicense"
                                            )}
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 document-id-input">
                            <input
                                className="input-confirmation-number"
                                type="text"
                                placeholder={numberType}
                                value={idNumber}
                                onChange={this.handleChangeIdNumber}
                                onFocus={this.handleFieldFocus("idNumber")}
                                onBlur={this.handleFieldFocus("idNumber")}
                            />
                        </div>
                        <div className="col-md-6">
                            <MaskInput
                                maskString="00/00/0000"
                                mask="00/00/0000"
                                onChange={this.handleChangeExpiration}
                                onFocus={this.handleFieldFocus("expiration")}
                                onBlur={this.handleFieldFocus("expiration")}
                                value={expiration}
                                className="input-confirmation-number"
                                placeholder={this.translate(
                                    "page.body.kyc.documents.expiryDate"
                                )}
                            />
                        </div>
                        <div className="col-md-12">
                            <div className="parent-confirm__loader">
                                {loading ? <Loader /> : null}
                            </div>
                            <div className="parent-confirm__content-documents-col parent-confirm__content-documents-drag">
                                <div className="parent-confirm__content-documents-col-row">
                                    <div className="parent-confirm__content-documents-col-row-content-2">
                                        {this.translate(
                                            "page.body.kyc.documents.upload"
                                        )}
                                        <div className="parent-confirm__content-documents-col-row-content-2-documents">
                                            <form
                                                className="box"
                                                draggable={true}
                                                onDrop={this.handleFileDrop}
                                                onDragOver={this.handleDragOver}
                                                method="post"
                                                action=""
                                                data-enctype="multipart/form-data"
                                            >
                                                <input
                                                    className="parent-confirm__content-documents-col-row-content-2-documents-input"
                                                    data-multiple-caption="files selected"
                                                    draggable={true}
                                                    multiple={true}
                                                    name="files[]"
                                                    type="file"
                                                    id="file"
                                                    onChange={
                                                        this.handleUploadScan
                                                    }
                                                    capture="environment"
                                                    accept=".jpg, .jpeg, .png"
                                                />
                                                <div className="parent-confirm__content-documents-col-row-content-2-documents-label">
                                                    <label
                                                        className="parent-confirm__content-documents-col-row-content-2-documents-label-item"
                                                        htmlFor="file"
                                                    >
                                                        <p className="active">
                                                            {this.translate(
                                                                "page.body.kyc.documents.drag"
                                                            )}
                                                        </p>
                                                        <div className="muted">
                                                            {this.translate(
                                                                "page.body.kyc.documents.maxFile"
                                                            )}
                                                        </div>
                                                        <div className="muted">
                                                            {this.translate(
                                                                "page.body.kyc.documents.maxNum"
                                                            )}
                                                        </div>
                                                    </label>
                                                </div>
                                            </form>
                                        </div>
                                        {Array.from(scans).map(this.renderScan)}
                                        <span>
                                            {this.translate(
                                                "page.body.kyc.documents.files"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <button
                                className="btn btn-primary mt-3"
                                onClick={this.sendDocuments}
                                disabled={this.handleCheckButtonDisabled()}
                            >
                                {this.translate("page.body.kyc.submit")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
    success: selectSendDocumentsSuccess(state),
    loading: selectSendDocumentsLoading(state),
});

const mapDispatchProps = (dispatch) => ({
    sendDocuments: (payload) => dispatch(sendDocuments(payload)),
    alertPush: (payload) => dispatch(alertPush(payload)),
});

export const Documents = injectIntl(
    withRouter(connect(mapStateToProps, mapDispatchProps)(DocumentsComponent))
);
