import React, { useState } from "react";
import { Row, Media, Image, Modal, Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { setVideoLoading } from "../store/home/action";
import { deleteVideo } from "../store/profile/action"
import { useDispatch } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";
const Thumbnail = ({ title, username, views, date, subject, playback_id, imageSrc, videoId, profileId, deleteButton = false }) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [urlFormat, setUrlFormat] = useState("/thumbnail.jpg")
  const animateThumbnail = (shouldAnimate) => {
    shouldAnimate
      ? setUrlFormat("/animated.gif")
      : setUrlFormat("/thumbnail.jpg")
  }

  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false)
  const handleDeleteShow = () => setDeleteShow(true)

  const [thumbnailLoading, setThumbnailLoading] = useState(false)

  const onDelete = () => {
    setThumbnailLoading(true)
    // console.log(videoId)
    // console.log("start deleting")
    dispatch(deleteVideo(videoId, handleDeleteClose, () => setThumbnailLoading(false)))
  }

  return (
    <>
      <div className="thumbnail-div" >
        <Image
          width={337}
          height={192}
          src={"https://image.mux.com/" + playback_id + urlFormat}
          onClick={() => {
            dispatch(setVideoLoading())
            history.push('/watch/' + videoId)
          }
          }
          onMouseEnter={() => animateThumbnail(true)}
          onMouseLeave={() => animateThumbnail(false)}
          alt="video thumbnail">
        </Image>
        <div className="thumbnail-subject-info">
          {subject}
        </div>
        <div className="thumbnail-subject-duration">
          {date}
        </div>
        {deleteButton &&
          <div
            onClick={handleDeleteShow}
            className="thumbnail-subject-delete">
            <FaTrashAlt role="img" alt="delete" size={18} />
          </div>}
        <Media>
          <div className="thumbnail-photo" onClick={() => history.push('/profile/' + profileId)}>
            <Image src={imageSrc} alt="profile picture" fluid />
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
        <Modal show={deleteShow} onHide={handleDeleteClose}>
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
      </div>
    </>
  );
};

export default Thumbnail;
