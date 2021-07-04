import React, { useState } from "react";
import { Row, Media, Image, Modal, Button, Spinner, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { setVideoLoading } from "../store/home/action";
import { deleteVideo, editVideo } from "../store/profile/action"
import { setAlert } from "../store/components/action";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { subjects } from "./CheckboxGroup";
const Thumbnail = ({ title, videoDescription, username, views, date, subject, playback_id, imageSrc, videoId, profileId, deleteButton = false }) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [urlFormat, setUrlFormat] = useState("/thumbnail.jpg?width=600&height=300&fit_mode=crop")
  const animateThumbnail = (shouldAnimate) => {
    shouldAnimate
      ? setUrlFormat("/animated.gif?width=600&height=300")
      : setUrlFormat("/thumbnail.jpg?width=600&height=300&fit_mode=crop")
  }

  const { profile } = useSelector((state) => state.profile)

  //Edit data information
  const [videoData, setVideoData] = useState({
    video_title: title,
    subject: subject,
    video_description: videoDescription,
  });
  const onChange = (e) => {
    setVideoData({
      ...videoData,
      [e.target.name]: e.target.value,
    });
  };
  const onEdit = () => {
    setThumbnailLoading(true)
    if (profile === null) {
      dispatch(setAlert("You can only edit thumbnails on the profile page", "danger"))
    }
    let profileSubjects = profile.basic.video.filter(video => video.id !== videoId)
    profileSubjects = profileSubjects.map(video => video.subject)
    if (profileSubjects.includes(videoData.subject)) {
      dispatch(setAlert("You already have a video for this subject", "danger"))
    }
    dispatch(editVideo(videoId, videoData, handleEditClose, () => setThumbnailLoading(false)))
  }
  const [editShow, setEditShow] = useState(false)
  const handleEditClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true)

  //Delete data information
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false)
  const handleDeleteShow = () => setDeleteShow(true)

  const [thumbnailLoading, setThumbnailLoading] = useState(false)

  const onDelete = () => {
    setThumbnailLoading(true)
    dispatch(deleteVideo(videoId, handleDeleteClose, () => setThumbnailLoading(false)))
  }

  return (
    <>
      <div className="thumbnail-div" >
        <div className="thumbnail-image-div">
          <Image
            src={"https://image.mux.com/" + playback_id + urlFormat}
            onClick={() => {
              dispatch(setVideoLoading())
              history.push('/watch/' + videoId)
            }
            }
            onMouseEnter={() => animateThumbnail(true)}
            onMouseLeave={() => animateThumbnail(false)}
            alt="video thumbnail"
            fluid>
          </Image>
          <div className="thumbnail-subject-info">
            {subject}
          </div>
          <div className="thumbnail-subject-duration">
            {date}
          </div>
          <div className="thumbnail-subject-profile-div">
            {deleteButton &&
              <>
                <div
                  onClick={handleEditShow}
                  className="thumbnail-subject-edit">
                  <FaEdit role="img" aria-label="edit" alt="edit" size={18} />
                </div>
                <div
                  onClick={handleDeleteShow}
                  className="thumbnail-subject-delete">
                  <FaTrashAlt role="img" aria-label="delete" alt="delete" size={18} />
                </div>
              </>}
          </div>
        </div>

        <Media>
          <div className="thumbnail-photo" onClick={() => history.push('/profile/' + profileId)}>
            <Image
              className="thumbnail-image"
              src={imageSrc}
              alt="profile picture" fluid />
          </div>

          <Media.Body onClick={() => history.push('/watch/' + videoId)}>
            <div className="thumbnail-body">
              <Row>
                <h5 className="thumbnail-title">{title}</h5>
              </Row>
              <Row>
                <div className="thumbnail-caption">{username} </div>
                <div className="thumbnail-line">{views} views</div>
              </Row>
            </div>
          </Media.Body>
        </Media>
        {/* delete modal */}
        <Modal show={deleteShow} onHide={handleDeleteClose} >
          <Modal.Header closeButton>
            <Modal.Title>Delete video</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure about this? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button className="btn-review-alt-custom" variant="secondary" onClick={handleDeleteClose}>
              Close
            </Button>
            <Button
              className="btn-review-custom edit-review-btn"
              variant="primary"
              onClick={onDelete}>

              {thumbnailLoading
                ? <Spinner size="sm" animation="border" variant="light" />
                : <div>Delete</div>}
            </Button>
          </Modal.Footer>
        </Modal>
        {/* edit modal */}
        <Modal backdrop="static" show={editShow} >
          <Modal.Header>
            <Modal.Title>Edit video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                name="video_title"
                className="form-control"
                placeholder="Title"
                onChange={(e) => onChange(e)}
                value={videoData.video_title}
                required
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Control
                type="text"
                name="subject"
                className="form-control"
                placeholder="Subject"
                onChange={(e) => onChange(e)}
                value={videoData.subject}
                as="select">
                <option value="Subject">Subject</option>
                {subjects.map((subject, index) => {
                  return (
                    <option key={index} value={subject}>{subject}</option>
                  )
                })}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control
                placeholder="Description"
                as="textarea"
                name="video_description"
                className="form-control"
                onChange={(e) => onChange(e)}
                value={videoData.video_description}
                required
                rows={4} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-review-alt-custom" variant="secondary" onClick={handleEditClose}>
              Close
            </Button>
            <Button
              className="btn-review-custom edit-review-btn"
              variant="primary"
              onClick={onEdit}>
              {thumbnailLoading
                ? <Spinner size="sm" animation="border" variant="light" />
                : <div>Edit</div>}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Thumbnail;
