import React from "react";

import { Form } from "react-bootstrap";
import { subjects } from "../routes/home/upload";

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
