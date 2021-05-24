import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/action";
import { getProfile, resetProfile } from "../store/profile/action";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./components.css";

const NavBar = () => {
  const dispatch = useDispatch();

  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);


  return (
    <> {loading && (<></>)}
    {!loading && 
      (isAuthenticated ? (
        <>
          <Navbar className="navbar fixed-top">
            <Container>
              <Navbar.Brand className="mr-auto">ThinkSlice</Navbar.Brand>
              <Nav className="ml-auto">
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/"
                  exact={true}
                >
                  Home
                </NavLink>
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/categories"
                >
                  Categories
                </NavLink>
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/profile"
                  onClick={() => { if (profile == null) {
                    dispatch(getProfile(user));}
                  }}
                >
                  Profile
                </NavLink>
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/login"
                  onClick={() => {
                    dispatch(resetProfile());
                    dispatch(logout());
                  }}
                >
                  Logout{" "}
                </NavLink>
              </Nav>
            </Container>
          </Navbar>
          </>
        ) : (
          <>
          <Navbar className="navbar fixed-top">
            <Container>
              <Navbar.Brand className="mr-auto">ThinkSlice</Navbar.Brand>
              <Nav className="ml-auto">
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/"
                  exact={true}
                >
                  Home
                </NavLink>
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/categories"
                >
                  Categories
                </NavLink>
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/login"
                >
                  Login
                </NavLink>
                <NavLink
                  className="nav-default"
                  activeClassName="nav-active"
                  to="/register"
                >
                  Register
                </NavLink>
              </Nav>
            </Container>
          </Navbar>
          </>
        ))}
    </>
  );
};

export default NavBar;
