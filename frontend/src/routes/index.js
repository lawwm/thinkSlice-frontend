import React, { Fragment, Suspense } from 'react';
import { Switch, Route } from "react-router-dom"
import Alert from "../components/Alert"

export const PATHS = {
    HOMEPAGE: '/',
    LOGIN_PAGE: '/login',
    REGISTER_PAGE: '/register'
}

const Home = React.lazy(() => import("./home/home"))
const Login = React.lazy(() => import("./auth/login"))
const Register = React.lazy(() => import("./auth/register"))

const Routes = () => {
    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <Alert />
                <Switch>
                    <Route exact path={PATHS.HOMEPAGE} component={Home} />
                    <Route exact path={PATHS.LOGIN_PAGE} component={Login} />
                    <Route exact path={PATHS.REGISTER_PAGE} component={Register} />
                </Switch>
            </Suspense>
        </Fragment>

    )
}

export default Routes