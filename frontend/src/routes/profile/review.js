import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewPost from "../../components/ReviewPost";
import { getReviews } from "../../store/profile/action";

import { Container, Row, Media, Image, Nav, Button } from "react-bootstrap";
import "../styles.css";

const Review = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user_id } = useParams();
  const { profile, reviews, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getReviews(user_id));
  }, [user_id]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Container>
          <Row className="margin-left">
            <Media className="d-flex">
              <Media.Body className="mr-auto p-2 col-example">
                <h2>User reviews for {profile.basic.username}</h2>
              </Media.Body>

              <div className="profile-picture circle align-self-center ml-3">
                <Image
                  src={profile.basic.profile_pic}
                  alt="profile_pic"
                  fluid
                />
              </div>
            </Media>
          </Row>
          <Nav justify variant="tabs" defaultActiveKey="reviewSelf">
            <Button
              className="btn-nav btn"
              onClick={() => history.push("/profile/" + user_id)}
            >
              Back to profile
            </Button>
            <Nav.Item>
              <Nav.Link className="tabs" eventKey="reviewSelf">
                Your reviews
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="tabs" eventKey="reviewOthers">
                Reviews you've posted
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <ReviewPost />
        </Container>
      )}
    </>
  );
};

export default Review;
