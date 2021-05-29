import React, { useEffect } from "react";
import setAuthToken from "./util/setAuthToken";
import { loadUser } from "./store/auth/action";

//React router
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/index.js";

//Redux
import { Provider } from "react-redux";
import store from "./store/store.js";

import "./App.css";
import NavBar from "./components/NavBar";
import Alert from "./components/Alert"

const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
    store.dispatch(loadUser(localStorage.getItem("token")));
  }, []);

  return (
    <Provider store={store} className="App">
      <Alert />
      <BrowserRouter>
        <NavBar />
        <Routes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
