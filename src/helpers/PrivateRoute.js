import * as React from "react";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { renderLoader } from "../routes/Layout/index";

const PrivateRoute = ({
    component: CustomComponent,
    loading,
    isLogged,
    ...rest
}) => {
    if (loading) {
        return renderLoader();
    }

    const renderCustomerComponent = (props) => (
        <CustomComponent {...Object.assign({}, props)} />
    );

    if (isLogged) {
        return (
            <Route
                {...Object.assign({}, rest, {
                    render: renderCustomerComponent,
                })}
            />
        );
    }

    return (
        <Route {...Object.assign({}, rest)}>
            <Redirect to="/signin" />
        </Route>
    );
};

export default PrivateRoute;
