import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../store/auth/action.js";
//import { setAlert } from "../../store/components/action.js"
import LoadingSpinner from "../../components/LoadingSpinner";
import { Col, Container, Form } from "react-bootstrap";
import "../styles.css";

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
            <h2>Log in to start learning.</h2>
            <form onSubmit={(e) => onSubmit(e)}>
              <div class="form-group row">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  onChange={(e) => onChange(e)}
                  value={username}
                />
              </div>
              <div class="form-group row">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => onChange(e)}
                  value={password}
                />
              </div>
              <br />
              <a
                onClick={() => history.push("/register")}
                type="button"
                className="offset-login"
              >
                Don't have an account?
              </a>
              <button
                type="submit"
                value="Submit"
                className="btn btn-danger"
              >
                Submit
              </button>
            </form>
          </Container>
        </>
      )}
    </>
  );
};

export default Login;
