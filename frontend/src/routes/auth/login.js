import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../store/auth/action.js";
//import { setAlert } from "../../store/components/action.js"

import LoadingSpinner from "../../components/LoadingSpinner";
import NavBar from "../../components/NavBar";
import { Container, Col, Row } from "react-bootstrap";
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
            <Row>
              <Col>
                <form onSubmit={(e) => onSubmit(e)}>
                  <h2>Log in to start learning.</h2>
                  <div className="form-group row">
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Username"
                      onChange={(e) => onChange(e)}
                      value={username}
                    />
                  </div>
                  <div className="form-group row">
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
                    className="mr-auto color-black"
                  >
                    Don't have an account?
                  </a>
                  <button
                    type="submit"
                    value="Submit"
                    className="btn btn-danger btn-custom"
                  >
                    Submit
                  </button>
                </form>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default Login;
