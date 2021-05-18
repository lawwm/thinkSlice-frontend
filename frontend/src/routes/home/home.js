import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/auth/action";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Col, Container } from "react-bootstrap";

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading &&
        (isAuthenticated ? (
          <>
            <Container>
              <Col></Col>
              <h2>Hi you are registered user</h2>
              <Col></Col>
            </Container>
          </>
        ) : (
          <>
            <Container>
              <Col></Col>
              <h2>You are not logged in by keep browsing I guess</h2>
              <Col></Col>
            </Container>
          </>
        ))}
    </>
  );
};

export default Home;
