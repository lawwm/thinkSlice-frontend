import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nav, Row, Col, Form, Button } from "react-bootstrap"
import { StarDisplay } from "./StarRating"
import { changeAvailable, changeLocation, changeSubject, changeReview } from "../store/home/action"
import "./components.css"

const moreSubjects = [
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

const subjects = [
  "Arts",
  "Biology",
  "Business",
  "Chemistry",
  "Computing",
  "Cooking",
]

const locations = [
  'Central',
  'North',
  'South',
  'East',
  'West'
]

const rating = [5, 4, 3, 2, 1]

export const Sidebar = ({ selectedSubject, selectedLocation, selectedAvailability, selectedReview }) => {
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <div className="background-sidebar">
        <Form>
          <div className="sidebar-header">Refine by:</div>
          <hr />
          <div className="sidebar-category">Availability</div>
          <div className="sidebar-radio">
            <Form.Check
              type="radio"
              label="Available"
              value={"True"}
              id="only-available"
              checked={selectedAvailability === "True"}
              onChange={
                (e) => {
                  dispatch(changeAvailable(e.target.value))
                }
              }
            />
          </div>
          <div className="sidebar-radio">
            <Form.Check
              type="radio"
              label="Unavailable"
              value={"False"}
              id="only-unavailable"
              checked={selectedAvailability === "False"}
              onChange={
                (e) => {
                  dispatch(changeAvailable(e.target.value))
                }
              }
            />
          </div>
          <div className="sidebar-radio">
            <Form.Check
              type="radio"
              label="Both"
              value={''}
              id="both-available-unavailable"
              checked={selectedAvailability === ''}
              onChange={
                (e) => {
                  dispatch(changeAvailable(e.target.value))
                }
              }
            />
          </div>
          <hr />
          <div className="sidebar-category">Subject</div>
          <div className="sidebar-radio">
            <Form.Check
              type="radio"
              label="Any subject"
              id={'checkbox-any-subject'}
              value={''}
              checked={selectedSubject === ''}
              onChange={
                (e) => {
                  dispatch(changeSubject(e.target.value))
                }
              }
            />
          </div>
          {!showMore
            ? (
              subjects.map((subject, index) => {
                return (
                  <div className="sidebar-radio" key={index}>
                    <Form.Check
                      type="radio"
                      label={subject}
                      id={`checkbox-${subject}`}
                      value={subject}
                      checked={subject === selectedSubject}
                      onChange={
                        (e) => {
                          console.log(e.target.value)
                          dispatch(changeSubject(e.target.value))
                        }
                      }
                    />
                  </div>

                )
              })
            )

            : (
              moreSubjects.map((subject, index) => {
                return (
                  <div className="sidebar-radio" key={index}>
                    <Form.Check
                      key={index}
                      type="radio"
                      label={subject}
                      id={`checkbox-${subject}`}
                      value={subject}
                      checked={subject === selectedSubject}
                      onChange={
                        (e) => {
                          console.log(e.target.value)
                          dispatch(changeSubject(e.target.value))
                        }
                      }
                    />
                  </div>
                )
              }
              )
            )}
          {!showMore
            ? <Button
              className="sidebar-showmore"
              onClick={() => setShowMore(true)}>Show more</Button>
            : <Button
              className="sidebar-showmore"
              onClick={() => setShowMore(false)}>Hide</Button>
          }
          <hr />
          <div className="sidebar-category">Location</div>
          <div className="sidebar-radio">
            <Form.Check
              type="radio"
              label="Any location"
              value={''}
              id='any-location'
              checked={selectedLocation === ''}
              onChange={
                (e) => {
                  console.log(e.target.value)
                  dispatch(changeLocation(e.target.value))
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
                  id={`checkbox-${location}`}
                  value={location}
                  checked={selectedLocation === location}
                  onChange={
                    (e) => {
                      console.log(e.target.value)
                      dispatch(changeLocation(e.target.value))
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
                    console.log(rate)
                    dispatch(changeReview(rate))
                  }
                  }
                  className="sidebar-review"
                  key={index}>
                  <StarDisplay num={rate} size={18} selected={rate === selectedReview} /> & up
                </div>
              )
            })
          }
          <div className="sidebar-radio">
            <Form.Check
              type="checkbox"
              label="Select none"
              value={''}
              id="select-none-review"
              checked={selectedReview === ''}
              onChange={
                (e) => {
                  console.log(e.target.value)
                  dispatch(changeReview(e.target.value))
                }
              }
            />
          </div>
        </Form>
      </div>
    </>
  );
};