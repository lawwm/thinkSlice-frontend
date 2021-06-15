import React, { useState, useRef, useEffect } from "react";
import { Nav, Row, Col, Form, Button } from "react-bootstrap"
import { StarDisplay } from "./StarRating"

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
  const [showMore, setShowMore] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const toggleAvailable = () => {
    console.log(!isAvailable)
    setIsAvailable(prev => !prev)
  }
  return (
    <>
      <div className="background-red">
        <Form>
          <div className="sidebar-header">Refine by:</div>
          <hr />
          <div className="sidebar-category">Availability</div>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Select available"
            checked={isAvailable}
            onChange={() => toggleAvailable()}
          />
          <hr />
          <div className="sidebar-category">Subject</div>
          {!showMore
            ? (
              subjects.map((subject, index) => {
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
          {locations.map((location, index) => {
            return (
              <div className="sidebar-radio" key={index}>
                <Form.Check
                  key={index}
                  type="radio"
                  label={location}
                  id={`checkbox-${location}`}
                  value={location}
                  checked={location === selectedLocation}
                  onChange={
                    (e) => {
                      console.log(e.target.value)
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
              return (<div
                onClick={() => console.log(rate)}
                className="sidebar-review"
                key={index}>
                <StarDisplay num={rate} size={18} /> & up
              </div>)
            })
          }
        </Form>
      </div>
    </>
  );
};