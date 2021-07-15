import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsFillCaretDownFill, BsFillCaretUpFill, BsTrash } from "react-icons/bs";
import { Media, Card, Form, Button } from "react-bootstrap";
import "./components.css";
import LoadingSpinner from "../components/LoadingSpinner"
import { editComments, deleteComments, getReplies, postReply, editReply, deleteReply } from "../store/home/action"

export const CommentPost = ({ commentId, commentText, date, username, userId, profilePic, hasReplies, edited, dateEdited, replies }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const viewerId = localStorage.getItem("user");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { commentLoadingId, commentReplyLoadingId } = useSelector((state) => state.home);

  //Create reply
  const [showReply, setShowReply] = useState(false)
  const [createReply, setCreateReply] = useState(false)
  const [replyForm, setReplyForm] = useState({
    "reply": `@${username}`
  })
  const retrievedRepliesAPI = useRef(false)
  const openReplyAccordion = () => {
    setShowReply(true)
    if (retrievedRepliesAPI.current === false) {
      dispatch(getReplies(commentId))
      retrievedRepliesAPI.current = true
    }
  }

  const onChange = (e) => {
    setReplyForm({
      ...replyForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(postReply(replyForm, commentId, () => setCreateReply(false)))
  };

  //Edit comment
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState(commentText)
  const onChangeEdit = (e) => {
    setEditForm(e.target.value)
  };

  const onSubmitEdit = (e) => {
    e.preventDefault();
    dispatch(editComments(editForm, commentId, () => setShowEdit(false)))
  };

  //Delete comment
  const [showDelete, setShowDelete] = useState(false)
  const trashComment = () => {
    dispatch(deleteComments(commentId))
  }

  return (
    <>
      {(commentLoadingId.includes(commentId)) && <div className="comment-post-loading-div"><LoadingSpinner /></div>}
      {(!commentLoadingId.includes(commentId)) && <div className="comment-div">
        <Media className="commenter" fluid="true">
          <div
            className="comment-thumbnail-photo mr-3"
            onClick={() => history.push("/profile/" + userId)}
          >
            <img
              src={"https://thinkslice-project.s3.amazonaws.com/" + profilePic}
              alt="comment profile"
              className="comment-pic"
              fluid="true" />
          </div>
          <Media.Body className="align-self-center">
            <div className="comment-title">
              <div className="comment-name">{username}</div>
              <div className="comment-date">{edited ? dateEdited + " (edited)" : date}</div>
              <div className="comment-delete-div">
                {showDelete &&
                  (<>
                    <button
                      aria-label="delete comment submit"
                      onClick={() => trashComment()}
                      className="delete-comment-button">
                      <BsTrash size={23} />
                    </button>
                  </>)}
              </div>
            </div>
            {showEdit
              ? <div className="video-submit-comment">
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="edit"
                  onChange={(e) => onChangeEdit(e)}
                  value={editForm}
                />
                <div className="video-comment-button-div">
                  <Button
                    aria-label="edit comment cancel"
                    onClick={() => setShowEdit(false)}
                    className="btn-comment-alt-custom">Cancel</Button>
                  <Button
                    aria-label="edit comment submit"
                    onClick={(e) => onSubmitEdit(e)}
                    className="btn-comment-custom">
                    Submit</Button>
                </div>
              </div>
              :
              <><Card.Text className="comment-text">
                {commentText}
              </Card.Text>
                <div className="comment-title">
                  {hasReplies && (<>{
                    showReply
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
                            onClick={() => openReplyAccordion()}
                            className="replies-button">
                            <BsFillCaretDownFill /> View more replies
                          </button>

                        </>
                      )
                  }</>)}
                  {isAuthenticated && (<>
                    <button
                      aria-label="reply comment show"
                      onClick={() => setCreateReply(prev => !prev)}
                      className="comment-button">
                      Reply
                    </button>
                    {(viewerId === userId.toString()) && (<>
                      <button
                        aria-label="edit comment show"
                        onClick={() => setShowEdit(true)}
                        className="comment-button">
                        Edit
                      </button>
                      <button
                        aria-label="delete comment show"
                        onClick={() => setShowDelete(prev => !prev)}
                        className="comment-button">
                        Delete
                      </button></>)}
                  </>)}
                </div>
              </>}
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
                        aria-label="reply comment cancel"
                        onClick={() => setCreateReply(false)}
                        className="btn-comment-alt-custom">Cancel</Button>
                      <Button
                        aria-label="reply comment submit"
                        onClick={(e) => onSubmit(e)}
                        className="btn-comment-custom">
                        Submit</Button>
                    </div>
                  </div>
                </Media.Body>
              </Media>
            </div>)}
            {showReply && (<>
              {(commentReplyLoadingId.includes(commentId)) && <div className="comment-post-loading-div"><LoadingSpinner /></div>}
              {(!commentReplyLoadingId.includes(commentId)) &&
                <MapReplies replies={replies} commentId={commentId} />
              }
            </>)}
          </Media.Body>
        </Media>

      </div>
      }</>
  );
};

export const MapReplies = ({ replies, commentId }) => {
  return (
    <>
      {replies.map(reply => (
        <div key={reply.id}>
          <ReplyPost
            commentId={commentId}
            replyId={reply.id}
            commentText={reply.comment_text}
            date={reply.date_comment}
            username={reply.username}
            userId={reply.userId}
            profilePic={reply.profilePic}
            edited={reply.edited}
            dateEdited={reply.date_comment_edited}
          />
        </div>
      ))}
    </>
  )
}

export const ReplyPost = ({ commentId, replyId, commentText, date, username, userId, profilePic, edited, dateEdited }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [createReply, setCreateReply] = useState(false)
  const [replyForm, setReplyForm] = useState({
    "reply": `@${username}`
  })

  const viewerId = localStorage.getItem("user");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { replyLoadingId } = useSelector((state) => state.home)

  const onChange = (e) => {
    setReplyForm({
      ...replyForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(postReply(replyForm, commentId, () => setCreateReply(false)))
  };

  //Edit comment
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState(commentText)
  const onChangeEdit = (e) => {
    setEditForm(e.target.value)
  };

  const onSubmitEdit = (e) => {
    e.preventDefault();
    dispatch(editReply(editForm, replyId, commentId, () => setShowEdit(false)))
  };

  //Delete comment
  const [showDelete, setShowDelete] = useState(false)
  const trashComment = () => {
    dispatch(deleteReply(replyId, commentId, () => setShowDelete(false)))
  }

  return (
    <>
      {(replyLoadingId.includes(replyId)) && <div className="comment-post-loading-div"><LoadingSpinner /></div>}
      {(!replyLoadingId.includes(replyId)) && <><div className="comment-div"></div>
        <div>
          <Media className="commenter" fluid="true">
            <div
              className="thumbnail-photo mr-3"
              onClick={() => history.push("/profile/" + userId)}
            >
              <img
                src={"https://thinkslice-project.s3.amazonaws.com/" + profilePic}
                alt="reply profile"
                className="comment-pic"
                fluid="true" />
            </div>
            <Media.Body className="align-self-center">
              <div className="comment-title">
                <div className="comment-name">{username}</div>
                <div className="comment-date">{edited ? dateEdited + " (edited)" : date}</div>
                <div className="comment-delete-div">
                  {showDelete &&
                    (<>
                      <button
                        aria-label="delete reply submit"
                        onClick={() => trashComment()}
                        className="delete-comment-button">
                        <BsTrash size={23} />
                      </button>
                    </>)}
                </div>
              </div>
              {showEdit
                ? <div className="video-submit-comment">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="edit"
                    onChange={(e) => onChangeEdit(e)}
                    value={editForm}
                  />
                  <div className="video-comment-button-div">
                    <Button
                      aria-label="edit reply cancel"
                      onClick={() => setShowEdit(false)}
                      className="btn-comment-alt-custom">Cancel</Button>
                    <Button
                      aria-label="edit reply submit"
                      onClick={(e) => onSubmitEdit(e)}
                      className="btn-comment-custom">
                      Submit</Button>
                  </div>
                </div>
                : <>
                  <Card.Text className="comment-text">
                    {commentText}
                  </Card.Text>
                  <div className="comment-title">
                    {isAuthenticated && (<>
                      <button
                        aria-label="reply reply show"
                        onClick={() => setCreateReply(prev => !prev)}
                        className="comment-button">
                        Reply
                      </button>
                      {(viewerId === userId.toString()) && (
                        <><button
                          aria-label="edit reply show"
                          onClick={() => setShowEdit(true)}
                          className="comment-button">
                          Edit
                        </button>
                          <button
                            aria-label="delete reply show"
                            onClick={() => setShowDelete(prev => !prev)}
                            className="comment-button">
                            Delete
                          </button></>)}
                    </>)}
                  </div>
                </>}
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
                          aria-label="reply reply cancel"
                          onClick={() => setCreateReply(false)}
                          className="btn-comment-alt-custom">Cancel</Button>
                        <Button
                          aria-label="reply reply submit"
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
      </>}
    </>
  );
};
