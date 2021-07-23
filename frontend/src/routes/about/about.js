import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Container, Row, Col, Image } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import watchPageLarge from "../../images/watchPageLarge.png";
import watchPageSmall from "../../images/watchPageSmall.PNG";
import profilePageLarge from "../../images/profilePageLarge.PNG";
import profilePageSmall from "../../images/profilePageSmall.PNG";
import reviewPageLarge from "../../images/reviewPageLarge.png";
import reviewPageSmall from "../../images/reviewPageSmall.png";
import "../styles.css";

const About = () => {
  const { loading } = useSelector((state) => state.auth);
  const [smallView, setSmallView] = useState(window.innerWidth <= 1000);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1000) {
        setSmallView(true);
      } else {
        setSmallView(false);
      }
    });
  }, []);

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
                  accurate inferences about the details, characteristics or
                  state of an individual with minimal amounts of information.
                  Research has found that judgements based on thin-slicing can
                  be as accurate, or even more accurate than judgements made
                  using increased information.
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
                <ul className="about-list">
                  <li className="about-list-item">
                    Search for videos with the search bar.
                  </li>
                  <li className="about-list-item">
                    Filter videos by subject, tutor rating and more.
                  </li>
                  <li className="about-list-item">
                    Like and comment on videos to show your support!
                  </li>
                </ul>
              </Col>
              <Col className="about-align-center">
                {smallView && (
                  <Image
                    className="about-small-image"
                    src={watchPageSmall}
                    alt="watch_page"
                  />
                )}
                {!smallView && (
                  <Image
                    className="about-image"
                    src={watchPageLarge}
                    alt="watch_page"
                  />
                )}
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              {!smallView && (
                <Col className="about-align-center">
                  <Image
                    className="about-image"
                    src={profilePageLarge}
                    alt="profile_page"
                  />
                </Col>
              )}
              <Col>
                <h4 className="about-header">Connect</h4>
                <p className="about-page">
                  If you come across a tutor who you think is a good match, you
                  can easily establish contact with them by checking out their
                  profile and starting a chat.
                </p>
                <ul className="about-list">
                  <li className="about-list-item">
                    View a user's profile details such as their contact info,
                    tuition rates and more.
                  </li>
                  <li className="about-list-item">
                    View other videos by the same tutor.
                  </li>
                  <li className="about-list-item">
                    Start a chat if you're interested in lessons!
                  </li>
                </ul>
              </Col>
              {smallView && (
                <Col className="about-align-center">
                  <Image
                    className="about-small-image"
                    src={profilePageSmall}
                    alt="profile_page"
                  />
                </Col>
              )}
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <h4 className="about-header">Learn</h4>
                <p className="about-page">
                  Once you made contact with your tutor, you can start making
                  preparations to start learning from them! Be sure to leave a
                  review on your tutor's profile if you enjoyed your learning
                  experience.
                </p>
                <ul className="about-list">
                  <li className="about-list-item">
                    Discuss with your tutor how to conduct lessons and make payment.
                  </li>
                  <li className="about-list-item">
                    Post a review for your tutor by visiting their profile page.
                  </li>
                </ul>
              </Col>
              <Col className="about-align-center">
                {smallView && (
                  <Image
                    className="about-small-image"
                    src={reviewPageSmall}
                    alt="review_page"
                  />
                )}
                {!smallView && (
                  <Image
                    className="about-image"
                    src={reviewPageLarge}
                    alt="review_page"
                  />
                )}
              </Col>
            </Row>
            <div className="about-empty-space"></div>
          </Container>
        </>
      )}
    </>
  );
};

export default About;
