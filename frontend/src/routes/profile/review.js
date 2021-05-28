import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewPost from "../../components/ReviewPost";
// import { getReviews } from "../../store/profile/action";

import { Container, Col, Row, Image, Nav, Button } from "react-bootstrap";
import "../styles.css";

const Review = () => {
  // const dispatch = useDispatch();
  const history = useHistory();
  const { user_id } = useParams();
  // const { user } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.profile);

  // useEffect(() => {
  //   dispatch(getReviews(user_id));
  // }, [user_id]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <Container>
          <Row className="margin-left ">
            <Col className="align-self-center" xs={8}>
              <h2>
                {profile.basic.is_tutor
                  ? "User reviews for " + profile.basic.username
                  : "User reviews by " + profile.basic.username}
              </h2>
            </Col>
            <Col>
              <div className="profile-picture circle align-self-center ml-3">
                <Image
                  src={profile.basic.profile_pic}
                  alt="profile_pic"
                  fluid
                />
              </div>
            </Col>
          </Row>
          <br />
          <Nav justify variant="tabs" defaultActiveKey="reviewSelf">
            <Button
              className="btn-nav btn"
              onClick={() => history.push("/profile/" + user_id)}
            >
              Back to profile
            </Button>
            {/* <Nav.Item>
              <Nav.Link className="tabs" eventKey="reviewSelf">
                Your reviews
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="tabs" eventKey="reviewOthers">
                Reviews you've posted
              </Nav.Link>
            </Nav.Item> */}
          </Nav>
          <br />
          <ReviewPost />
          <ReviewPost />
          <ReviewPost />
        </Container>
      )}
    </>
  );
};

export default Review;
