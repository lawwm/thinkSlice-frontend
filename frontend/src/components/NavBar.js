import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Nav, Navbar } from "react-bootstrap";
import "./components.css";

const NavBar = () => {
  return (
    <Container>
      <Col></Col>
      <Navbar className="navbar">
        <Navbar.Brand className="mr-auto brand-custom">ThinkSlice</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link>Home</Nav.Link>
          <Nav.Link>Categories</Nav.Link>
          <Nav.Link>Login</Nav.Link>
          <Nav.Link>Register</Nav.Link>
        </Nav>
      </Navbar>
      <Col></Col>
    </Container>
  );
};

export default NavBar;
