import React from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import NavBar from "../../components/NavBar";
import Thumbnail from "../../components/Thumbnail.js";
import profileModal from "../../components/profileModal.js";
import { Container, Col, Row, Media, Image } from "react-bootstrap";
import "../styles.css";

const Profile = () => {
  const { loading, profile } = useSelector((state) => state.profile);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <NavBar />
          <Container>
            <Row className="margin-left">
              <Media>
                <Media.Body>
                  <h2>{profile.username}</h2>
                  <p>{profile.user_bio}</p>
                  <br />
                  <button className="btn profile-tag" disabled>
                    {profile.is_tutor ? "Tutor" : "Student"}
                  </button>
                  <button className="btn profile-button" onClick={<profileModal />}>Details</button>
                  <button className="btn profile-button">Reviews</button>
                </Media.Body>
                <div className="circle ml-3">
                  <Image src={profile.profile_pic} alt="profile_pic" fluid />
                </div>
              </Media>
            </Row>
            <br />
            <hr></hr>
            <Row className="margin-left">
                <div>
                  <h2>Videos</h2>
                </div>
              </Row>
              <Row className="margin-left-less">
                <Col>
                  <Thumbnail className="remove-margin"/>
                </Col>
                <Col></Col>
                <Col></Col>
              </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default Profile;
