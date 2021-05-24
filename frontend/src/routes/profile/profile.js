import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { toggleDetailedView } from "../../store/profile/action.js";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import ProfileModal from "../../components/ProfileModal.js";
import Thumbnail from "../../components/Thumbnail.js";
import {
  Container,
  Col,
  Row,
  Media,
  Image
} from "react-bootstrap";
import "../styles.css";

const Profile = () => {
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Row className="margin-left">
              <Media className="d-flex">
                <Media.Body className="mr-auto p-2 col-example">
                  <h2>{profile.username}</h2>
                  <p>{profile.user_bio}</p>
                  <br />
                  <button className="btn profile-tag" disabled>
                    {profile.is_tutor ? "Tutor" : "Student"}
                  </button>
                  <button className="btn profile-button" onClick={() => dispatch(toggleDetailedView(true))}>
                    Details
                  </button>
                  <button className="btn profile-button">Reviews</button>
                </Media.Body>
                <div className="circle align-self-center ml-3">
                  <Image
                    src={require("." + profile.profile_pic).default}
                    alt="profile_pic"
                    fluid
                  />
                </div>
              </Media>
            </Row>
            <br />
            <hr></hr>
            <br />
            <Row className="margin-left">
              <div>
                <h2>Videos</h2>
              </div>
            </Row>
            <Row className="margin-left-less">
              <Col>{/* <Thumbnail className="remove-margin" /> */}</Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </Container>

          <ProfileModal />
        </>
      )}
    </>
  );
};

export default Profile;
