import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/action";

import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Nav, Navbar } from "react-bootstrap";
import "./components.css";

const NavBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <Navbar className="navbar fixed-top">
    <Container>
      <Navbar.Brand className="mr-auto">ThinkSlice</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link onClick={() => history.push("/")}>Home</Nav.Link>
        <Nav.Link>Categories</Nav.Link>
        <Nav.Link onClick={() => {
                  dispatch(logout());
                  history.push("/login");
                }}>Logout </Nav.Link>
      </Nav>
    </Container>
  </Navbar>
    ) : (
    <Navbar className="navbar fixed-top">
      <Container>
        <Navbar.Brand className="mr-auto">ThinkSlice</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link onClick={() => history.push("/")}>Home</Nav.Link>
          <Nav.Link>Categories</Nav.Link>
          <Nav.Link onClick={() => history.push("/login")}>Login </Nav.Link>
          <Nav.Link onClick={() => history.push("/register")}>
            Register
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
