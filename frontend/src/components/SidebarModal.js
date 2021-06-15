import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap"
import { StarDisplay } from "./StarRating"

const subjects = [
  "Arts",
  "Biology",
  "Business",
  "Chemistry",
  "Computing",
  "Cooking",
  "Crafting",
  "Health",
  "Humanities",
  "Language",
  "Math",
  "Music",
  "Physics",
  "Sports",
  "Visual Arts",
];

const locations = [
  'Central',
  'North',
  'South',
  'East',
  'West'
]

export const SidebarModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};