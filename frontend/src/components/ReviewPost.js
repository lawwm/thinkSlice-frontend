import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Image, Media, Card, Row, Col, Modal, Button, Container, Form, Spinner } from "react-bootstrap";
import { StarDisplay, StarChoice } from "../components/StarRating";
import "./components.css";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { deleteReviews, editReviews } from "../store/profile/action"

const ReviewPost = ({ reviewId, reviewPic, username, reviewTitle, reviewEssay, dateReview, editedDateReview, starRating, edited, viewerId, profileId, reviewerId, asTutor }) => {
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
    "star_rating": starRating
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
      <Media className="reviewer">
        <div
          className="thumbnail-photo mr-3"
          onClick={() => history.push("/profile/" + profileId)}
        >
          <Image src={reviewPic} alt="profile picture" fluid />
        </div>
        <Media.Body className="align-self-center">
          <h5>{username}</h5>
        </Media.Body>
      </Media>
      <div className="review-div">
        <Card.Title className="review-title"><StarDisplay num={Math.round(starRating)} /> {reviewTitle} </Card.Title>

        <Card.Text className="review-text">
          {reviewEssay}
        </Card.Text>
        <footer className="review-date">
          <Row>
            <Col md={6}>
              {edited ? <span>Edited</span> : <span>Written</span>}
              &nbsp;on {edited ? <span>{editedDateReview}</span> : <span>{dateReview}</span>}
            </Col>
            {asTutor && (viewerId === reviewerId.toString()) &&
              <Col md={6}>
                <div className="review-edit-delete-div">
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
              </Col>}
            {!asTutor && (viewerId === profileId.toString()) &&
              <Col md={6}>
                <div className="review-edit-delete-div">
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
              </Col>}
          </Row>
        </footer>
      </div>

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
    </Card>
  );
};

export default ReviewPost;
