import React, { useEffect } from "react";
import setAuthToken from "./util/setAuthToken";
import { loadUser } from "./store/auth/action";
import { getProfile } from "./store/profile/action";

//React router
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/index.js";

//Redux
import { Provider } from "react-redux";
import store from "./store/store.js";

import "./App.css";

const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
    store.dispatch(loadUser(localStorage.getItem("token")))
    // store.dispatch(getProfile(localStorage.getItem("user")));
  }, []);

  return (
    <Provider store={store} className="App">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
