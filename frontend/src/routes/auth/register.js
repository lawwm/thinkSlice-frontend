import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/auth/action";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Container, Col, Row, Spinner, Form } from "react-bootstrap";
import "../styles.css";

const Register = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, authLoading } = useSelector(
    (state) => state.auth
  );

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    }
  }, [isAuthenticated, history])

  const onChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(register(registerData));
  };

  const { username, email, password, confirmPassword } = registerData;

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Row>
              <Col xs={12} md={8} xl={6}>
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className="auth-form-div">
                    <h2>Register here.</h2>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        name="username"
                        aria-label="username"
                        className="form-control"
                        placeholder="Username"
                        onChange={(e) => onChange(e)}
                        value={username}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Control
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={(e) => onChange(e)}
                        value={email}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Control
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        onChange={(e) => onChange(e)}
                        value={password}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm Password"
                        onChange={(e) => onChange(e)}
                        value={confirmPassword}
                      />
                    </Form.Group>
                    {/* <div className="form-group row">
                      <input
                        type="text"
                        name="username"
                        aria-label="username"
                        className="form-control"
                        placeholder="Username"
                        onChange={(e) => onChange(e)}
                        value={username}
                      />
                    </div>
                    <div className="form-group row">
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        onChange={(e) => onChange(e)}
                        value={email}
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
                    <div className="form-group row">
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm Password"
                        onChange={(e) => onChange(e)}
                        value={confirmPassword}
                      />
                    </div> */}
                    <br />
                    <a
                      href="# "
                      onClick={() => history.push("/login")}
                      type="button"
                      className="color-black"
                    >
                      Already have an account?
                    </a>
                    <button
                      type="submit"
                      value="Submit"
                      className="btn btn-danger btn-custom register-button"
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <Spinner size="sm" animation="border" variant="light" />
                      ) : (
                        <div>Register account</div>
                      )}
                    </button>
                  </div>
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

export default Register;
