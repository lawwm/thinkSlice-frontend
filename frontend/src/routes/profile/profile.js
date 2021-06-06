import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import { getProfile, toggleDetailedView, changePicture } from "../../store/profile/action.js";

import NotFound from "../errorpages/notFound";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ProfileModal from "../../components/ProfileModal.js";
import Thumbnail from "../../components/Thumbnail.js";
import { Container, Col, Row, Modal, Button, Spinner } from "react-bootstrap";
import "../styles.css";

const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { profile, profileLoading, profileComponentLoading } = useSelector((state) => state.profile);
  const { user_id } = useParams();
  const currentViewer = localStorage.getItem("user")

  useEffect(() => {
    dispatch(getProfile(user_id));
  }, [user_id, dispatch]);

  const [pictureModal, setPictureModal] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null)

  const onUploadChange = (file) => {
    setImageFile(file);
    URL.revokeObjectURL(imageURL)
    setImageURL(URL.createObjectURL(file))
  };

  const uploadProfilePicture = (e) => {
    e.preventDefault();
    dispatch(changePicture(imageFile, () => setPictureModal(false)))
  };

  return (
    <>
      {profileLoading && <LoadingSpinner />}
      {!profileLoading &&
        (profile !== null ? (
          <>
            <Container>
              <div className="profile-div">
                <Row className="margin-left">
                  <Col className="mr-auto p-2 col-example" xs={8}>
                    <div className="username-tag-div">
                      <h2>{profile.basic.username}</h2>
                      {profile.basic.is_tutor && <button className="btn profile-tag" disabled>
                        Tutor
                      </button>}
                      {profile.basic.is_student && <button className="btn profile-tag" disabled>
                        Student
                      </button>}
                    </div>
                    <p>{profile.basic.user_bio}</p>
                  </Col>
                  <Col>
                    <div
                      onClick={() => setPictureModal(true && (currentViewer === user_id))}
                      className={(currentViewer === user_id) ? "profile-pic-container circle" : "circle"}>
                      <img
                        src={profile.basic.profile_pic}
                        alt="profile_pic"
                        fluid
                        className="profile-pic"
                      />
                      <div className="profile-pic-middle">
                        <div className="profile-pic-text">Edit profile?</div>
                      </div>
                    </div>
                  </Col>
                  <Row>

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
                    {profile.basic.video.map((videoRow) => {
                      return (
                        <div key={videoRow.id} className="home-video-row">
                          <Col md={"auto"} >
                            <Thumbnail
                              title={videoRow.video_title}
                              username={profile.basic.username}
                              views={videoRow.views}
                              subject={videoRow.subject}
                              date={videoRow.created_at}
                              playback_id={videoRow.playback_id}
                              imageSrc={profile.basic.profile_pic}
                              videoId={videoRow.id}
                              profileId={videoRow.creator_profile.user}
                              deleteButton={(currentViewer === user_id)}
                            />
                          </Col>
                        </div>
                      )
                    })}
                  </div>
                </Row>
                <Row className="margin-left-less">
                  <Col>{/* <Thumbnail className="remove-margin" /> */}</Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
              </div>
            </Container>

            <ProfileModal userId={user_id} />

            <Modal show={pictureModal} onHide={() => setPictureModal(false)} className="modal-style" size="lg">
              <Modal.Header>
                <Modal.Title>Change your profile picture.</Modal.Title>
              </Modal.Header>
              <form id="uploadbanner" encType="multipart/form-data" onSubmit={(e) => { uploadProfilePicture(e) }} >
                <Modal.Body>
                  <div className='profile-upload-layout'>
                    <div>Upload your picture here.</div>

                    <div >
                      <img alt="Preview" className="image-preview" src={imageURL} />
                    </div>
                    <div>
                      <label htmlFor="file-upload" className='custom-file-upload btn btn-danger' >
                        Select File
                      </label>
                      <input id="file-upload" name='file-upload' type="file" onChange={(e) => onUploadChange(e.target.files[0])} />
                    </div>
                    <div className="profile-pic-upload-note">Note: Image should be less than 100kb</div>
                  </div>

                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="dark"
                    className="btn-modal-grey"
                    onClick={() => setPictureModal(false)}
                  >
                    Go back
              </Button>
                  <Button
                    type="submit"
                    value="Submit"
                    variant="danger"
                    className="btn-modal btn-danger profile-pic-upload-btn"
                    onSubmit={(e) => {
                      uploadProfilePicture(e)
                    }}
                  >
                    {profileComponentLoading
                      ? <Spinner size="sm" animation="border" variant="light" />
                      : "Upload"
                    }
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
          </>
        ) : (
          <NotFound />
        ))}
    </>
  );
};

export default Profile;
