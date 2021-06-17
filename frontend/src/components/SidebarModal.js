import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"
import { StarDisplay } from "./StarRating"
import { useDispatch } from "react-redux";
import { changeAvailable, changeLocation, changeSubject, changeReview } from "../store/home/action"
import "./components.css"
import { subjects } from "./CheckboxGroup";

const locations = [
  'Central',
  'North',
  'South',
  'East',
  'West'
]

const rating = [5, 4, 3, 2, 1]

export const SidebarModal = ({ show, handleClose, selectedSubject, selectedLocation, selectedAvailability, selectedReview }) => {
  const [filterForm, setFilterForm] = useState({
    available: selectedAvailability,
    subject: selectedSubject,
    location: selectedLocation,
    review: selectedReview
  })

  const dispatch = useDispatch()

  const onSubmitModalFilter = () => {
    dispatch(changeAvailable(filterForm.available))
    dispatch(changeSubject(filterForm.subject))
    dispatch(changeLocation(filterForm.location))
    dispatch(changeReview(filterForm.review))
    handleClose()
  }


  return (
    <>
      <Modal size="md" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="sidebar-header">Refine by:</div>
            <hr />
            <div className="sidebar-category">Availability</div>
            <Form.Check
              type="radio"
              label="Available"
              value={"True"}
              id="modal-only-available"
              checked={filterForm.available === "True"}
              onChange={
                (e) => {
                  setFilterForm({
                    ...filterForm,
                    available: e.target.value
                  })
                }
              }
              inline
            />


            <Form.Check
              type="radio"
              label="Unavailable"
              value={"False"}
              id="modal-only-unavailable"
              checked={filterForm.available === "False"}
              onChange={
                (e) => {
                  setFilterForm({
                    ...filterForm,
                    available: e.target.value
                  })
                }
              }
              inline
            />

            <Form.Check
              type="radio"
              label="Both"
              value={''}
              id="modal-both-available-unavailable"
              checked={filterForm.available === ''}
              onChange={
                (e) => {
                  setFilterForm({
                    ...filterForm,
                    available: e.target.value
                  })
                }
              }
              inline
            />

            <hr />
            <div className="sidebar-category">Subject</div>

            <Form.Check
              type="radio"
              label="Any subject"
              id={'modal-checkbox-any-subject'}
              value={''}
              checked={filterForm.subject === ''}
              onChange={
                (e) => {
                  setFilterForm({
                    ...filterForm,
                    subject: e.target.value
                  })
                }
              }
              inline
            />
            {subjects.map((subject, index) => {
              return (
                <Form.Check
                  key={index}
                  type="radio"
                  label={subject}
                  id={`modal-checkbox-${subject}`}
                  value={subject}
                  checked={subject === filterForm.subject}
                  onChange={
                    (e) => {
                      setFilterForm({
                        ...filterForm,
                        subject: e.target.value
                      })
                    }
                  }
                  inline
                />
              )
            })
            }

            <hr />
            <div className="sidebar-category">Location</div>
            <div className="sidebar-radio">
              <Form.Check
                type="radio"
                label="Any location"
                value={''}
                id='modal-any-location'
                checked={filterForm.location === ''}
                onChange={
                  (e) => {
                    setFilterForm({
                      ...filterForm,
                      location: e.target.value
                    })
                  }
                }
              />
            </div>
            {locations.map((location, index) => {
              return (
                <div className="sidebar-radio" key={index}>
                  <Form.Check
                    key={index}
                    type="radio"
                    label={location}
                    id={`modal-checkbox-${location}`}
                    value={location}
                    checked={filterForm.location === location}
                    onChange={
                      (e) => {
                        setFilterForm({
                          ...filterForm,
                          location: e.target.value
                        })
                      }
                    }
                  />
                </div>
              )
            }
            )}
            <hr />
            <div className="sidebar-category">Avg. Student Review</div>
            {
              rating.map((rate, index) => {
                return (
                  <div
                    onClick={() => {
                      setFilterForm({
                        ...filterForm,
                        review: rate
                      })
                    }
                    }
                    className="sidebar-review"
                    key={index}>
                    <StarDisplay num={rate} size={18} selected={rate === filterForm.review} /> & up
                  </div>
                )
              })
            }
            <div className="sidebar-radio">
              <Form.Check
                type="checkbox"
                label="Select none"
                value={''}
                id="modal-select-none-review"
                checked={filterForm.review === ''}
                onChange={
                  () => {
                    setFilterForm({
                      ...filterForm,
                      review: ''
                    })
                  }
                }
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="home-modal-filter-footer">
            <Button size="xs" variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button className="home-modal-filter-btn" variant="danger" onClick={() => onSubmitModalFilter()}>
              Save Changes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};