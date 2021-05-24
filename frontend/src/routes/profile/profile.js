import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../store/auth/action.js";
import { deleteProfile } from "../../store/profile/action.js";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import NavBar from "../../components/NavBar.js";
import Thumbnail from "../../components/Thumbnail.js";
import defaultPic from "../../images/default.jpg";
import {
  Container,
  Col,
  Row,
  Media,
  Image,
  Modal,
  Button,
} from "react-bootstrap";
import "../styles.css";
import axios from 'axios'


const Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const [smallModalOpen, setSmallModalOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pictureModal, setPictureModal] = useState(false);

  const handleClose = () => setModalIsOpen(false);
  const handleShow = () => setModalIsOpen(true);


  const [imageFile, setImageFile] = useState(null)
  const onUploadChange = (file) => {
    console.log(file)
    console.log(file.name)
    setImageFile(file)
  }

  const uploadProfilePicture = (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('profile_pic', imageFile, imageFile.name)
    console.log('/api/profiles/' + localStorage.user)
    axios.post('/api/profiles/' + localStorage.user, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <NavBar />
          <Container>
            <Row className="margin-left">
              <Media className="d-flex">
                <Media.Body className="mr-auto p-2 col-example">
                  <h2>{profile.username}</h2>
                  <p>{profile.user_bio}</p>
                  <br />
                  <button className="btn profile-tag" disabled>
                    {profile.is_tutor ? "Tutor" : "Student"}
                  </button>
                  <button className="btn profile-button" onClick={handleShow}>
                    Edit
                  </button>
                  <button className="btn profile-button">Reviews</button>
                </Media.Body>
                <div className="profile-picture circle align-self-center ml-3" onClick={() => setPictureModal(true)}>
                  <Image src={defaultPic} alt="profile_pic" fluid />
                </div>
              </Media>
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
              <Col>
                {/* <Thumbnail className="remove-margin" /> */}
              </Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </Container>

          <Modal show={modalIsOpen} size="lg" centered className="modal-style">
            <div>
              <Modal.Header>
                <h3>Update account settings</h3>
                <Button className="btn-circle btn-danger" onClick={handleClose}>
                  ✖
                </Button>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <h4>User info</h4>
                  <ul>
                    <li>Username</li>
                    <li>Password</li>
                    <li>Email</li>
                    <li>Change profile picture</li>
                  </ul>
                </div>
                <br />
                <div>
                  <h4>Contact info</h4>
                  <ul>
                    <li>Whatsapp</li>
                    <li>Telegram</li>
                  </ul>
                </div>
                <br />
                <div>
                  <h4>User details</h4>
                  <ul>
                    <li>Subjects taught</li>
                    <li>Lesson duration</li>
                    <li>Tutor/Student</li>
                  </ul>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn-modal btn-danger">Save changes</Button>
                <Button
                  variant="dark"
                  className="btn-modal-grey"
                  onClick={() => setSmallModalOpen(true)}
                >
                  Delete account
                </Button>
              </Modal.Footer>
            </div>
          </Modal>

          <Modal show={smallModalOpen} size="sm" centered>
            <Modal.Header>
              <Modal.Title>You are about to delete your account.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="dark"
                className="btn-grey"
                onClick={() => setSmallModalOpen(false)}
              >
                Go back
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  dispatch(logout());
                  dispatch(deleteProfile(user));
                  history.push("/")
                }}
              >
                Delete my account
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={pictureModal} onHide={() => setPictureModal(false)} className="modal-style" size="lg" centered>
            <Modal.Header>
              <Modal.Title>Change your profile picture.</Modal.Title>
            </Modal.Header>
            <form id="uploadbanner" encType="multipart/form-data" onSubmit={(e) => { uploadProfilePicture(e) }} >
              <Modal.Body>
                Upload your picture here.
                <div className='upload-layout'>
                  <label htmlFor="file-upload" className='custom-file-upload btn btn-danger' >
                    Select File
                      </label>
                  <input id="file-upload" name='file-upload' type="file" onChange={(e) => onUploadChange(e.target.files[0])} />
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
                  className="btn-modal btn-danger"
                  onSubmit={(e) => {
                    uploadProfilePicture(e)
                  }}
                >
                  Upload
              </Button>
              </Modal.Footer>
            </form>
          </Modal>
        </>
      )}
    </>
  );
};

export default Profile;
