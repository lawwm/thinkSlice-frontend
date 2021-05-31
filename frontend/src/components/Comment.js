import React from "react";
import { useHistory } from "react-router-dom";
import { BsFillCaretDownFill } from "react-icons/bs";
import { Image, Media, Card } from "react-bootstrap";
import img from "../images/Barack_Obama.jpg";
import "./components.css";

const Comment = () => {
  const history = useHistory();

  return (
    <>
      <div>
        <Media className="commenter" fluid>
          <div
            className="thumbnail-photo mr-3"
            onClick={() => history.push("/profile")}
          >
            <Image src={img} alt="profile picture" fluid />
          </div>
          <Media.Body className="align-self-center">
            <div className="comment-title">
              <div className="comment-name">Barack Obama</div>
              <div className="comment-date">15 May 2006</div>
            </div>
            <Card.Text className="comment-text">
              Truly an amazing teacher on the art of preparing chicken. He is the
              Bob Ross of roast chicken, the Einstein of seasoning, the Michangelo
              of plating and the Aristotle of teaching. You would surely regret not
              attending his cooking lessons!! His roast chicken was so good, the
              troops came back from Iraq.
            </Card.Text>
            <div className="comment-title">
              <button className="replies-button">
                <BsFillCaretDownFill /> View more replies
              </button>
              <button className="comment-button">
                Reply
              </button>
              <button className="comment-button">
                Delete
              </button>
            </div>
          </Media.Body>
        </Media>
      </div>
    </>
  );
};

export default Comment;