import classnames from "classnames";
import * as React from "react";
import { CloseButton } from "../../atoms/CloseButton/CloseButton";
import { Table } from "../Table/Table";

class OpenOrders extends React.Component {
    constructor() {
        super(...arguments);
        this.defaultHeaders = ["Date", "Action", "Price", "Amount", ""];

        this.renderCell = (rowIndex) => (cell, index, row) => {
            const { headers = this.defaultHeaders } = this.props;
            const actionIndex = headers.findIndex(
                (header) => header === "Action"
            );
            const orderIndex = headers.findIndex(
                (header) => header === "Order"
            );
            const buySellIndex = headers.findIndex((header) => header === "");

            switch (index) {
                case actionIndex:
                    return this.renderAction(row[actionIndex]);

                case orderIndex:
                    return this.renderOrder(row[orderIndex]);

                case buySellIndex:
                    return this.renderCancelButton(rowIndex);

                default:
                    return cell;
            }
        };

        this.renderRow = (row, index) => {
            return row.map(this.renderCell(index)); // format cells and remove first column of order side
        };

        this.renderCancelButton = (index) => {
            return <CloseButton onClick={this.handleCancel(index)} />;
        };

        this.handleCancel = (index) => () => {
            this.props.onCancel(index);
        };
    }

    render() {
        const { headers = this.defaultHeaders } = this.props;
        const tableData = this.props.data.map(this.renderRow);
        const orderIndex = headers.findIndex((header) => header === "Order");

        if (headers[orderIndex] === "Order") {
            headers[orderIndex] = (
                <span onClick={this.props.function}>Order</span>
            );
        }

        return (
            <div className="base-open-orders">
                <Table header={headers} data={tableData} />
            </div>
        );
    }

    renderAction(actionType) {
        const action = actionType ? actionType.toLowerCase() : actionType;
        const classNames = classnames("base-open-orders__price", {
            "base-open-orders__price--buy": action === "bid",
            "base-open-orders__price--sell": action === "ask",
        });
        return <span className={classNames}>{action}</span>;
    }

    renderOrder(orderType) {
        // tslint:disable-next-line:no-magic-numbers
        const type = orderType
            ? orderType.toLowerCase().slice(0, 3)
            : orderType;
        const classNames = classnames("base-open-orders__order", {
            "base-open-orders__order--buy": type === "buy",
            "base-open-orders__order--sell": type === "sel",
        });
        return <span className={classNames}>{orderType}</span>;
    }
}

export { OpenOrders };
