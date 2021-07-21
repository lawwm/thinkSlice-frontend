// include the video.js kit javascript and css
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import {
  Row,
  Col,
  Container,
  Media,
  Form,
  Button,
  Spinner,
  InputGroup,
  FormControl
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  loadWatchVideos,
  exitWatchVideos,
  loadHomeVideos,
  getComments,
  addComments,
  changePage,
  addLike,
  removeLike,
  searchVideos,
  clearSearchVideos
} from "../../store/home/action";
import { setAlert } from "../../store/components/action";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { truncate } from "lodash";
import {
  FaAngleUp,
  FaAngleDown,
  FaRegHeart,
  FaHeart,
  FaComment,
  FaSearch
} from "react-icons/fa";
import Thumbnail from "../../components/Thumbnail";
import { StarDisplay } from "../../components/StarRating";
import videojs from "@mux/videojs-kit";
import "@mux/videojs-kit/dist/index.css";
import "../styles.css";
import "../../fonts/css/videojs.css";
import greyload from "../../images/Solid_grey.svg"

//Comment imports
import { CommentPost } from "../../components/Comment.js";
import { setActive, startChat } from "../../store/chat/action.js";

//Spinner component
const HomeSpinner = () => {
  return (
    <>
      <div className="home-spinner-child">
        <LoadingSpinner />
      </div>
    </>
  );
};

//Comments component
export const Comment = ({ totalComments, videoId }) => {
  const [showComment, setShowComment] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const dispatch = useDispatch();

  const { commentLoading, comments } = useSelector((state) => state.home);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [commentForm, setCommentForm] = useState({
    comment: "",
  });

  const commentIfAuth = () => {
    if (isAuthenticated) {
      setShowAddComment(true);
    } else {
      dispatch(
        setAlert("You need to be a registered user to comment", "danger")
      );
    }
  };

  const onCommentChange = (e) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value,
    });
  };

  const onCommentSubmit = (e) => {
    e.preventDefault();
    // console.log(commentForm)
    dispatch(
      addComments(
        commentForm,
        videoId,
        () => setShowAddComment(false),
        () => setCommentForm({ comment: "" })
      )
    );
  };

  return (
    <>
      {commentLoading && (
        <>
          <div className="video-comment-spinner">
            <LoadingSpinner />
            <hr />
          </div>
        </>
      )}
      {!commentLoading && (
        <>
          {showComment ? (
            <>
              <Container>
                <button
                  onClick={() => setShowComment(false)}
                  className="video-description-btn"
                >
                  Hide comments
                  <FaAngleUp />
                </button>
                <div className="video-add-comment">
                  <Media>
                    <img
                      alt="Commenter"
                      className="video-comment-picture"
                      src="https://thinkslice-project.s3-ap-southeast-1.amazonaws.com/user-images/download.jpg"
                    />
                    <Media.Body>
                      {showAddComment ? (
                        <div className="video-submit-comment">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="comment"
                            onChange={(e) => onCommentChange(e)}
                            value={commentForm.comment}
                          />
                          <div className="video-comment-button-div">
                            <Button
                              onClick={() => setShowAddComment(false)}
                              className="btn-comment-alt-custom"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={(e) => onCommentSubmit(e)}
                              className="btn-comment-custom"
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => commentIfAuth()}
                          className="video-add-comment-button"
                        >
                          {" "}
                          Comment on this video?
                        </div>
                      )}
                    </Media.Body>
                  </Media>
                </div>
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <CommentPost
                      commentId={comment.id}
                      commentText={comment.comment_text}
                      date={comment.date_comment}
                      username={comment.username}
                      userId={comment.userId}
                      profilePic={comment.profilePic}
                      hasReplies={comment.has_replies}
                      edited={comment.edited}
                      dateEdited={comment.date_comment_edited}
                      replies={comment.replies}
                    />
                  </div>
                ))}
                <hr />
              </Container>
            </>
          ) : (
            <>
              <Container>
                <button
                  onClick={() => setShowComment(true)}
                  className="video-description-btn"
                >
                  {"Show " + totalComments + " comments"}
                  <FaAngleDown />
                </button>
                <hr />
              </Container>
            </>
          )}
        </>
      )}
    </>
  );
};

//Description component
export const Description = ({ description }) => {
  const [showMore, setShowMore] = useState(false);
  const wordLimit = 120;

  return (
    <>
      {description.length > wordLimit ? (
        <>
          {showMore ? (
            <>
              <div className="video-description-div">{description}</div>
              <div>
                <button
                  onClick={() => setShowMore(false)}
                  className="video-description-btn"
                >
                  Hide content
                  <FaAngleUp />
                </button>
              </div>
              <div>
                <hr />
              </div>
            </>
          ) : (
            <>
              <div className="video-description-div">
                {truncate(description, {
                  length: wordLimit,
                  omission: "...",
                })}
              </div>
              <div>
                <button
                  onClick={() => setShowMore(true)}
                  className="video-description-btn"
                >
                  Show content
                  <FaAngleDown />
                </button>
              </div>
              <div>
                <hr />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="video-description-div">{description}</div>
          <div>
            <hr />
          </div>
        </>
      )}
    </>
  );
};

//Browse more videos sign component
// const BrowseMoreVideos = () => {
//   return (
//     <div className="browse-more-vid">
//       <div className="browse-more-sentence">
//         <div className="browse-more-header">{"RELATED VIDEOS"}</div>
//         <div className="browse-label">BROWSE MORE</div>
//       </div>
//       <div className="browse-more-sentence"></div>
//     </div>
//   );
// };

//Related videos component
const VideoGrid = ({ videos, reachedEnd, homeLoading }) => {
  const loader = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    let options = {
      threshold: 0.9,
    };

    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        if (!reachedEnd) {
          dispatch(changePage());
        }
      }
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [dispatch, reachedEnd, homeLoading]);

  // Redirect to homepage to search videos
  const [searchForm, setSearchForm] = useState("")
  const submitSearch = () => {
    history.push("/")
    dispatch(clearSearchVideos())
    dispatch(searchVideos(searchForm))
  }
  const enterSubmitSearch = (keycode) => {
    if (keycode === 13) {
      history.push("/")
      dispatch(clearSearchVideos())
      dispatch(searchVideos(searchForm))
    }
  }
  return (
    <>
      {
        <div >
          <div className="home-searchbar">

            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search for videos..."
                aria-label="searchbar"
                aria-describedby="searchbar-label"
                value={searchForm}
                onChange={
                  e => setSearchForm(e.target.value)
                }
                onKeyPress={(e) => enterSubmitSearch(e.charCode)}
              />
              <InputGroup.Append>
                <Button
                  onClick={() => submitSearch()}
                  variant="outline-secondary"><FaSearch /></Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <Row className="justify-content-md-left">
            {/* {videos.length === 0 && (
              <Col xs={12} sm={6} md={12} className="watch-video-row">
                <BrowseMoreVideos />
              </Col>
            )} */}
            {videos.map((videoRow) => {
              return (
                <Col
                  key={videoRow.id}
                  xs={12}
                  sm={6}
                  md={6}
                  lg={12}

                  className="watch-video-row"
                >
                  <Thumbnail
                    title={videoRow.video_title}
                    username={videoRow.creator_profile.username}
                    views={videoRow.views}
                    subject={videoRow.subject}
                    date={videoRow.created_at}
                    playback_id={videoRow.playback_id}
                    imageSrc={videoRow.creator_profile.profile_pic}
                    videoId={videoRow.id}
                    profileId={videoRow.creator_profile.user}
                  />
                </Col>
              );
            })}
          </Row>
          {homeLoading && (
            <div className="home-footer">
              <HomeSpinner />
            </div>
          )}

          {!homeLoading && (
            <div ref={loader} className="home-footer">
              {reachedEnd && (
                <div className="home-content-end">
                  <hr className="home-footer-break" />
                  <h5>You've reached the end of the page.</h5>
                  <a href="#top">Back to top.</a>
                </div>
              )}
            </div>
          )}
        </div>
      }
    </>
  );
};

//Video player component
const VideoPlayer = ({ playback_id }) => {
  const playerRef = useRef();
  const videoRef = useRef();
  useEffect(() => {
    if (playerRef.current !== undefined) {
      const player = videojs(playerRef.current, {
        playbackRates: [0.5, 1, 1.5, 2],
        userActions: {
          doubleClick: true,
        },
      });

      videoRef.current = player;

      player.poster(
        "https://image.mux.com/" + playback_id + "/thumbnail.jpg"
      );
      player.src(
        "https://stream.mux.com/" + playback_id + ".m3u8"
      );

      player.aspectRatio("16:9");

      return () => {
        player.dispose();
      };
    }
  }, [playback_id]);

  return (
    <video
      id="my-player"
      className="video-js vjs-theme-forest"
      controls
      preload="auto"
      width="100%"
      ref={playerRef}
      fluid="true"
    ></video>
  )
}

//Likecount component
const LikeCount = ({ currentVideo }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [hasUserLiked, setHasUserLiked] = useState(currentVideo.hasUserLiked);
  const [likes, setLikes] = useState(currentVideo.likes);

  return (
    <>
      {isAuthenticated && (
        <Row>
          {loading ? (
            <Col className="video-student-likes-unauth">
              <Spinner size="sm" animation="border" variant="dark" />
            </Col>
          ) : (
            <>
              {hasUserLiked ? (
                <Col
                  md={3}
                  onClick={() =>
                    dispatch(
                      removeLike(
                        currentVideo.id,
                        (x) => setLoading(x),
                        (y) => setHasUserLiked(y),
                        (z) => setLikes((prev) => prev - 1)
                      )
                    )
                  }
                  className="video-student-likes"
                >
                  <FaHeart color={"#ff4400"} size={18} />{" "}
                  <span className="video-student-likecount">
                    {likes === 1 ? likes + " Like" : likes + " Likes"}
                  </span>
                </Col>
              ) : (
                <Col
                  md={3}
                  onClick={() =>
                    dispatch(
                      addLike(
                        currentVideo.id,
                        (x) => setLoading(x),
                        (y) => setHasUserLiked(y),
                        () => setLikes((prev) => prev + 1)
                      )
                    )
                  }
                  className="video-student-likes"
                >
                  <FaRegHeart size={18} />{" "}
                  <span className="video-student-likecount">
                    {likes + " Likes"}
                  </span>
                </Col>
              )}
            </>
          )}
        </Row>
      )}
      {!isAuthenticated && (
        <Row>
          <Col md={2} className="video-student-likes-unauth">
            <FaRegHeart size={18} />{" "}
            <span className="video-student-likecount">{likes + " Likes"}</span>
          </Col>
        </Row>
      )}
    </>
  );
};

//Unauthenticated guest component
const Guest = ({
  currentVideo,
  videoLoading,
  videos,
  homeLoading,
  reachedEnd,
}) => {
  const history = useHistory();

  return (
    <>
      {videoLoading && <LoadingSpinner />}
      {!videoLoading && (
        <>
          <Container>
            <Row>
              <Col sm={12} md={12} lg={8} xl={9}>
                <VideoPlayer
                  playback_id={currentVideo.playback_id}
                />
                <div className="video-header">
                  <Row>
                    <Col xs={12} className="video-title">{currentVideo.video_title}</Col>
                  </Row>
                  <LikeCount currentVideo={currentVideo} />
                  <Row>
                    <Col md={6}>
                      {(currentVideo.views >= 1000
                        ? currentVideo.views >= 1000000
                          ? Math.round(currentVideo.views / 1000000) + "M"
                          : Math.round(currentVideo.views / 1000) + "K"
                        : currentVideo.views) + " views | " + currentVideo.subject}
                    </Col>
                    <Col md={6} className="video-date">
                      {"Upload date: " + currentVideo.created_at}
                    </Col>
                  </Row>
                </div>
                <hr />
                <div>
                  <Media>
                    <img
                      alt="Creator"
                      className="video-profile-picture"
                      onClick={() => history.push('/profile/' + currentVideo.creator_profile.user)}
                      src={currentVideo.creator_profile.profile_pic}
                    />
                    <Media.Body >
                      <div className="video-name-reviews">
                        <Row>
                          <Col>{currentVideo.creator_profile.username}</Col>
                        </Row>
                        <Row>
                          {currentVideo.creator_profile.aggregate_star !== null && (
                            <Col>
                              <StarDisplay
                                num={parseInt(currentVideo.creator_profile.aggregate_star)}
                                size={18}
                              />
                            </Col>
                          )}
                          <Col className="video-student-reviews">{currentVideo.creator_profile.total_tutor_reviews + " student reviews"}</Col>
                        </Row>
                      </div>
                    </Media.Body>
                  </Media>
                  <Row>
                    <Col>
                      <Description description={currentVideo.video_description} />
                    </Col>
                  </Row>
                  <Row>
                    <Comment
                      totalComments={currentVideo.num_of_comments}
                      videoId={currentVideo.id}
                    />
                  </Row>
                </div>
              </Col>
              <Col sm={12} md={12} lg={4} xl={3}>
                <VideoGrid
                  videos={videos}
                  reachedEnd={reachedEnd}
                  homeLoading={homeLoading}
                  videoLoading={videoLoading}
                />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

//Authenticated member component
const Member = ({
  currentVideo,
  videoLoading,
  videos,
  homeLoading,
  reachedEnd,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { activeChat, chatComponentLoading, chats } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (activeChat) {
      history.push("/chat");
    }
  });

  return (
    <>
      {videoLoading && <LoadingSpinner />}
      {!videoLoading && (
        <>
          <Container>
            <Row>
              <Col sm={12} md={12} lg={8} xl={9}>
                <VideoPlayer
                  playback_id={currentVideo.playback_id}
                />
                <div className="video-header">
                  <Row>
                    <Col xs={12} className="video-title">
                      {currentVideo.video_title}
                    </Col>
                  </Row>
                  <LikeCount currentVideo={currentVideo} />
                  <Row>
                    <Col sm={6}>
                      {(currentVideo.views >= 1000
                        ? currentVideo.views >= 1000000
                          ? Math.round(currentVideo.views / 1000000) + "M"
                          : Math.round(currentVideo.views / 1000) + "K"
                        : currentVideo.views) + " views | " + currentVideo.subject}
                    </Col>
                    <Col sm={6} className="video-date">
                      {"Upload date: " + currentVideo.created_at}
                    </Col>
                  </Row>
                </div>
                <hr />
                <div>
                  <Media>
                    <img
                      alt="Creator"
                      className="video-profile-picture"
                      onClick={() =>
                        history.push(
                          "/profile/" + currentVideo.creator_profile.user
                        )
                      }
                      src={currentVideo.creator_profile.profile_pic}
                    />
                    <Media.Body>
                      <div className="video-name-reviews">
                        <Row>
                          <Col>{currentVideo.creator_profile.username}</Col>
                        </Row>
                        <Row>
                          {currentVideo.creator_profile.aggregate_star !== null && (
                            <Col>
                              <StarDisplay
                                num={parseInt(
                                  currentVideo.creator_profile.aggregate_star
                                )}
                                size={18}
                              />
                            </Col>
                          )}
                          <Col className="video-student-reviews">
                            {!(currentVideo.creator_profile.user === parseInt(user)) && (
                              <Button
                                variant="secondary"
                                className="video-student-chat"
                                disabled={chatComponentLoading}
                                onClick={() => {
                                  const alreadyExists = chats.find(
                                    (chat) =>
                                      chat.recipient ===
                                      currentVideo.creator_profile.user
                                  );
                                  if (alreadyExists) {
                                    dispatch(setActive(alreadyExists.chatroom));
                                  } else {
                                    dispatch(
                                      startChat(currentVideo.creator_profile.user)
                                    );
                                  }
                                }}
                              >
                                {chatComponentLoading ? (
                                  <Spinner className="video-student-chat-spinner" size="sm" animation="border" variant="light" />
                                ) : (
                                  <>
                                    Chat&nbsp;
                                    <FaComment />
                                  </>
                                )}
                              </Button>
                            )}
                            {currentVideo.creator_profile.total_tutor_reviews +
                              " student reviews"}
                          </Col>
                        </Row>
                      </div>
                    </Media.Body>
                  </Media>
                  <Row>
                    <Col>
                      <Description description={currentVideo.video_description} />
                    </Col>
                  </Row>
                  <Row>
                    <Comment
                      totalComments={currentVideo.num_of_comments}
                      videoId={currentVideo.id}
                    />
                  </Row>
                </div>
              </Col>
              <Col sm={12} md={12} lg={4} xl={3}>
                <VideoGrid
                  videos={videos}
                  reachedEnd={reachedEnd}
                  homeLoading={homeLoading}
                  videoLoading={videoLoading}
                />
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

const WatchPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    currentVideo,
    homeLoading,
    videoLoading,
    videos,
    filterBy,
    ascending,
    page,
    reachedEnd,
    availability,
    subject,
    location,
    review,
    searchQuery,
    firstLoad
  } = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(loadWatchVideos(videoId));

    return () => {
      dispatch(exitWatchVideos());
    }
  }, [dispatch, videoId]);

  // Prevent home videos loading on rerender  
  const isFirstLoad = useRef(firstLoad);
  const isFirstRender = useRef(true)
  useEffect(() => {
    // is first time loading and component render, load the page
    if (firstLoad && isFirstRender.current) {
      isFirstRender.current = false
      dispatch(loadHomeVideos(filterBy, ascending, page, reachedEnd, availability, subject, location, review, searchQuery))

    } else if (!firstLoad && !isFirstRender.current) { // is not first load nor render
      if (isFirstLoad.current !== firstLoad) {//prevent loading when firstLoad dependency changes
        isFirstLoad.current = firstLoad
      } else {
        dispatch(loadHomeVideos(filterBy, ascending, page, reachedEnd, availability, subject, location, review, searchQuery))
      }
    } else { // is first render but not first load, do nothing
      isFirstRender.current = false
    }

  }, [dispatch, page, ascending, filterBy, reachedEnd, availability, subject, location, review, searchQuery, firstLoad])


  useEffect(() => {
    dispatch(getComments(videoId));
  }, [dispatch, videoId]);

  return (
    <>
      <link rel="preload" as="image" href={greyload} />
      {loading && <LoadingSpinner />}
      {!loading &&
        (isAuthenticated ? (
          <>
            <Member
              currentVideo={currentVideo}
              videoLoading={videoLoading}
              homeLoading={homeLoading}
              reachedEnd={reachedEnd}
              videos={videos}
            />
          </>
        ) : (
          <>
            <Guest
              currentVideo={currentVideo}
              videoLoading={videoLoading}
              homeLoading={homeLoading}
              reachedEnd={reachedEnd}
              videos={videos}
            />
          </>
        ))
      }
    </>
  );
};

export default WatchPage;
