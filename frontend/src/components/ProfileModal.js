import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../store/components/action";
import { logout } from "../store/auth/action.js";
import {
  toggleDetailedView,
  toggleEditMode,
  deleteProfile,
  updateProfile,
  // getProfile,
} from "../store/profile/action.js";
import update from "immutability-helper";

import { Modal, Button, Form } from "react-bootstrap";
import { StarDisplay } from "./StarRating.js";
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

  const oldProfileBasic = JSON.parse(JSON.stringify(profile.basic));
  const oldProfileDetails = JSON.parse(JSON.stringify(profile.detailed));

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

    if (updatedValue === "") {
      updatedValue = null;
    }

    setProfileDetails({
      ...profileDetails,
      [e.target.name]: updatedValue,
    });
  };

  const onChangeArray = (e) => {
    if (e.target.value === "0") {
      setProfileDetails(
        update(profileDetails, {
          duration_classes: {
            0: { $set: 0 },
            1: { $set: 0 },
          },
        })
      );
    } else {
      setProfileDetails(
        update(profileDetails, {
          duration_classes: {
            [e.target.name]: { $set: parseInt(e.target.value) },
          },
        })
      );
    }
  };

  const { username, user_bio, is_tutor } = profileBasic;
  const {
    tutor_whatsapp,
    tutor_telegram,
    aggregate_star,
    duration_classes,
    qualifications,
  } = profileDetails;

  const onSubmit = async (e) => {
    if (duration_classes[0] > duration_classes[1]) {
      dispatch(
        setAlert(
          "The min lesson duration cannot be greater than the max lesson duration",
          "danger"
        )
      );
    } else {
      dispatch(toggleEditMode(false));
      dispatch(
        updateProfile(user, { basic: profileBasic, detailed: profileDetails })
      );
    }
  };

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
                    name="tutor_whatsapp"
                    value={tutor_whatsapp}
                    className="modal-input"
                    onChange={(e) => onChangeDetailed(e)}
                  />
                  <Form.Label>Telegram</Form.Label>
                  <Form.Control
                    type="username"
                    name="tutor_telegram"
                    defaultValue={tutor_telegram}
                    onChange={(e) => onChangeDetailed(e)}
                  />
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
                      /> */}
                      <Form.Label>Min Lesson duration (in hours)</Form.Label>
                      <Form.Control
                        type="range"
                        name="0"
                        value={duration_classes[0]}
                        onChange={(e) => onChangeArray(e)}
                        min={0}
                        max={12}
                        custom
                      />
                      <Form.Label>Max Lesson duration (in hours)</Form.Label>
                      <Form.Control
                        type="range"
                        name="1"
                        value={duration_classes[1]}
                        onChange={(e) => onChangeArray(e)}
                        min={0}
                        max={12}
                        custom
                      />
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
                  onClick={(e) => onSubmit()}
                >
                  Save changes
                </Button>
                <Button
                  variant="dark"
                  className="btn-modal-grey"
                  onClick={() => {
                    dispatch(toggleEditMode(false));
                    setProfileBasic(oldProfileBasic);
                    setProfileDetails(oldProfileDetails);
                  }}
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
              <h3>
                {parseInt(userId) === parseInt(user)
                  ? "Your profile details"
                  : "Details"}
              </h3>
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
                      {tutor_whatsapp || "User has not provided their Whatsapp"}
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
                      {tutor_telegram || "User has not provided their Telegram"}
                    </td>
                  </tr>
                </table>
                <br />
                {is_tutor && (
                  <>
                    <h4>Tutor details</h4>
                    <table>
                      <tr>
                        <td>Rating</td>
                        <td className="table-data">
                          {aggregate_star === null ? (
                            "User does not have any ratings yet"
                          ) : (
                            <StarDisplay num={aggregate_star} />
                          )}
                        </td>
                      </tr>
                      {/* <tr>
                        <td>Subjects taught</td>
                        <td className="table-data">
                          {subjects}
                        </td>
                      </tr> */}
                      <tr>
                        <td>Lesson duration</td>
                        <td className="table-data">
                          {duration_classes[0] === 0
                            ? "User has not provided the duration of their lessons"
                            : duration_classes[0] === duration_classes[1]
                            ? duration_classes[0] + " hrs"
                            : duration_classes[0] +
                              " - " +
                              duration_classes[1] +
                              " hrs"}
                        </td>
                      </tr>
                      <tr>
                        <td>Qualifications</td>
                        <td className="table-data">{qualifications}</td>
                      </tr>
                    </table>
                  </>
                )}
              </div>
            </Modal.Body>
            {parseInt(userId) === parseInt(user) ? (
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
