import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from "../components/LoadingSpinner"

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useSelector(
        (state) => state.auth
    )

    return (
        <>
            {loading
                ? <LoadingSpinner />
                : isAuthenticated
                    ? <Route {...rest} render={props => <Component {...props} />} />
                    : <Route {...rest} render={() => <Redirect push to="/login" />} />
            }
        </>
    )
};


