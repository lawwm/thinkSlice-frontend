import React from "react";
import { useSelector } from "react-redux";

import { Container, Row, Col } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import "../styles.css";

const About = () => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <>
      {" "}
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          <Container>
            <Row>
              <Col>
                <h3>Welcome to ThinkSlice!</h3>
                <p className="about-page">
                  ThinkSlice is the best platform to find your perfect tutor for
                  any subject. Using the thin-slicing effect, ThinkSlice aims to
                  provide a quick and easy way for aspiring students to find
                  tutors who best fit their style of learning.
                </p>
                <br />
                <h3>The thin-slicing effect</h3>
                <p className="about-page">
                  Thin-slicing is the ability for individuals to make quick but
                  accurate inferences about the state, characteristics or state
                  of an individual with minimal amounts of information. Research
                  has found that judgements based on thin-slicing can be as
                  accurate, or even more accurate than judgements made using
                  increased information.
                </p>
                <p className="about-page">
                  Users of ThinkSlice leverage on this phenomenon by being able
                  to browse through many tutors quickly via one-minute videos,
                  while being able to make effective judgements of which tutors
                  will be the most suitable for them.
                </p>
                <p className="about-page">
                  For tutors, videos are a great way to display your soft skills
                  that cannot be shown on paper, such as your communication
                  skills, charisma and more.
                </p>
                <br />
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Getting started</h3>
                <br />
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className="about-header">Discover</h4>
                <p className="about-page">
                  Explore the vast catalogue of videos uploaded by tutors, with
                  subjects ranging from Math and Physics, to Literature and
                  Visual Arts and more.
                </p>
                <br />
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col>
                <h4 className="about-header">Connect</h4>
                <p className="about-page">
                  If you come across a tutor who you think is a good match, you
                  can easily establish contact with themby checking out their
                  profile and starting a chat.
                </p>
                <br />
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 className="about-header">Learn</h4>
                <p className="about-page space-below">
                  Once you made contact with your tutor, you can start making
                  preparations to start learning from them! Be sure to leave a
                  review on your tutor's profile if you enjoyed your learning
                  experience.
                </p>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default About;
