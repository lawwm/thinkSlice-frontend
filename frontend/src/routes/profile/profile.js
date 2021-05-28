import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import { getProfile, toggleDetailedView } from "../../store/profile/action.js";

import NotFound from "../errorpages/notFound";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ProfileModal from "../../components/ProfileModal.js";
// import Thumbnail from "../../components/Thumbnail.js";
import { Container, Col, Row, Image, Modal } from "react-bootstrap";
import "../styles.css";
// import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { profile, loading } = useSelector((state) => state.profile);
  const { user_id } = useParams();

  useEffect(() => {
    dispatch(getProfile(user_id));
  }, [user_id, dispatch]);

  // const [imageFile, setImageFile] = useState(null);
  const [pictureModal, setPictureModal] = useState(false);
  // const onUploadChange = (file) => {
  //   console.log(file);
  //   console.log(file.name);
  //   setImageFile(file);
  // };

  // const uploadProfilePicture = (e) => {
  //   e.preventDefault();
  //   let formData = new FormData();
  //   formData.append("profile_pic", imageFile, imageFile.name);
  //   console.log("/api/profiles/" + localStorage.user);
  //   axios.post("/api/profiles/" + localStorage.user, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // };

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading &&
        (profile !== null ? (
          <>
            <Container>
              <Row className="margin-left">
                <Col className="mr-auto p-2 col-example" xs={8}>
                  <h2>{profile.basic.username}</h2>
                  <p>{profile.basic.user_bio}</p>
                </Col>
                <Col>
                  <div className="profile-picture circle align-self-center ml-3">
                    <Image
                      src={profile.basic.profile_pic}
                      alt="profile_pic"
                      fluid
                      onClick={() => setPictureModal(true)}
                      className="profile-pic"
                    />
                  </div>
                </Col>
                <Row>
                  <button className="btn profile-tag" disabled>
                    {profile.basic.is_tutor ? "Tutor" : "Student"}
                  </button>
                  <button
                    className="btn profile-button"
                    onClick={() => dispatch(toggleDetailedView(true))}
                  >
                    Details
                  </button>
                  <button
                    className="btn profile-button"
                    onClick={() => history.push("/profile/reviews/" + user_id)}
                  >
                    Reviews
                  </button>
                </Row>
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

            <ProfileModal userId={user_id} />

            <Modal show={pictureModal} onHide={() => setPictureModal(false)}>
              <Modal.Header closeButton>

              </Modal.Header>
              <Modal.Body></Modal.Body>
            </Modal>
          </>
        ) : (
          <NotFound />
        ))}
    </>
  );
};

export default Profile;
