import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../store/auth/action.js";
//import { setAlert } from "../../store/components/action.js"
import LoadingSpinner from "../../components/LoadingSpinner";
import { Col, Container } from "react-bootstrap";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    history.push("/");
  }

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const onChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    dispatch(login(loginData));

    // setLoginData({
    //     username: "",
    //     password: ""
    // })
  };

  const { username, password } = loginData;

  return (
    <>
      {" "}
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Col></Col>
            <h2>Log in to start learning.</h2>
            <form onSubmit={(e) => onSubmit(e)}>
              <br />
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={(e) => onChange(e)}
                value={username}
              />
              <br />
              <br />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={(e) => onChange(e)}
                value={password}
              />
              <input type="submit" value="Submit" />
            </form>
            <br />
            <button onClick={() => history.push("/register")} type="button">
              No account? Register here!
            </button>
            <br />
            <button onClick={() => history.push("/")} type="button">
              Return to homepage?
            </button>
            <Col></Col>
          </Container>
        </>
      )}
    </>
  );
};

export default Login;
