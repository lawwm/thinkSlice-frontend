import React, { Fragment, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
// import Alert from "../components/Alert"
import { PrivateRoute } from "./routeTypes";
import LoadingSpinner from "../components/LoadingSpinner";

export const PATHS = {
  HOMEPAGE: "/",
  LOGIN_PAGE: "/login",
  REGISTER_PAGE: "/register",
  PROFILE_PAGE: "/profile/:user_id",
  UPLOAD_PAGE: "/upload",
  WATCH_PAGE: "/watch/:videoId",
  CHAT_PAGE: "/chat",
  ABOUT_PAGE: "/about",
};

const Home = React.lazy(() => import("./home/home"));
const Fallback = React.lazy(() => import("./errorpages/notFound"));
const Login = React.lazy(() => import("./auth/login"));
const Register = React.lazy(() => import("./auth/register"));
const Profile = React.lazy(() => import("./profile/profile"));
const Upload = React.lazy(() => import("./home/upload"));
const WatchPage = React.lazy(() => import("./home/watch"));
const Chat = React.lazy(() => import("./chat/chat"));
const About = React.lazy(() => import("./about/about"));

const Routes = () => {
  return (
    <Fragment>
      <Suspense fallback={<LoadingSpinner />}>
        {/* <Alert /> */}
        <Switch>
          <Route exact path={PATHS.HOMEPAGE} component={Home} />
          <Route exact path={PATHS.LOGIN_PAGE} component={Login} />
          <Route exact path={PATHS.REGISTER_PAGE} component={Register} />
          <Route exact path={PATHS.PROFILE_PAGE} component={Profile} />
          <Route exact path={PATHS.CHAT_PAGE} component={Chat} />
          <Route exact path={PATHS.ABOUT_PAGE} component={About} />

          <PrivateRoute exact path={PATHS.UPLOAD_PAGE} component={Upload} />
          <Route exact path={PATHS.WATCH_PAGE} component={WatchPage} />
          <Route component={Fallback} />
        </Switch>
      </Suspense>
    </Fragment>
  );
};

export default Routes;
