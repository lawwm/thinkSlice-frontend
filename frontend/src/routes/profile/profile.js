import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getProfile, toggleDetailedView } from "../../store/profile/action.js";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import ProfileModal from "../../components/ProfileModal.js";
import Thumbnail from "../../components/Thumbnail.js";
import { Container, Col, Row, Media, Image } from "react-bootstrap";
import "../styles.css";
import axios from "axios";

const Profile = () => {

  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const { user_id } = useParams();

  useEffect(() => {
    dispatch(getProfile(user_id));
  }, [user_id]);

  const [imageFile, setImageFile] = useState(null);
  const [pictureModal, setPictureModal] = useState(false);
  const onUploadChange = (file) => {
    console.log(file);
    console.log(file.name);
    setImageFile(file);
  };

  const uploadProfilePicture = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("profile_pic", imageFile, imageFile.name);
    console.log("/api/profiles/" + localStorage.user);
    axios.post("/api/profiles/" + localStorage.user, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Row className="margin-left">
              <Media className="d-flex">
                <Media.Body className="mr-auto p-2 col-example">
                  <h2>{profile.basic.username}</h2>
                  <p>{profile.basic.user_bio}</p>
                  <br />
                  <button className="btn profile-tag" disabled>
                    {profile.is_tutor ? "Tutor" : "Student"}
                  </button>
                  <button
                    className="btn profile-button"
                    onClick={() => dispatch(toggleDetailedView(true))}
                  >
                    Details
                  </button>
                  <button className="btn profile-button">Reviews</button>
                </Media.Body>

                <div
                  className="profile-picture circle align-self-center ml-3"
                  onClick={() => setPictureModal(true)}
                >
                  <Image
                    src={profile.basic.profile_pic}
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
