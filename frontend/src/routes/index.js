import React, { Fragment, Suspense } from 'react';
import { Switch, Route } from "react-router-dom"
import Alert from "../components/Alert"
import { PrivateRoute } from "./routeTypes"
import LoadingSpinner from "../components/LoadingSpinner";

export const PATHS = {
    HOMEPAGE: '/',
    LOGIN_PAGE: '/login',
    REGISTER_PAGE: '/register',
    PROFILE_PAGE: '/profile',
    UPLOAD_PAGE: '/video',
    VIDEO_PAGE: '/video/view'
}

const Home = React.lazy(() => import("./home/home"))
const Login = React.lazy(() => import("./auth/login"))
const Register = React.lazy(() => import("./auth/register"))
const Profile = React.lazy(() => import("./profile/profile"))
const Upload = React.lazy(() => import("./video/upload"))
const Video = React.lazy(() => import("./video/video"))

const Routes = () => {
    return (
        <Fragment>
            <Suspense fallback={<LoadingSpinner />}>
                <Alert />
                <Switch>
                    <Route exact path={PATHS.HOMEPAGE} component={Home} />
                    <Route exact path={PATHS.LOGIN_PAGE} component={Login} />
                    <Route exact path={PATHS.REGISTER_PAGE} component={Register} />
                    <Route path={PATHS.PROFILE_PAGE + "/:user_id"} component={Profile} />
                    <Route exact path={PATHS.UPLOAD_PAGE} component={Upload} />
                    <Route exact path={PATHS.VIDEO_PAGE} component={Video} />
                </Switch>
            </Suspense>
        </Fragment>

    )
}

export default Routes