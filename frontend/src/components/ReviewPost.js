import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Image, Media, Card, Row, Col, Modal, Button, Container, Form, Spinner } from "react-bootstrap";
import { StarDisplay, StarChoice } from "../components/StarRating";
import "./components.css";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { deleteReviews, editReviews } from "../store/profile/action"
import { CheckboxGroup } from "./CheckboxGroup";

const ReviewPost = ({ reviewId, reviewPic, username, reviewTitle, reviewSubject, reviewEssay, dateReview, editedDateReview, starRating, subjects, edited, viewerId, profileId, reviewerId, asTutor, profilePic, profileName }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { reviewPostLoading } = useSelector((state) => state.profile);

  const [editShow, setEditShow] = useState(false);

  const handleEditClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true);

  const [deleteShow, setDeleteShow] = useState(false);

  const handleDeleteClose = () => setDeleteShow(false)
  const handleDeleteShow = () => setDeleteShow(true)

  const [formData, setFormData] = useState({
    "review_title": reviewTitle,
    "review_essay": reviewEssay,
    "star_rating": starRating,
    "review_subject": reviewSubject
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
      reviewId: reviewId
    }

    dispatch(editReviews(submitData, handleEditClose))
  }

  const onDelete = () => {
    dispatch(deleteReviews(reviewId, handleDeleteClose))
  }

  return (
    <Card>
      <div className="review-post-div">
        <Container fluid="md">
          <Media>
            <div
              className="thumbnail-photo mr-3"
              onClick={() => history.push(asTutor ? ("/profile/" + profileId) : ("/profile/" + reviewerId))}
            >
              <Image className="thumbnail-image" src={asTutor ? profilePic : reviewPic} alt="tutor profile picture" fluid />
            </div>
            <Media.Body className="align-self-center">
              <h5>{asTutor ? profileName : username}</h5>
            </Media.Body>

          </Media>
          <Card.Title className="review-title"><StarDisplay num={Math.round(starRating)} /> {reviewTitle} </Card.Title>

          <Card.Text className="review-text">
            {reviewEssay}
          </Card.Text>
          <footer className="review-date">
            <Row>
              <Col md={6}>
                <Media>
                  <div
                    className="thumbnail-photo mr-3"
                    onClick={() => history.push(asTutor ? ("/profile/" + reviewerId) : ("/profile/" + profileId))}
                  >
                    <Image className="thumbnail-image" src={asTutor ? reviewPic : profilePic} alt="student profile picture" fluid />
                  </div>
                  <Media.Body className="align-self-center">
                    {edited ? <span>Edited</span> : <span>Written</span>}
                    &nbsp;on {edited ? <span>{editedDateReview}</span> : <span>{dateReview}</span>}
                    &nbsp;by <b>{asTutor ? username : profileName}</b>
                  </Media.Body>

                </Media>

              </Col>
              {asTutor && (viewerId === reviewerId.toString()) &&
                <Col md={6}>
                  <div className="review-edit-delete-div">
                    <div>
                      <button
                        aria-label="show edit modal"
                        onClick={handleEditShow}
                        className="review-edit-delete-btn" >
                        <FaRegEdit size={30} />
                      </button>
                      <button
                        aria-label="show delete modal"
                        onClick={handleDeleteShow}
                        className="review-edit-delete-btn" >
                        <FaTrashAlt size={30} />
                      </button>
                    </div>
                  </div>
                </Col>}
              {!asTutor && (viewerId === profileId.toString()) &&
                <Col md={6}>
                  <div className="review-edit-delete-div">
                    <div>
                      <button
                        aria-label="show edit modal"
                        onClick={handleEditShow}
                        className="review-edit-delete-btn" >
                        <FaRegEdit size={30} />
                      </button>
                      <button
                        aria-label="show delete modal"
                        onClick={handleDeleteShow}
                        className="review-edit-delete-btn" >
                        <FaTrashAlt size={30} />
                      </button>
                    </div>
                  </div>
                </Col>}
            </Row>
          </footer>
        </Container>

        {/* edit modal */}
        <Modal backdrop="static" size="xl" show={editShow} onHide={handleEditClose}>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Container>
              <div className="create-review-modal">
                <div className="create-review-header">
                  <h2>Edit Review</h2>
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
                  <Form.Group
                      name="review_subject"
                      value={formData.review_subject}
                      onChange={(e) => {
                        onChange(e);
                      }}
                    >
                      <CheckboxGroup checkedSubjects={subjects} subjectList={subjects}/>
                    </Form.Group>
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
                  aria-label="close edit modal"
                  className="btn-review-alt-custom"
                  variant="secondary"
                  onClick={handleEditClose}>
                  Close
                </Button>
                <Button
                  aria-label="submit edit modal"
                  type="submit"
                  value="Submit"
                  className="btn-review-custom edit-review-btn"
                  variant="primary"
                >
                  {reviewPostLoading
                    ? <Spinner size="sm" animation="border" variant="light" />
                    : <div>Submit</div>}
                </Button>
              </Modal.Footer>
            </Container>
          </Form>
        </Modal>

        {/* delete modal */}
        <Modal show={deleteShow} onHide={handleDeleteClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete review</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure about this? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button
              aria-label="close delete modal"
              className="btn-review-alt-custom"
              variant="secondary"
              onClick={handleDeleteClose}>
              Close
            </Button>
            <Button
              aria-label="submit delete modal"
              className="btn-review-custom edit-review-btn"
              variant="primary"
              onClick={onDelete}>
              {reviewPostLoading
                ? <Spinner size="sm" animation="border" variant="light" />
                : <div>Delete</div>}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Card>
  );
};

export default ReviewPost;
