import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/action.js";
import {
  toggleDetailedView,
  toggleEditMode,
  deleteProfile,
  updateProfile,
  getProfile,
} from "../store/profile/action.js";
import "./components.css";

import { Modal, Button, Form } from "react-bootstrap";

const ProfileModal = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [smallModalOpen, setSmallModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { detailedMode, editMode, profile } = useSelector(
    (state) => state.profile
  );

  const [profileDetails, setProfileDetails] = useState(profile);

  const onChange = (e) => {
    let updatedValue = e.target.value;

    if (updatedValue === "true" || updatedValue === "false") {
        updatedValue = JSON.parse(updatedValue);
    }

    setProfileDetails({
      ...profileDetails,
      [e.target.name]: updatedValue,
    });
  };

  const onSubmit = async (e) => {
    dispatch(updateProfile(user, profileDetails));
    dispatch(getProfile(user));
    dispatch(toggleEditMode(false));
  };

  const {
    username,
    user_bio,
    tutor_contact,
    is_tutor,
    subjects,
    duration_classes,
    qualifications,
  } = profileDetails;

  return (
    <>
      {editMode && (
        <Modal show={detailedMode} size="lg" centered className="modal-style">
          <div>
            <Form onSubmit={(e) => onSubmit(e)} className="modal-form">
              <Modal.Header>
                <h3>Editing profile details</h3>
              </Modal.Header>
              <Modal.Body>
                <h4>User info</h4>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => onChange(e)}
                  />
                  <Form.Label>User bio</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_bio"
                    value={user_bio}
                    onChange={(e) => onChange(e)}
                  />
                </Form.Group>
                <h4>Contact info</h4>
                <Form.Group>
                  <Form.Label>Whatsapp</Form.Label>
                  <Form.Control
                    type="tel"
                    name="tutor_contact"
                    value={tutor_contact}
                    onChange={(e) => onChange(e)}
                  />
                  {/* <Form.Label>Telegram</Form.Label>
                  <Form.Control
                    type="text"
                    name="tutor_contact"
                    defaultValue={tutor_contact}
                    onChange={(e) => onChange(e)}
                  /> */}
                </Form.Group>
                <h4>User details</h4>
                <Form.Group>
                  <Form.Label>Tutor/Student</Form.Label>
                  <Form.Control
                    as="select"
                    name="is_tutor"
                    value = {is_tutor}
                    onChange={(e) => onChange(e)}
                  >
                    <option value="true">Tutor</option>
                    <option value="false">Student</option>
                  </Form.Control>
                  <Form.Label>Subjects taught</Form.Label>
                  <Form.Control
                    type="text"
                    name="subjects"
                    value={subjects}
                    onChange={(e) => onChange(e)}
                  />
                  <Form.Label>Lesson duration (in hours)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration_classes"
                    value={duration_classes}
                    onChange={(e) => onChange(e)}
                  />
                  <Form.Label>Qualifications</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualifications"
                    value={qualifications}
                    onChange={(e) => onChange(e)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="btn-modal btn-danger"
                  type="submit"
                  value="submit"
                >
                  Save changes
                </Button>
                <Button
                  variant="dark"
                  className="btn-modal-grey"
                  onClick={() => dispatch(toggleEditMode(false))}
                >
                  Cancel changes
                </Button>
              </Modal.Footer>
            </Form>
          </div>
        </Modal>
      )}

      {!editMode && (
        <Modal
          show={detailedMode}
          size="lg"
          centered
          className="modal-style"
          onHide={() => dispatch(toggleDetailedView(false))}
        >
          <div>
            <Modal.Header>
              <h3>Your profile details</h3>
              <Button
                className="btn-circle btn-danger"
                onClick={() => dispatch(toggleDetailedView(false))}
              >
                ✖
              </Button>
            </Modal.Header>
            <Modal.Body>
              <div>
                <table>
                  <h4>Contact info</h4>
                  <tr>
                    <td>Whatsapp</td>
                    <td className="table-data">{profile.tutor_contact}</td>
                  </tr>
                  <tr>
                    <td>Telegram</td>
                    <td className="table-data">{profile.tutor_contact}</td>
                  </tr>
                </table>
                <br />
                <table>
                  <h4>User details</h4>
                  <tr>
                    <td>Rating</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Subjects taught</td>
                    <td className="table-data">{profile.subjects}</td>
                  </tr>
                  <tr>
                    <td>Lesson duration</td>
                    <td className="table-data">{profile.duration_classes}</td>
                  </tr>
                  <tr>
                    <td>Qualifications</td>
                    <td>{profile.qualifications}</td>
                  </tr>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn-modal btn-danger"
                onClick={() => dispatch(toggleEditMode(true))}
              >
                Edit profile
              </Button>
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
      )}

      <Modal show={smallModalOpen} size="sm" centered>
        <Modal.Header>
          <Modal.Title>You are about to delete your account.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be
          undone.
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
              history.push("/");
            }}
          >
            Delete my account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileModal;
