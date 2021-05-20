import React from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import Thumbnail from "../../components/Thumbnail.js";
import { Container, Col, Row, Media, Image } from "react-bootstrap";
import profilePic from "../../images/Joe_Biden.jpg";
import "../styles.css";

const Profile = () => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Row className="padding-around">
              <Media>
                <Media.Body>
                  <h2>Joe Biden</h2>
                  <p>
                    Hi, I’m here to make some side income when I’m not occupied
                    with my day job. Hope I can teach you about my signature
                    cream of mushroom soup.
                  </p>
                </Media.Body>
                <div className="circle ml-3">
                  <Image
                    src={profilePic}
                    alt="Joe Biden"
                    fluid
                  />
                </div>
              </Media>
            </Row>
            <br />
            <Row className="padding-around">
              <button className="btn profile-tag" disabled>
                Tutor
              </button>
              <button className="btn profile-button">Details</button>
              <button className="btn profile-button">Reviews</button>
            </Row>
            <hr></hr>
            <Row className="padding-around">
              <div>
                <h2>Videos</h2>
              </div>
              <Container>
                <Row>
                  <Col><Thumbnail /></Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
              </Container>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default Profile;
