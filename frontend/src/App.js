import React, { useEffect } from "react";
import setAuthToken from "./util/setAuthToken";
import { loadUser } from "./store/auth/action";

//React router
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/index.js";

//Redux
import { Provider } from "react-redux";
import configureStore from "./store/store.js";

import "./App.css";
import NavBar from "./components/NavBar";
import Alert from "./components/Alert";
import {
  addMessage,
  loadChats,
  setMessages,
  setMoreMessages,
} from "./store/chat/action";
import WebSocketInstance from "./websocket";

const App = () => {
  const store = configureStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    store.dispatch(loadUser(token));
    if (token) {
      store.dispatch(loadChats(localStorage.getItem("user")));
    }

    WebSocketInstance.addCallbacks(
      (messages) => store.dispatch(setMessages(messages)),
      (message) => store.dispatch(addMessage(message)),
      (messages) => store.dispatch(setMoreMessages(messages))
    );
  }, [store]);

  useEffect(() => {
    if (WebSocketInstance.state() === 3) {
      WebSocketInstance.connect();
    }
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
