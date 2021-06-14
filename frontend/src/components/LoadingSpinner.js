import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <div role="img" aria-label="spinner" className="d-flex justify-content-center align-items-center" >
      <Spinner animation="border" variant="dark" />
    </div>
  );
};

export default LoadingSpinner;
