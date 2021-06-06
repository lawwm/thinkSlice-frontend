import React from "react";

import { Form } from "react-bootstrap";

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

export const CheckboxGroup = ({ subjectList }) => {
  return (
    <>
      {subjects.map((subject, index) => {
        return (
          <Form.Check
            key={index}
            type="checkbox"
            label={subject}
            value={subject}
            checked={
              subjectList === null ? false : subjectList.includes(subject)
            }
            inline
            onChange={(e) => {
              const index = subjectList.indexOf(subject);
              var result;
              if (index < 0) {
                result = subjectList.push(subject);
              } else {
                result = subjectList.splice(index, 1);
              }
              return result;
            }}
          />
        );
      })}
    </>
  );
};
