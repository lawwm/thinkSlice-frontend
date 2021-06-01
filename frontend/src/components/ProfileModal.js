import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/action.js";
import {
  toggleDetailedView,
  toggleEditMode,
  deleteProfile,
  updateProfile,
  // getProfile,
} from "../store/profile/action.js";

import { Modal, Button, Form } from "react-bootstrap";
import whatsapp from "../images/Whatsapp.png";
import telegram from "../images/Telegram.png";
import "./components.css";

const ProfileModal = ({ userId }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [smallModalOpen, setSmallModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { detailedMode, editMode, profile } = useSelector(
    (state) => state.profile
  );

  const [profileBasic, setProfileBasic] = useState(profile.basic);
  const [profileDetails, setProfileDetails] = useState(profile.detailed);
  const [showTutorOptions, setTutorOptions] = useState(profile.basic.is_tutor);

  const onChangeBasic = (e) => {
    let updatedValue = e.target.value;

    if (updatedValue === "true" || updatedValue === "false") {
      updatedValue = JSON.parse(updatedValue);
      setProfileBasic({
        ...profileBasic,
        is_tutor: updatedValue,
        is_student: !updatedValue,
      });
      return;
    }

    setProfileBasic({
      ...profileBasic,
      [e.target.name]: updatedValue,
    });
  };

  const onChangeDetailed = (e) => {
    let updatedValue = e.target.value;

    setProfileDetails({
      ...profileDetails,
      [e.target.name]: updatedValue,
    });
  };

  const onSubmit = async (e) => {
    dispatch(toggleEditMode(false));
    dispatch(
      updateProfile(user, { basic: profileBasic, detailed: profileDetails })
    );
  };

  const { username, user_bio, is_tutor } = profileBasic;
  const { tutor_contact, qualifications } = profileDetails;

  return (
    <>
      {editMode && (
        <Modal show={detailedMode} size="lg" centered className="modal-style">
          <div>
            <Modal.Header>
              <h3>Editing profile details</h3>
            </Modal.Header>
            <Form onSubmit={(e) => onSubmit(e)}>
              <Modal.Body>
                <Form.Group>
                  <h4>User info</h4>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="username"
                    name="username"
                    value={username}
                    className="modal-input"
                    onChange={(e) => onChangeBasic(e)}
                  />
                  <Form.Label>User bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="user_bio"
                    value={user_bio}
                    className="modal-input"
                    onChange={(e) => onChangeBasic(e)}
                  />
                </Form.Group>

                <Form.Group>
                  <h4>Contact info</h4>
                  <Form.Label>Whatsapp</Form.Label>
                  <Form.Control
                    type="tel"
                    name="tutor_contact"
                    value={tutor_contact}
                    className="modal-input"
                    onChange={(e) => onChangeDetailed(e)}
                  />
                  <Form.Label>Telegram</Form.Label>
                  {/* <Form.Control
                    type="username"
                    name="tutor_contact"
                    defaultValue={tutor_telegram}
                    onChange={(e) => onChangeDetailed(e)}
                  /> */}
                </Form.Group>

                <Form.Group>
                  <h4>User details</h4>
                  <Form.Label>Tutor/Student</Form.Label>
                  <Form.Control
                    as="select"
                    name="is_tutor"
                    value={is_tutor}
                    className="modal-input"
                    onChange={(e) => {
                      onChangeBasic(e);
                      setTutorOptions(!showTutorOptions);
                    }}
                  >
                    <option value="true">Tutor</option>
                    <option value="false">Student</option>
                  </Form.Control>
                  {showTutorOptions && (
                    <>
                      {/* <Form.Label>Subjects taught</Form.Label>
                      <Form.Control
                        type="text"
                        name="subjects"
                        value={subjects}
                        onChange={(e) => onChangeDetailed(e)}
                      />
                      <Form.Label>Lesson duration (in hours)</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration_classes"
                        value={duration_classes}
                        onChange={(e) => onChangeBasic(e)}
                      /> */}
                      <Form.Label>Qualifications</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="qualifications"
                        value={qualifications}
                        className="modal-input"
                        onChange={(e) => onChangeDetailed(e)}
                      />
                    </>
                  )}
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
              <h3>{user === userId.user_id ? "Your profile details" : "Details"}</h3>
              <Button
                className="btn-circle btn-danger"
                onClick={() => dispatch(toggleDetailedView(false))}
              >
                ✖
              </Button>
            </Modal.Header>
            <Modal.Body>
              <div>
                <h4>Contact info</h4>
                <table>
                  <tr>
                    <td className="table-data-alt">
                      <img
                        src={whatsapp}
                        alt="whatsapp"
                        className="small-icon"
                      />
                    </td>
                    <td className="table-data">
                      {profile.detailed.tutor_contact ||
                        "User has not provided their Whatsapp"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-data-alt">
                      <img
                        src={telegram}
                        alt="telegram"
                        className="small-icon"
                      />
                    </td>
                    <td className="table-data">
                      {profile.detailed.tutor_contact ||
                        "User has not provided their Telegram"}
                    </td>
                  </tr>
                </table>
                <br />
                {profile.basic.is_tutor && (
                  <>
                    <h4>Tutor details</h4>
                    <table>
                      <tr>
                        <td>Rating</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Subjects taught</td>
                        <td className="table-data">
                          {profile.detailed.subjects}
                        </td>
                      </tr>
                      <tr>
                        <td>Lesson duration</td>
                        <td className="table-data">
                          {profile.detailed.duration_classes}
                        </td>
                      </tr>
                      <tr>
                        <td>Qualifications</td>
                        <td className="table-data">
                          {profile.detailed.qualifications}
                        </td>
                      </tr>
                    </table>
                  </>
                )}
              </div>
            </Modal.Body>
            {user == userId ? (
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
            ) : null}
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
              dispatch(deleteProfile(user));
              dispatch(logout());
              history.push("/login");
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
