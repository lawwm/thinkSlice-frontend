import React, { Fragment, Suspense } from 'react';
import { Switch, Route } from "react-router-dom"
// import Alert from "../components/Alert"
import { PrivateRoute } from "./routeTypes"
import LoadingSpinner from "../components/LoadingSpinner";
import NotFound from './errorpages/notFound';

export const PATHS = {
    HOMEPAGE: '/',
    LOGIN_PAGE: '/login',
    REGISTER_PAGE: '/register',
    PROFILE_PAGE: '/profile',
    UPLOAD_PAGE: '/upload',
    WATCH_PAGE: '/watch/:videoId'
}

const Home = React.lazy(() => import("./home/home"))
const Fallback = React.lazy(() => import("./errorpages/notFound"))
const Login = React.lazy(() => import("./auth/login"))
const Register = React.lazy(() => import("./auth/register"))
const Profile = React.lazy(() => import("./profile/profile"))
const Upload = React.lazy(() => import("./home/upload"))
const WatchPage = React.lazy(() => import("./home/watch"))

const Routes = () => {
    return (
        <Fragment>

            <Suspense fallback={<LoadingSpinner />}>
                {/* <Alert /> */}
                <Switch>
                    <Route exact path={PATHS.HOMEPAGE} component={Home} />
                    <Route exact path={PATHS.LOGIN_PAGE} component={Login} />
                    <Route exact path={PATHS.REGISTER_PAGE} component={Register} />
                    <Route path={PATHS.PROFILE_PAGE + "/:user_id"} component={Profile} />
                    <PrivateRoute exact path={PATHS.UPLOAD_PAGE} component={Upload} />
                    <Route exact path={PATHS.WATCH_PAGE} component={WatchPage} />
                    <Route component={Fallback} />
                </Switch>
            </Suspense>
        </Fragment>
    )
}

export default Routes