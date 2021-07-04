import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import {
  getProfile,
  toggleDetailedView,
  changePicture,
} from "../../store/profile/action.js";
import { startChat } from "../../store/chat/action.js";
import { profileLikedVideos } from "../../store/profile/action.js";
import NotFound from "../errorpages/notFound";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ProfileModal from "../../components/ProfileModal.js";
import Thumbnail from "../../components/Thumbnail.js";
import { Container, Col, Row, Modal, Button, Spinner } from "react-bootstrap";
import "../styles.css";

const ShowVideoModal = ({ userId, setLikedModal }) => {
  const dispatch = useDispatch();

  const { profileLikes } = useSelector(
    (state) => state.profile
  );

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (profileLikes.length === 0) {
      dispatch(profileLikedVideos(userId, () => setLoading(false)))
    } else {
      setLoading(false)
    }
  }, [dispatch, userId, profileLikes])

  return (
    <>
      <Modal.Header>
        <Modal.Title>User's liked videos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          loading && <LoadingSpinner />
        }
        {!loading &&
          <Row className="justify-content-md-left">
            {profileLikes.map((video) => {
              return (
                <Col key={video.id} xs={12} sm={6} xl={4} className="home-video-row">
                  <Thumbnail
                    title={video.video_title}
                    username={video.creator_profile.username}
                    views={video.views}
                    subject={video.subject}
                    date={video.created_at}
                    playback_id={video.playback_id}
                    imageSrc={video.creator_profile.profile_pic}
                    videoId={video.id}
                    profileId={video.creator_profile.user}
                  />
                </Col>
              );
            })}
          </Row>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          className="btn-modal-grey"
          onClick={() => setLikedModal(false)}
        >
          Go back
        </Button>
      </Modal.Footer>
    </>
  )
}

const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { profile, profileLoading, profileComponentLoading } = useSelector(
    (state) => state.profile
  );
  const { activeChat, chatComponentLoading } = useSelector(
    (state) => state.chat
  );

  const { user_id } = useParams();
  const currentViewer = localStorage.getItem("user");

  useEffect(() => {
    dispatch(getProfile(user_id));
  }, [user_id, dispatch]);

  useEffect(() => {
    if (activeChat) {
      history.push("/chat");
    }
  });

  const [pictureModal, setPictureModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const onUploadChange = (file) => {
    setImageFile(file);
    URL.revokeObjectURL(imageURL);
    setImageURL(URL.createObjectURL(file));
  };

  const uploadProfilePicture = (e) => {
    e.preventDefault();
    dispatch(changePicture(imageFile, () => setPictureModal(false)));
  };

  const [likedModal, setLikedModal] = useState(false);

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
                      {profile.basic.is_tutor && (
                        <button className="btn profile-tag" disabled>
                          Tutor
                        </button>
                      )}
                      {profile.basic.is_student && (
                        <button className="btn profile-tag" disabled>
                          Student
                        </button>
                      )}
                    </div>
                    <p>{profile.basic.user_bio}</p>
                  </Col>
                  <Col>
                    <div
                      onClick={() =>
                        setPictureModal(true && currentViewer === user_id)
                      }
                      className={
                        currentViewer === user_id
                          ? "profile-pic-container circle"
                          : "circle"
                      }
                    >
                      <img
                        src={profile.basic.profile_pic}
                        alt="profile_pic"
                        fluid="true"
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
                      onClick={() =>
                        history.push("/profile/reviews/" + user_id)
                      }
                    >
                      Reviews
                    </button>
                    {currentViewer && currentViewer !== user_id && (
                      <button
                        className="btn profile-button"
                        onClick={() => dispatch(startChat(user_id))}
                        disabled={chatComponentLoading}
                      >
                        {chatComponentLoading ? (
                          <Spinner
                            size="sm"
                            animation="border"
                            variant="light"
                          />
                        ) : (
                          "Chat"
                        )}
                      </button>
                    )}
                  </Row>
                </Row>
                <br />
                <hr></hr>
                <br />
                <Row className="margin-left">
                  <div>
                    <h2>Videos</h2>
                    <Row className="justify-content-md-left">
                      {profile.basic.video.map((videoRow) => {
                        return (
                          <Col key={videoRow.id} xs={12} md={6} xl={4} className="home-video-row">
                            <Thumbnail
                              title={videoRow.video_title}
                              username={profile.basic.username}
                              videoDescription={videoRow.video_description}
                              views={videoRow.views}
                              subject={videoRow.subject}
                              date={videoRow.created_at}
                              playback_id={videoRow.playback_id}
                              imageSrc={profile.basic.profile_pic}
                              videoId={videoRow.id}
                              profileId={videoRow.creator_profile.user}
                              deleteButton={currentViewer === user_id}
                            />
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </Row>
                <br />
                <hr></hr>
                <br />
                <Row className="margin-left">
                  <h2>Liked videos</h2>
                  <div>
                    <button
                      className="btn profile-button"
                      onClick={() =>
                        setLikedModal(true)
                      }
                    >
                      View
                    </button>
                  </div>
                </Row>
                <br />
                <hr></hr>
                <br />
                <Row className="margin-left-less">
                  <Col>{/* <Thumbnail className="remove-margin" /> */}</Col>
                  <Col></Col>
                  <Col></Col>
                </Row>
              </div>
            </Container>

            <ProfileModal userId={user_id} />

            <Modal
              show={likedModal}
              onHide={() => setLikedModal(false)}
              size="lg">
              <ShowVideoModal userId={user_id} setLikedModal={(x) => setLikedModal(x)} />
            </Modal>

            <Modal
              show={pictureModal}
              onHide={() => setPictureModal(false)}
              className="modal-style"
              size="lg"
            >
              <Modal.Header>
                <Modal.Title>Change your profile picture.</Modal.Title>
              </Modal.Header>
              <form
                id="uploadbanner"
                encType="multipart/form-data"
                onSubmit={(e) => {
                  uploadProfilePicture(e);
                }}
              >
                <Modal.Body>
                  <div className="profile-upload-layout">
                    <div>Upload your picture here.</div>

                    <div>
                      <img
                        alt="Preview"
                        className="image-preview"
                        src={imageURL}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="file-upload"
                        className="custom-file-upload btn btn-danger"
                      >
                        Select File
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        onChange={(e) => onUploadChange(e.target.files[0])}
                      />
                    </div>
                    <div className="profile-pic-upload-note">
                      Note: Image should be less than 100kb
                    </div>
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
                      uploadProfilePicture(e);
                    }}
                  >
                    {profileComponentLoading ? (
                      <Spinner size="sm" animation="border" variant="light" />
                    ) : (
                      "Upload"
                    )}
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
