import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { Image, Media, Card, Form, Button } from "react-bootstrap";
import img from "../images/Barack_Obama.jpg";
import "./components.css";

export const CommentPost = () => {
  const history = useHistory();

  const [showReply, setShowReply] = useState(false)
  const [createReply, setCreateReply] = useState(false)
  const [replyForm, setReplyForm] = useState({
    "reply": ""
  })

  const onChange = (e) => {
    setReplyForm({
      ...replyForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(replyForm)
  };

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
              {showReply
                ? (
                  <button
                    onClick={() => setShowReply(false)}
                    className="replies-button">
                    <BsFillCaretUpFill /> Hide replies
                  </button>
                )
                : (
                  <>
                    <button
                      onClick={() => setShowReply(true)}
                      className="replies-button">
                      <BsFillCaretDownFill /> View more replies
                  </button>

                  </>
                )
              }
              <button onClick={() => setCreateReply(prev => !prev)} className="comment-button">
                Reply
              </button>
              <button className="comment-button">
                Edit
              </button>
              <button className="comment-button">
                Delete
              </button>
            </div>
            {createReply && (<div className="replies-create-div">
              <Media>
                <img
                  alt="Commenter"
                  className="video-comment-picture"
                  src="https://thinkslice-project.s3-ap-southeast-1.amazonaws.com/user-images/download.jpg" />
                <Media.Body>
                  <div className="video-submit-comment">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="reply"
                      onChange={(e) => onChange(e)}
                      value={replyForm.reply}
                    />
                    <div className="video-comment-button-div">
                      <Button
                        onClick={() => setCreateReply(false)}
                        className="btn-comment-alt-custom">Cancel</Button>
                      <Button
                        onClick={(e) => onSubmit(e)}
                        className="btn-comment-custom">
                        Submit</Button>
                    </div>
                  </div>
                </Media.Body>
              </Media>
            </div>)}
            {showReply && (<>
              <ReplyPost />
              <ReplyPost />
              <ReplyPost />
            </>)}
          </Media.Body>
        </Media>

      </div>
    </>
  );
};

export const ReplyPost = () => {
  const history = useHistory();
  const [createReply, setCreateReply] = useState(false)
  const [replyForm, setReplyForm] = useState({
    "reply": "@Hillary Clinton"
  })

  const onChange = (e) => {
    setReplyForm({
      ...replyForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(replyForm)
  };

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
              <div className="comment-name">Hillary Clinton</div>
              <div className="comment-date">16 May 2006</div>
            </div>
            <Card.Text className="comment-text">
              Are you sure? He made me overcook his chicken the last time. Moreover, he was stuttering
              so much I could barely understand him.
            </Card.Text>
            <div className="comment-title">
              <button
                onClick={() => setCreateReply(prev => !prev)}
                className="comment-button">
                Reply
              </button>
              <button className="comment-button">
                Edit
              </button>
              <button className="comment-button">
                Delete
              </button>
            </div>
            {createReply && (<div className="replies-create-div">
              <Media>
                <img
                  alt="Replyer"
                  className="video-comment-picture"
                  src="https://thinkslice-project.s3-ap-southeast-1.amazonaws.com/user-images/download.jpg" />
                <Media.Body>
                  <div className="video-submit-comment">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="reply"
                      onChange={(e) => onChange(e)}
                      value={replyForm.reply}
                    />
                    <div className="video-comment-button-div">
                      <Button
                        onClick={() => setCreateReply(false)}
                        className="btn-comment-alt-custom">Cancel</Button>
                      <Button
                        onClick={(e) => onSubmit(e)}
                        className="btn-comment-custom">
                        Submit</Button>
                    </div>
                  </div>
                </Media.Body>
              </Media>
            </div>)}
          </Media.Body>
        </Media>
      </div>
    </>
  );
};
