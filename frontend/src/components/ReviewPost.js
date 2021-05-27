import React from "react";
import { useHistory } from "react-router-dom";

import img from "../images/Barack_Obama.jpg";
import { Image, Media, Card } from "react-bootstrap";
import StarRating from "../components/StarRating";
import "./components.css";

const ReviewPost = () => {
  const history = useHistory();

  return (
    <Card>
      <Media className="reviewer">
        <div
          className="thumbnail-photo mr-3"
          onClick={() => history.push("/profile")}
        >
          <Image src={img} alt="profile picture" fluid />
        </div>
        <Media.Body className="align-self-center">
          <h5>Barack Obama</h5>
        </Media.Body>
      </Media>
      <Card.Body>
        <Card.Title className="review-title"><StarRating rating={10}/> Amazing Roast Chicken!</Card.Title>
        <Card.Text className="review-text">
          Truly an amazing teacher on the art of preparing chicken. He is the
          Bob Ross of roast chicken, the Einstein of seasoning, the Michangelo
          of plating and the Aristotle of teaching. You would surely regret not
          attending his cooking lessons!! His roast chicken was so good, the
          troops came back from Iraq.
        </Card.Text>
        <footer className="review-date">Written on 5/17/2009</footer>
      </Card.Body>
    </Card>
  );
};

export default ReviewPost;
