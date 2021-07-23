import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import {
  getProfile,
  toggleDetailedView,
  changePicture,
  openReviews,
} from "../../store/profile/action.js";
import { profileLikedVideos } from "../../store/profile/action.js";
import NotFound from "../errorpages/notFound";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ProfileModal from "../../components/ProfileModal.js";
import Thumbnail from "../../components/Thumbnail.js";
import {
  Container,
  Col,
  Row,
  Modal,
  Button,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";
import "../styles.css";
import {
  reopenClosedChat,
  setActive,
  startChat,
} from "../../store/chat/action.js";
import { StarDisplay } from "../../components/StarRating.js";
import ReviewModal from "../../components/ReviewModal.js";

const ShowVideoModal = ({ userId, setLikedModal }) => {
  const dispatch = useDispatch();

  const { profileLikes } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(profileLikedVideos(userId, () => setLoading(false)));
  }, [dispatch, userId, profileLikes]);

  return (
    <>
      <Modal.Header>
        <Modal.Title>User's liked videos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-md-left">
          {profileLikes.map((video) => {
            return (
              <Col
                key={video.id}
                xs={12}
                sm={6}
                xl={4}
                className="home-video-row"
              >
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
        {loading && <LoadingSpinner />}
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
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { profile, profileLoading, profileComponentLoading } = useSelector(
    (state) => state.profile
  );
  const { activeChat, chatComponentLoading, chats } = useSelector(
    (state) => state.chat
  );

  const { user_id } = useParams();
  const currentViewer = localStorage.getItem("user");

  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    //if profile is already loaded for current user, do not call API
    if (profile === null) {
      dispatch(getProfile(user_id));
    } else if (user_id !== profile.basic.user.toString()) {
      dispatch(getProfile(user_id));
    }
  }, [user_id, dispatch, profile]);

  useEffect(() => {
    if (startingChat && activeChat) {
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
              <div className="home-div">
                <Row>
                  <Col xs={{ span: 12, offset: 0 }} md={{ span: 8, offset: 1 }}>
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
                    {profile.basic.is_tutor && (
                      <p>
                        <StarDisplay num={profile.detailed.aggregate_star} />
                        <span className="add-margin-left">
                          ({profile.detailed.total_tutor_reviews}{" "}
                          {profile.detailed.total_tutor_reviews === 1
                            ? "review"
                            : "reviews"}
                          )
                        </span>
                      </p>
                    )}
                  </Col>
                  <Col xs={12} md={3}>
                    <div
                      onClick={() =>
                        setPictureModal(true && currentViewer === user_id)
                      }
                      className={
                        currentViewer === user_id
                          ? "profile-pic-container circle center-profile"
                          : "circle center-profile"
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
                  <Col
                    xs={{ span: 12, offset: 0 }}
                    md={{ span: 11, offset: 1 }}
                    className="center-profile-text"
                  >
                    <ButtonGroup className="profile-button" size="lg">
                      <Button
                        variant="secondary"
                        onClick={() => dispatch(toggleDetailedView(true))}
                      >
                        Details
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => dispatch(openReviews())}
                      >
                        Reviews
                      </Button>
                      {currentViewer && currentViewer !== user_id && (
                        <Button
                          variant="secondary"
                          className="profile-button-chat"
                          onClick={() => {
                            setStartingChat(true);
                            const alreadyExists = chats.find(
                              (chat) => chat.recipient === parseInt(user_id)
                            );
                            if (alreadyExists) {
                              dispatch(setActive(alreadyExists.chatroom));
                              if (alreadyExists.hidden) {
                                dispatch(reopenClosedChat(alreadyExists));
                              }
                            } else {
                              dispatch(startChat(user_id));
                            }
                          }}
                          disabled={chatComponentLoading}
                        >
                          {chatComponentLoading ? (
                            <Spinner
                              className="profile-spinner"
                              size="sm"
                              animation="border"
                              variant="light"
                            />
                          ) : (
                            "Chat"
                          )}
                        </Button>
                      )}
                    </ButtonGroup>
                  </Col>
                </Row>
                <br />
                <hr></hr>
                <br />

                {profile.basic.video.length !== 0 && (
                  <>
                    <Row>
                      <Container>
                        <h2>Videos</h2>
                        <Row className="justify-content-md-left">
                          {profile.basic.video.map((videoRow) => {
                            return (
                              <Col
                                key={videoRow.id}
                                xs={12}
                                md={6}
                                xl={4}
                                className="home-video-row"
                              >
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
                                  profileId={profile.basic.user}
                                  deleteButton={currentViewer === user_id}
                                />
                              </Col>
                            );
                          })}
                        </Row>
                      </Container>
                    </Row>
                    <br />
                    <hr></hr>
                    <br />
                  </>
                )}
                <Row>
                  <Container>
                    <h2>Liked videos</h2>
                    <div>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => setLikedModal(true)}
                      >
                        View
                      </Button>
                    </div>
                  </Container>
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

            {/* Show profile details modal */}

            <ProfileModal userId={user_id} />

            {/* Show reviews modal */}

            <ReviewModal isOpen={profile.reviewsOpen} />

            {/* Show liked videos modal */}

            <Modal
              show={likedModal}
              onHide={() => setLikedModal(false)}
              size="lg"
            >
              <ShowVideoModal
                userId={user_id}
                setLikedModal={(x) => setLikedModal(x)}
              />
            </Modal>

            {/* Upload image modal */}

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
