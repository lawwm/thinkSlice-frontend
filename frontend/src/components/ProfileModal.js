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

import { Modal, Button, Form, Nav } from "react-bootstrap";
import { StarDisplay } from "./StarRating.js";
import { CheckboxGroup } from "./CheckboxGroup.js";
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
  const [showTutorOptions, setShowTutorOptions] = useState(profile.basic.is_tutor);


  const [selectPage, setSelectPage] = useState("1")

  const handleSelectPage = (eventKey) => {
    setSelectPage(eventKey);
  };

  const setTutorDropdownDefault = (isStudent, isTutor) => {
    if (!isStudent && !isTutor) {
      return "0"
    } else if (!isStudent && isTutor) {
      return "1"
    } else if (isStudent && !isTutor) {
      return "2"
    } else {
      return "3"
    }
  }

  const onChangeBasic = (e) => {
    let updatedValue = e.target.value;
    switch (updatedValue) {
      case "available":
        setProfileBasic({
          ...profileBasic,
          available: true
        });
        break;
      case "unavailable":
        setProfileBasic({
          ...profileBasic,
          available: false
        });
        break;
      case "0":
        setProfileBasic({
          ...profileBasic,
          is_tutor: false,
          is_student: false,
        });
        break;
      case "1":
        setProfileBasic({
          ...profileBasic,
          is_tutor: true,
          is_student: false,
        });
        break;
      case "2":
        setProfileBasic({
          ...profileBasic,
          is_tutor: false,
          is_student: true,
        });
        break;
      case "3":
        setProfileBasic({
          ...profileBasic,
          is_tutor: true,
          is_student: true,
        });
        break;
      default:
        setProfileBasic({
          ...profileBasic,
          [e.target.name]: updatedValue,
        });
        break;
    }
  };

  const onChangeDetailed = (e) => {
    let updatedValue = e.target.value;

    if (updatedValue === "" || updatedValue === "null") {
      updatedValue = null;
    }

    setProfileDetails({
      ...profileDetails,
      [e.target.name]: updatedValue,
    });
  };

  const onChangeDuration = (e) => {
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

  const { username, user_bio, is_tutor, is_student, available } = profileBasic;
  const {
    tutor_whatsapp,
    tutor_telegram,
    aggregate_star,
    total_tutor_reviews,
    location,
    subjects,
    duration_classes,
    qualifications,
  } = profileDetails;

  const onSubmit = async (e) => {
    e.preventDefault()
    if (duration_classes[0] > duration_classes[1]) {
      dispatch(
        setAlert(
          "The min lesson duration cannot be greater than the max lesson duration",
          "danger"
        )
      );
    } else {
      // console.log(profileBasic, profileDetails)
      dispatch(toggleEditMode(false));
      dispatch(
        updateProfile(user, { basic: profileBasic, detailed: profileDetails })
      );
    }
  };

  const subjectList = (subjects) => {
    if (subjects === null) {
      return [];
    }
    let result = "";
    for (let i = 0; i < subjects.length; i++) {
      if (i === subjects.length - 1) {
        result += subjects[i];
      } else {
        result += subjects[i] + ", ";
      }
    }
    return result;
  };

  return (
    <>
      {editMode && (
        <Modal backdrop="static" show={detailedMode} size="lg" centered className="modal-style">
          <div>
            <Modal.Header>
              <h3>Editing profile details</h3>
            </Modal.Header>
            <Form onSubmit={(e) => onSubmit(e)}>
              <Modal.Body>
                {selectPage === "1" &&
                  (<>
                    <h4>User info</h4>
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="username"
                        name="username"
                        value={username}
                        className="modal-input"
                        onChange={(e) => onChangeBasic(e)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>User bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        // type="text"
                        name="user_bio"
                        value={user_bio}
                        className="modal-input"
                        onChange={(e) => onChangeBasic(e)}
                      />
                    </Form.Group>



                    <h4>Contact info</h4>
                    <Form.Group>
                      <Form.Label>Whatsapp</Form.Label>
                      <Form.Control
                        type="tel"
                        name="tutor_whatsapp"
                        value={tutor_whatsapp}
                        className="modal-input"
                        onChange={(e) => onChangeDetailed(e)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Telegram</Form.Label>
                      <Form.Control
                        type="username"
                        name="tutor_telegram"
                        defaultValue={tutor_telegram}
                        onChange={(e) => onChangeDetailed(e)}
                      />
                    </Form.Group>
                  </>)
                }
                {selectPage === "2" &&
                  (<><h4>User details</h4>
                    <Form.Group>
                      <Form.Label>Tutor/Student</Form.Label>
                      <Form.Control
                        as="select"
                        name="is_tutor"
                        className="modal-input"
                        defaultValue={setTutorDropdownDefault(profileBasic.is_student, profileBasic.is_tutor)}
                        onChange={(e) => {
                          onChangeBasic(e);
                          setShowTutorOptions(e.target.value % 2 !== 0);
                        }}
                      >
                        <option value="0">Just viewing</option>
                        <option value="1">Tutor</option>
                        <option value="2">Student</option>
                        <option value="3">Both</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Availability</Form.Label>
                      <Form.Control
                        as="select"
                        aria-label="Available"
                        name="is_available"
                        className="modal-input"
                        defaultValue={profileBasic.available ? "available" : "unavailable"}
                        onChange={(e) => {
                          onChangeBasic(e);
                        }}
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                      </Form.Control>
                    </Form.Group>
                    <div>
                      Helpful tip: Select your role as a student and/or tutor. Tutors get
                      to upload videos and display additional information on their profiles.
                      Set whether you are currently available as well.
                    </div>
                  </>)}
                {selectPage === "3" && (
                  <>
                    <Form.Group>
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        as="select"
                        name="location"
                        value={location}
                        className="modal-input"
                        onChange={(e) => onChangeDetailed(e)}
                      >
                        <option value="null">Do not specify</option>
                        <option value="north">North</option>
                        <option value="south">South</option>
                        <option value="east">East</option>
                        <option value="west">West</option>
                        <option value="central">Central</option>
                      </Form.Control>
                    </Form.Group>
                    <br />

                    <Form.Label>Subjects taught</Form.Label>
                    <Form.Group
                      name="subjects"
                      value={subjects}
                      onChange={(e) => {
                        onChangeDetailed(e);
                      }}
                    >
                      <CheckboxGroup subjectList={subjects} />
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Min Lesson duration (in hours)</Form.Label>
                      <Form.Control
                        type="range"
                        name="0"
                        value={duration_classes[0]}
                        onChange={(e) => onChangeDuration(e)}
                        min={0}
                        max={12}
                        custom
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Max Lesson duration (in hours)</Form.Label>
                      <Form.Control
                        type="range"
                        name="1"
                        value={duration_classes[1]}
                        onChange={(e) => onChangeDuration(e)}
                        min={0}
                        max={12}
                        custom
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Qualifications</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="qualifications"
                        value={qualifications}
                        className="modal-input"
                        onChange={(e) => onChangeDetailed(e)}
                      />
                    </Form.Group>
                  </>
                )}
                <Nav
                  fill
                  variant="pills"
                  defaultActiveKey={selectPage}
                  onSelect={handleSelectPage}
                >
                  <Nav.Item>
                    <Nav.Link className="tabs profile-modal-page" eventKey="1">
                      Page 1
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="tabs profile-modal-page" eventKey="2">
                      Page 2
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="tabs profile-modal-page" eventKey="3" disabled={!showTutorOptions}>
                      Page 3
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="btn-modal btn-danger"
                  onClick={(e) => onSubmit(e)}
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
                  <tbody>
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
                  </tbody>
                </table>
                <br />
                {is_tutor && (
                  <>
                    <h4>Tutor details</h4>
                    <table>
                      <tbody>
                        <tr>
                          <td>Available</td>
                          <td className="table-data">
                            {(is_tutor && is_student)
                              ?
                              available
                                ? "User is looking for students/teachers"
                                : "User is not looking for students/teachers"

                              : is_tutor
                                ?
                                available
                                  ? "User is looking for students"
                                  : "User is not looking for students"

                                : is_student
                                  ?
                                  available
                                    ? "User is looking for a teacher"
                                    : "User is not looking for a teacher"

                                  : "User is neither a tutor or student"
                            }
                          </td>
                        </tr>
                        <tr>
                          <td>Rating</td>
                          <td className="table-data">
                            {aggregate_star === null ? (
                              "User does not have any ratings yet"
                            ) : (
                              <>
                                <StarDisplay num={parseInt(aggregate_star)} />
                                <span className="add-margin-left">({total_tutor_reviews} reviews)</span>
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Location</td>
                          <td className="table-data">
                            {location || "User has not provided their location"}
                          </td>
                        </tr>
                        <tr>
                          <td>Subjects taught</td>
                          <td className="table-data">
                            {subjectList(subjects) ||
                              "User has not shared what subjects they teach"}
                          </td>
                        </tr>
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
                          <td className="table-data">
                            {qualifications ||
                              "User has not shared their qualifications"}
                          </td>
                        </tr>
                      </tbody>
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
