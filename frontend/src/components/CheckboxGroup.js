import React from "react";

import { Form } from "react-bootstrap";

export const subjects = [
  "Arts",
  "Biology",
  "Business",
  "Chemistry",
  "Computing",
  "Cooking",
  "Crafting",
  "Economics",
  "Engineering",
  "Environment",
  "Geography",
  "Health",
  "History",
  "Language",
  "Law",
  "Literature",
  "Math",
  "Medicine",
  "Music",
  "Other Humanities",
  "Physics",
  "Sports",
  "Visual Arts",
];

export const CheckboxGroup = ({ checkedSubjects, subjectList }) => {
  const listToMap = subjectList || subjects;
  return (
    <>
      {listToMap.map((subject, index) => {
        return (
          <Form.Check
            key={index}
            type="checkbox"
            label={subject}
            id={`checkbox-${subject}`}
            value={subject}
            checked={checkedSubjects.includes(subject)}
            inline
            onChange={(e) => {
              const index = checkedSubjects.indexOf(subject);
              var result;
              if (index < 0) {
                result = checkedSubjects.push(subject);
              } else {
                result = checkedSubjects.splice(index, 1);
                console.log(checkedSubjects);
              }
              return result;
            }}
          />
        );
      })}
    </>
  );
};
