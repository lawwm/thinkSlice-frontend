import React from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Container, Col, Row } from "react-bootstrap";
import "../styles.css";

const Profile = () => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Row>
              <Col>
                <div className="padding-around">
                  <h2>Joe Biden</h2>
                  <p>
                    Hi, I’m here to make some side income when I’m not occupied
                    with my day job. Hope I can teach you about my signature
                    cream of mushroom soup.
                  </p>
                </div>
              </Col>
              <Col></Col>
            </Row>
            <div className = "padding-around">
              <button className="btn profile-tag" disabled>
                Tutor
              </button>
              <button className="btn profile-button">Details</button>
              <button className="btn profile-button">Reviews</button>
            </div>
            <hr></hr>
            <Row>
              <div className="padding-around">
                <h2>Videos</h2>
              </div>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default Profile;
