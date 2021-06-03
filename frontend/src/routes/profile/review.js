import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewPost from "../../components/ReviewPost";
// import { getReviews } from "../../store/profile/action";

import { Container, Col, Row, Image, Nav, Button, Modal, Form, Spinner } from "react-bootstrap";
import "../styles.css";

import { getProfile, getReviews, createReviews } from "../../store/profile/action"

import { StarChoice } from "../../components/StarRating"

const MapReviews = ({ reviews, viewerId, profileId, asTutor }) => {
  return (
    <>
      {
        reviews.map((review, index) => {
          return (
            <Fragment key={index}>
              <ReviewPost
                reviewId={review.id}
                reviewPic={review.creator_details.profile_pic}
                username={review.creator_details.username}
                reviewTitle={review.review_title}
                reviewEssay={review.review_essay}
                dateReview={review.date_review}
                starRating={review.star_rating}
                viewerId={viewerId}
                profileId={profileId}
                reviewerId={review.creator_details.user}
                asTutor={asTutor}
              />
            </Fragment>
          )
        })
      }
    </>
  )
}

const Review = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user_id } = useParams();
  const { profile, profileLoading, reviewsGiven, reviewsReceived, reviewLoading } = useSelector((state) => state.profile);

  const viewerId = localStorage.getItem("user")

  useEffect(() => {
    dispatch(getProfile(user_id));
    dispatch(getReviews(user_id));
  }, [user_id, dispatch]);

  const [selectReview, setSelectReview] = useState("reviewReceived")
  const handleSelect = (eventKey) => {
    setSelectReview(eventKey)
  }

  //Create Review Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Set rating star
  // const [rating, setRating] = React.useState(0);

  const [formData, setFormData] = useState({
    "review_title": "",
    "review_essay": "",
    "star_rating": 0
  })

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const changeRating = (index) => {
    setFormData({
      ...formData,
      "star_rating": index
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    //create review
    const { review_title, review_essay, star_rating } = formData;
    const submitData = {
      review_title: review_title,
      review_essay: review_essay,
      star_rating: star_rating,
      tutorId: user_id
    }

    dispatch(createReviews(submitData, handleClose, () => setFormData({
      "review_title": "",
      "review_essay": "",
      "star_rating": 0
    })))
  }

  return (
    <>
      {profileLoading && <LoadingSpinner />}
      {!profileLoading && (
        <Container>
          <Row className="review-header-div">
            <Col className="align-self-center" xs={8}>
              <div>
                <h2>
                  {/* {profile.basic.is_tutor
                    ? "User reviews for " + profile.basic.username
                    : "User reviews by " + profile.basic.username} */}
                  {profile.basic.username + "'s reviews"}
                </h2>
                <Button
                  className="btn-nav btn review-button"
                  onClick={() => history.push("/profile/" + user_id)}
                >
                  Return to user profile
              </Button>
                <Button
                  className="btn review-button-alt"
                  onClick={handleShow}
                >
                  Post review
              </Button>
              </div>
            </Col>
            <Col>
              <div className="profile-picture circle align-self-center ml-3">
                <Image
                  src={profile.basic.profile_pic}
                  alt="profile_pic"
                  fluid
                />
              </div>
            </Col>
          </Row>
          <br />
          <Nav justify variant="tabs" defaultActiveKey="reviewReceived" onSelect={handleSelect}>
            <Nav.Item>
              <Nav.Link className="tabs" eventKey="reviewReceived">
                As tutor
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="tabs" eventKey="reviewsGiven">
                As student
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {reviewLoading &&
            <div className="review-loading-div">
              <LoadingSpinner />
            </div>}
          {!reviewLoading && selectReview === "reviewReceived" && <MapReviews
            reviews={reviewsReceived}
            viewerId={viewerId}
            profileId={profile.basic.user}
            asTutor={true}
          />
          }
          {reviewLoading && selectReview === "reviewsGiven" && <MapReviews
            reviews={reviewsGiven}
            viewerId={viewerId}
            profileId={profile.basic.user}
            asTutor={false}
          />
          }
          {/* Modal set up below */}
          <Modal backdrop="static" size="xl" show={show} onHide={handleClose}>
            <Form onSubmit={(e) => onSubmit(e)}>
              <Container>
                <div className="create-review-modal">
                  <div className="create-review-header">
                    <h2>Submit Review</h2>
                    <div className="create-review-rating-div">
                      <StarChoice rating={formData.star_rating} setRating={changeRating} />
                    </div>
                  </div>
                  <Form.Group controlId="formGroupEmail">
                    <Form.Control
                      as='input'
                      placeholder="Title"
                      name="review_title"
                      value={formData.review_title}
                      onChange={(e) => onChange(e)}
                    />
                    <Form.Control
                      className="create-review-textarea"
                      rows={8}
                      as='textarea'
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
                    onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    value="Submit"
                    className="btn-review-custom create-review-btn"
                    variant="primary"
                  >
                    {reviewLoading
                      ? <Spinner size="sm" animation="border" variant="light" />
                      : <div>Submit</div>}
                  </Button>
                </Modal.Footer>
              </Container>
            </Form>
          </Modal>
        </Container>
      )}
    </>
  );
};

export default Review;
