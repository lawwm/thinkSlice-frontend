import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from "../components/LoadingSpinner"
import { setAlert } from "../store/components/action"

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (isAuthenticated == false) {
            dispatch(setAlert("You are not a registered user", "danger"))
        }

    }, [isAuthenticated])

    const dispatch = useDispatch()

    return (
        <>
            {loading
                ? <LoadingSpinner />
                : isAuthenticated
                    ? (
                        <Route {...rest} render={props => <Component {...props} />} />
                    )
                    : (
                        <>
                            <Route {...rest} render={() => <Redirect push to="/login" />} />
                        </>
                    )
            }
        </>
    )
};


