import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../store/auth/action.js";

import LoadingSpinner from "../../components/LoadingSpinner";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import "../styles.css";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, authLoading } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    // dispatch(setAlert("Login successful", "success"))
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

  const onSubmit = (e) => {
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
                  <div className="login-form-div">
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
                      href="# "
                      onClick={() => history.push("/register")}
                      type="button"
                      className="mr-auto color-black"
                    >
                      Don't have an account?
                    </a>

                    <button
                      type="submit"
                      value="Submit"
                      className="btn btn-danger btn-custom login-button"
                      disabled={authLoading}
                    >
                      {authLoading
                        ? <Spinner size="sm" animation="border" variant="light" />
                        : <div>Submit</div>
                      }
                    </button>

                  </div>
                </form>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </>
      )
      }
    </>
  );
};

export default Login;
