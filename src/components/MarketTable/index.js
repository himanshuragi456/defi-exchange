import * as React from "react";
import classnames from "classnames";

/**
 * App Table overrides default table
 */

class MarketCustomTable extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelect = (index) => () => {
            const { onSelect } = this.props;

            if (onSelect) {
                this.setState(
                    {
                        selectedRowIndex: index,
                    },
                    () => {
                        if (onSelect) {
                            onSelect(index);
                        }
                    }
                );
            }
        };

        this.state = {
            activeFilter: undefined,
            resultData: undefined,
            selectedRowIndex: 0,
        };
    }

    componentDidMount() {
        const { filters, selectedKey, useRowKeyIndex } = this.props;

        if (filters && filters.length > 0) {
            this.handleFilter(filters[0]);
        }

        if (selectedKey && useRowKeyIndex) {
            this.setState({
                selectedRowIndex: selectedKey,
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { selectedKey, useRowKeyIndex } = this.props;

        if (prevProps.data !== this.props.data && this.props.filters) {
            const activeFilter = this.props.filters.find(
                (filter) => filter.name === this.state.activeFilter
            );

            if (activeFilter) {
                this.handleFilter(activeFilter);
            }
        }

        if (selectedKey !== prevProps.selectedKey && useRowKeyIndex) {
            this.setState({
                selectedRowIndex: selectedKey,
            });
        }
    }

    render() {
        const { data, header, titleComponent, filters = [] } = this.props;
        this.ensureDataIsValid(data);
        const cn = classnames("base-table-header__content", {
            "base-table-header__content-empty":
                !titleComponent && filters.length === 0,
        });
        return (
            <div className="base-table-container">
                <div className={cn}>
                    {titleComponent ? this.renderTitleComponent() : null}
                    {filters.length ? (
                        <div className="base-table__filters">
                            {this.renderFilters()}
                        </div>
                    ) : null}
                </div>
                <table
                    className={"base-table " + this.props.className}
                    style={{
                        ...this.props.style,
                    }}
                >
                    {header && header.length && this.renderHead(header)}
                    {this.renderBody(data)}
                </table>
                {this.renderBackground(data)}
            </div>
        );
    }

    renderTitleComponent() {
        const { titleComponent } = this.props;
        return <div className="base-title-component">{titleComponent}</div>;
    }

    static renderRowCells(row) {
        return row && row.length
            ? row.map((c, index) => <td key={index}>{c}</td>)
            : [];
    }

    handleFilter(item) {
        const { data } = this.props;

        if (!item.filter) {
            this.setState({
                resultData: data,
            });
            return;
        }

        const resultData = [...data].filter(item.filter);
        this.setState({
            activeFilter: item.name,
            resultData: resultData,
        });
    }

    renderFilters() {
        const { filters = [] } = this.props;
        const { activeFilter } = this.state;

        const cn = (filterName) =>
            classnames("base-table__filter", {
                "base-table__filter--active": activeFilter === filterName,
            });

        return filters.map((item) => {
            const handleFilterClick = () => {
                this.handleFilter(item);
            };

            return (
                <div
                    className={cn(item.name)}
                    key={item.name}
                    onClick={handleFilterClick}
                >
                    {item.name}
                </div>
            );
        });
    }

    renderHead(row) {
        const cells = row.map((c, index) => <th key={index}>{c}</th>);
        return (
            <thead className="base-table__head">
                <tr className="base-table__head-row">{cells}</tr>
            </thead>
        );
    }

    renderRowBackground(i) {
        const {
            rowBackground,
            rowBackgroundColor = "rgba(184, 233, 245, 0.7)",
        } = this.props;
        const rowBackgroundResult = rowBackground ? rowBackground(i) : {};
        const style = {
            ...rowBackgroundResult,
            backgroundColor: rowBackgroundColor,
        };
        return rowBackground ? (
            <span
                key={i}
                style={style}
                className="base-table-background__row"
            />
        ) : null;
    }

    renderBackground(rows) {
        const { resultData } = this.state;
        const { rowBackground, side } = this.props;
        const dataToBeMapped = resultData || rows;

        const renderBackgroundRow = (r, i) => this.renderRowBackground(i);

        const className = classnames("base-table-background", {
            "base-table-background--left": side === "left",
            "base-table-background--right": side === "right",
        });
        return (
            <div className={className}>
                {rowBackground && dataToBeMapped.map(renderBackgroundRow)}
            </div>
        );
    }

    renderBody(rows) {
        const { resultData, selectedRowIndex } = this.state;
        const { rowKeyIndex, useRowKeyIndex } = this.props;

        const rowClassName = (index) =>
            classnames({
                "base-table__row--selected": selectedRowIndex === index,
            });

        const dataToBeMapped = resultData || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            return (
                <tr
                    className={rowClassName(
                        useRowKeyIndex ? r[rowKeyIndex] : i
                    )}
                    key={useRowKeyIndex ? r[rowKeyIndex] : i}
                    onClick={this.handleSelect(
                        useRowKeyIndex ? r[rowKeyIndex] : i
                    )}
                >
                    {MarketCustomTable.renderRowCells(r)}
                </tr>
            );
        });
        return <tbody className="base-table__body">{rowElements}</tbody>;
    }

    ensureDataIsValid(data) {
        const length = data[0].length;
        const len = data.length;

        for (let i = 0; i < len; i += 1) {
            if (data[i].length !== length) {
                throw Error("Array elements must have the same length");
            }
        }
    }
}

export { MarketCustomTable };
