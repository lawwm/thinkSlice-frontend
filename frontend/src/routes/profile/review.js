import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewPost from "../../components/ReviewPost";
// import { getReviews } from "../../store/profile/action";
import "../styles.css";
import { setAlert } from "../../store/components/action";

import {
  Container,
  Col,
  Row,
  Image,
  Nav,
  Button,
  Modal,
  Form,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";

import {
  getProfile,
  getReviews,
  createReviews,
} from "../../store/profile/action";

import { StarChoice, StarDisplay } from "../../components/StarRating";
import { CheckboxGroup } from "../../components/CheckboxGroup";

const MapReviews = ({
  reviews,
  viewerId,
  profileId,
  asTutor,
  profilePic,
  profileName,
}) => {
  return (
    <>
      {reviews.map((review, index) => {
        return (
          <Fragment key={index}>
            <ReviewPost
              reviewId={review.id}
              reviewPic={review.creator_details.profile_pic}
              username={review.creator_details.username}
              reviewTitle={review.review_title}
              subjects={review.review_subject}
              reviewEssay={review.review_essay}
              dateReview={review.date_review}
              editedDateReview={review.date_review_edited}
              starRating={review.star_rating}
              edited={review.edited}
              viewerId={viewerId}
              profileId={profileId}
              reviewerId={review.creator_details.user}
              asTutor={asTutor}
              profilePic={profilePic}
              profileName={profileName}
            />
          </Fragment>
        );
      })}
    </>
  );
};

const Review = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user_id } = useParams();
  const {
    profile,
    profileLoading,
    reviewsGiven,
    reviewsReceived,
    reviewLoading,
    reviewUser,
  } = useSelector((state) => state.profile);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const viewerId = localStorage.getItem("user");

  useEffect(() => {
    //if profile is already loaded for current user, do not call API
    if (profile === null) {
      //if profile is not loaded
      dispatch(getProfile(user_id));
    } else if (user_id !== profile.basic.user.toString()) {
      //if profile is changed to another user
      dispatch(getProfile(user_id));
    }
  }, [user_id, dispatch, profile]);

  useEffect(() => {
    //if review have not loaded, or review loaded is not current user's
    if (user_id !== reviewUser) {
      dispatch(getReviews(user_id));
    }
  }, [user_id, dispatch, reviewUser]);

  const [selectReview, setSelectReview] = useState("reviewsReceived");

  useEffect(() => {
    if (profile) {
      setSelectReview(
        profile.basic.is_tutor ? "reviewsReceived" : "reviewsGiven"
      );
    }
  }, [profile]);

  const handleSelect = (eventKey) => {
    setSelectReview(eventKey);
    // console.log(selectReview);
  };

  //Create Review Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (!isAuthenticated) {
      dispatch(
        setAlert("You have to be a registered user to post a review", "danger")
      );
    } else {
      setShow(true);
    }
  };

  const [formData, setFormData] = useState({
    review_title: "",
    review_subject: [],
    review_essay: "",
    star_rating: 0,
  });

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const changeRating = (index) => {
    setFormData({
      ...formData,
      star_rating: index,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //create review
    const { review_title, review_subject, review_essay, star_rating } =
      formData;
    const submitData = {
      review_title: review_title,
      review_subject: review_subject,
      review_essay: review_essay,
      star_rating: star_rating,
      tutorId: user_id,
    };

    dispatch(
      createReviews(submitData, handleClose, () =>
        setFormData({
          review_title: "",
          review_subject: [],
          review_essay: "",
          star_rating: 0,
        })
      )
    );
  };

  return (
    <>
      {profileLoading && <LoadingSpinner />}
      {!profileLoading && (
        <Container fluid="md">
          <div className="home-div">
            <Row className="review-header-div">
              <Col className="center-profile-text" xs={12} sm={8}>
                <div>
                  <div className="review-username-title">
                    {profile.basic.username + "'s reviews"}
                  </div>
                  <div className="review-header-div">
                    {profile.detailed.aggregate_star !== null && (
                      <StarDisplay
                        num={profile.detailed.aggregate_star}
                        size={35}
                      />
                    )}
                  </div>
                  <ButtonGroup
                    className="review-header-div"
                    aria-label="Basic example"
                  >
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => history.push("/profile/" + user_id)}
                    >
                      Back to profile
                    </Button>
                    {profile.basic.is_tutor &&
                      profile.basic.user.toString() !== viewerId && (
                        <Button
                          size="lg"
                          variant="secondary"
                          className="post-review-btn"
                          onClick={handleShow}
                        >
                          Post review
                        </Button>
                      )}
                  </ButtonGroup>
                </div>
              </Col>
              <Col xs={12} sm={4}>
                <div className="circle center-profile">
                  <Image
                    className="profile-pic"
                    src={profile.basic.profile_pic}
                    alt="profile_pic"
                    onClick={() => history.push("/profile/" + user_id)}
                    fluid="true"
                  />
                </div>
              </Col>
            </Row>
            <br />
            <Nav
              justify
              variant="tabs"
              defaultActiveKey={
                profile.basic.is_tutor ? "reviewsReceived" : "reviewsGiven"
              }
              onSelect={handleSelect}
            >
              {profile.basic.is_tutor && (
                <Nav.Item>
                  <Nav.Link className="tabs" eventKey="reviewsReceived">
                    <span className="review-word-span">Reviews received</span>
                  </Nav.Link>
                </Nav.Item>
              )}
              {profile.basic.is_student && (
                <Nav.Item>
                  <Nav.Link className="tabs" eventKey="reviewsGiven">
                    <span className="review-word-span">Reviews given</span>
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
            {reviewLoading && (
              <div className="review-loading-div">
                <LoadingSpinner />
              </div>
            )}
            {!reviewLoading &&
              !profile.basic.is_tutor &&
              !profile.basic.is_student && (
                <>
                  <div className="no-review-message">
                    User is not a student or a tutor.
                  </div>
                </>
              )}
            {!reviewLoading &&
              selectReview === "reviewsReceived" &&
              profile.basic.is_tutor && (
                <>
                  {reviewsReceived.length === 0 ? (
                    <div className="no-review-message">
                      User has not received any reviews as a tutor.
                    </div>
                  ) : (
                    <MapReviews
                      reviews={reviewsReceived}
                      viewerId={viewerId}
                      profileId={profile.basic.user}
                      asTutor={true}
                      profilePic={profile.basic.profile_pic}
                      profileName={profile.basic.username}
                    />
                  )}
                </>
              )}
            {!reviewLoading &&
              selectReview === "reviewsGiven" &&
              profile.basic.is_student && (
                <>
                  {reviewsGiven.length === 0 ? (
                    <div className="no-review-message">
                      User has not given any reviews as a student.
                    </div>
                  ) : (
                    <MapReviews
                      reviews={reviewsGiven}
                      viewerId={viewerId}
                      profileId={profile.basic.user}
                      asTutor={false}
                      profilePic={profile.basic.profile_pic}
                      profileName={profile.basic.username}
                    />
                  )}
                </>
              )}
            <div className="review-empty-space"></div>
            {/* Post Modal set up below */}
            <Modal backdrop="static" size="xl" show={show} onHide={handleClose}>
              <Form onSubmit={(e) => onSubmit(e)}>
                <Container>
                  <div className="create-review-modal">
                    <div className="create-review-header">
                      <h2>Submit Review</h2>
                      <div className="create-review-rating-div">
                        <StarChoice
                          rating={formData.star_rating}
                          setRating={changeRating}
                        />
                      </div>
                    </div>
                    <Form.Group controlId="formGroupEmail">
                      <Form.Control
                        as="input"
                        placeholder="Title"
                        name="review_title"
                        value={formData.review_title}
                        onChange={(e) => onChange(e)}
                      />
                      <Form.Label className="review-form-header">Subjects studied</Form.Label>
                      <Form.Group
                        name="review_subject"
                        value={formData.review_subject}
                        onChange={(e) => {
                          onChange(e);
                        }}
                      >
                        <CheckboxGroup
                          checkedSubjects={formData.review_subject}
                          subjectList={profile.detailed.subjects}
                        />
                      </Form.Group>
                      <Form.Control
                        className="create-review-textarea"
                        rows={8}
                        as="textarea"
                        name="review_essay"
                        placeholder="Description"
                        value={formData.review_essay}
                        onChange={(e) => onChange(e)}
                      />
                    </Form.Group>
                  </div>
                  <Modal.Footer>
                    <Button
                      className="btn-review-alt-custom"
                      variant="secondary"
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      value="Submit"
                      className="btn-review-custom create-review-btn"
                      variant="primary"
                    >
                      {reviewLoading ? (
                        <Spinner size="sm" animation="border" variant="light" />
                      ) : (
                        <div>Submit</div>
                      )}
                    </Button>
                  </Modal.Footer>
                </Container>
              </Form>
            </Modal>
          </div>
        </Container>
      )}
    </>
  );
};

export default Review;
