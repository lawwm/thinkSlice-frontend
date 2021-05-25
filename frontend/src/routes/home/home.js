import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import NavBar from "../../components/NavBar.js"
import { Container, Col, Row } from "react-bootstrap";
import "../styles.css";

const Home = () => {

  const { isAuthenticated, loading, username } = useSelector((state) => state.auth);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading &&
        (isAuthenticated ? (
          <>
            <Container>
              <Row>
                <Col>
                  <h2>Welcome back, {username}.</h2>
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
