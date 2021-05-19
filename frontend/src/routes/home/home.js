import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Container, Col, Row } from "react-bootstrap";

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
              <Row>
                <Col>
                  <h2>Welcome back, user.</h2>
                </Col>
                <Col></Col>
              </Row>
            </Container>
          </>
        ) : (
          <>
            <Container>
              <Row>
                <Col>
                  <h2>Log in to get started.</h2>
                </Col>
                <Col></Col>
              </Row>
            </Container>
          </>
        ))}
    </>
  );
};

export default Home;
