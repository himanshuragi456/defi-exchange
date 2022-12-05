import classnames from "classnames";
import * as React from "react";

/**
 * Component for performing search  and filtering objects of the specific dataset.
 */

class FilterInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
        };
        this.filterList = this.filterList.bind(this);
    }

    filterList(event) {
        const value = event.target.value;
        const { data, filter } = this.props;
        const result = data.filter((item) => filter(item, value));
        this.props.onFilter(result);
        this.setState({
            key: value,
        });
    }

    render() {
        const { key } = this.state;
        const { className } = this.props;
        const cx = classnames("base-search__input", className);
        return (
            <div className="base-search">
                <span className="base-search__icon">
                    <img src={SearchIcon} />
                </span>
                <input
                    type="text"
                    className={cx}
                    value={key}
                    placeholder="Search"
                    onChange={this.filterList}
                />
            </div>
        );
    }
}

export { FilterInput };
