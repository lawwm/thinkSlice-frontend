import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../store/auth/action.js";

import LoadingSpinner from "../../components/LoadingSpinner";
import { Container, Col, Row, Spinner, Form } from "react-bootstrap";
import "../styles.css";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, authLoading } = useSelector((state) => state.auth);



  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated, history])

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
              <Col xs={12} md={7} xl={6}>
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className="login-form-div">
                    <h2>Log in to start learning.</h2>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        name="username"
                        className="form-control"
                        placeholder="Username"
                        onChange={(e) => onChange(e)}
                        value={username}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Control
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        onChange={(e) => onChange(e)}
                        value={password} />
                    </Form.Group>
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
            </Row>
          </Container>
        </>
      )
      }
    </>
  );
};

export default Login;
