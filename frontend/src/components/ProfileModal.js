import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/action.js";
import {
  toggleDetailedView,
  toggleEditMode,
  deleteProfile,
} from "../store/profile/action.js";
import "./components.css";

import { Modal, Button } from "react-bootstrap";

const ProfileModal = (userId) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [smallModalOpen, setSmallModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { detailedMode, editMode, profile } = useSelector(
    (state) => state.profile
  );

  return (
    <>
      <Modal show={detailedMode} size="lg" centered className="modal-style">
        <div>
          <Modal.Header>
            <h3>Your profile settings</h3>
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
