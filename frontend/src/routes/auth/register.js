import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/auth/action";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Col, Container } from "react-bootstrap";

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
            <Col></Col>
            <h2>Register here.</h2>
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
                type="text"
                name="email"
                placeholder="Email"
                onChange={(e) => onChange(e)}
                value={email}
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
              {/* <br />
              <br />
              <input
                type="confirmPassword"
                name="comfirmPassword"
                placeholder="Confirm Password"
              /> */}
              <input type="submit" value="Submit" />
            </form>
            <br />
            <button onClick={() => history.push("/login")} type="button">
              Have an account? Login here!
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

export default Register;
