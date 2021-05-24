import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/auth/action";
import LoadingSpinner from "../../components/LoadingSpinner";
import NavBar from "../../components/NavBar";
import { Container, Col, Row } from "react-bootstrap";
import "../styles.css";

const Register = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(username);

    dispatch(register(registerData));
    // setRegisterData({
    //     username: "",
    //     email: "",
    //     password: ""
    // })
  };

  if (isAuthenticated) {
    history.push("/");
  }

  const { username, email, password } = registerData;

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Row>
              <Col>
                <h2>Register here.</h2>
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
                      type="text"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      onChange={(e) => onChange(e)}
                      value={email}
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
                  {/*
              <br />
              <input
                type="confirmPassword"
                name="comfirmPassword"
                placeholder="Confirm Password"
              /> */}
                  <br />
                  <a
                    onClick={() => history.push("/login")}
                    type="button"
                    className="color-black"
                  >
                    Already have an account?
                  </a>
                  <button
                    type="submit"
                    value="Submit"
                    className="btn btn-danger btn-custom"
                  >
                    Register account
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

export default Register;
