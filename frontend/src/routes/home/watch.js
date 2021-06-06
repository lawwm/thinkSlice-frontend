// include the video.js kit javascript and css
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from "react-router-dom";

import { Row, Col, Container, Media, Form, Button } from 'react-bootstrap';
// import NavBar from "../../components/NavBar.js";
import { useParams } from 'react-router-dom';
import { loadWatchVideos, loadHomeVideos } from "../../store/home/action"
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { AuthNavBar } from "../../components/AuthNavBar"
import { truncate } from "lodash"
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import Thumbnail from "../../components/Thumbnail"

import videojs from '@mux/videojs-kit';
import '@mux/videojs-kit/dist/index.css';
import "../styles.css";

import "../../fonts/css/videojs.css"
import { CommentPost } from "../../components/Comment.js"

const Comment = () => {
  const [showComment, setShowComment] = useState(false)
  const [showAddComment, setShowAddComment] = useState(false)

  const [commentForm, setCommentForm] = useState({
    comment: ""
  })

  const onCommentChange = (e) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value
    })
  }

  const onCommentSubmit = (e) => {
    e.preventDefault();
    console.log(commentForm)
  }

  return (
    <>
      {
        showComment
          ? (<>
            <Container>
              <button
                onClick={() => setShowComment(false)}
                className="video-description-btn">
                Hide comments<FaAngleUp />
              </button>
              <div className="video-add-comment">
                <Media >
                  <img
                    alt="Commenter"
                    className="video-comment-picture"
                    src="https://thinkslice-project.s3-ap-southeast-1.amazonaws.com/user-images/download.jpg" />
                  <Media.Body >
                    {showAddComment
                      ? (<div className="video-submit-comment">
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
                            className="btn-comment-alt-custom">Cancel</Button>
                          <Button onClick={(e) => onCommentSubmit(e)} className="btn-comment-custom">Submit</Button>
                        </div>

                      </div>)
                      : (<div
                        onClick={() => setShowAddComment(true)}
                        className="video-add-comment-button"> Comment on this video?</div>
                      )}
                  </Media.Body>
                </Media>

              </div>
              <CommentPost />
              <hr />
            </Container>
          </>)
          : (<>
            <Container>
              <button
                onClick={() => setShowComment(true)}
                className="video-description-btn">
                Show comments<FaAngleDown />
              </button>
              <hr />
            </Container>
          </>)
      }
    </>
  )
}

const Description = ({ description }) => {

  const [showMore, setShowMore] = useState(false)
  const wordLimit = 120

  return (
    <>
      {description.length > wordLimit
        ? <>
          { showMore
            ? (
              <>
                <div className="video-description-div">
                  {description}
                </div>
                <div >
                  <button
                    onClick={() => setShowMore(false)}
                    className="video-description-btn">
                    Hide content<FaAngleUp />
                  </button>
                </div>
                <div>
                  <hr />
                </div>
              </>
            )
            : (
              <>
                <div className="video-description-div">{truncate(description, {
                  'length': wordLimit,
                  'omission': '...'
                })}</div>
                <div >
                  <button
                    onClick={() => setShowMore(true)}
                    className="video-description-btn">
                    Show content<FaAngleDown />
                  </button>
                </div>
                <div>
                  <hr />
                </div>
              </>
            )
          }
        </>
        : <>
          <div className="video-description-div">
            {description}
          </div>
          <div>
            <hr />
          </div>
        </>}
    </>
  )
}

const BrowseMoreVideos = () => {
  return (
    <div className="browse-more-vid">
      <div className="browse-more-sentence">
        <div className="browse-more-header">{"RELATED VIDEOS"}</div>
        <div className="browse-label">
          BROWSE MORE</div>
      </div>
      <div className="browse-more-sentence">

      </div>
    </div>
  )
}

const VideoGrid = ({ videos }) => {
  const { homeLoading } = useSelector((state) => state.home)

  return (
    <>
      {homeLoading && <LoadingSpinner />}
      {!homeLoading &&
        <div className="video-reco-div">
          <Row className="justify-content-md-left">

            <Col md={"auto"} >
              <BrowseMoreVideos />
            </Col>
            {videos.map((videoRow) => {
              return (
                <div key={videoRow.id} className="home-video-row">
                  <Col md={"auto"} >
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
                </div>
              )
            })}

          </Row>
        </div>
      }
    </>
  )
}

const Guest = ({ currentVideo, videoLoading, videos }) => {
  const playerRef = useRef();
  const history = useHistory()
  const videoRef = useRef()

  useEffect(() => {
    if (playerRef.current !== undefined) {
      const player = videojs(playerRef.current, {
        playbackRates: [0.5, 1, 1.5, 2],
        userActions: {
          doubleClick: true
        }
      })

      videoRef.current = player;

      player.ready(() => {
        player.poster("https://image.mux.com/" + currentVideo.playback_id + "/thumbnail.jpg")
        player.src("https://stream.mux.com/" + currentVideo.playback_id + ".m3u8");
        player.load();
      });

      return () => {
        player.dispose();
      };
    }
  }, [currentVideo]);

  return (
    <>
      {videoLoading && <LoadingSpinner />}
      {!videoLoading &&
        (<>
          <Container>
            <video
              id="my-player"
              className="video-js vjs-theme-sea"
              controls
              preload="auto"
              width="100%"
              data-setup='{}'
              ref={playerRef}
              fluid
            >
            </video>
            <div className="video-header">
              <Row>
                <Col className="video-title">{currentVideo.video_title}</Col>
              </Row>
              <Row>
                <Col md={4}>{currentVideo.views + " views | " + currentVideo.subject}</Col>
                <Col md={{ span: 4, offset: 4 }} className="video-date">{"Upload date: " + currentVideo.created_at}</Col>
              </Row>

            </div>
            <hr />
            <div>
              <Media>
                <img
                  alt="Creator"
                  onClick={() => history.push('/profile/' + currentVideo.creator_profile.user)}
                  className="video-profile-picture"
                  src={currentVideo.creator_profile.profile_pic}
                />
                <Media.Body >
                  <div className="video-name-reviews">
                    <Row>
                      <Col>{currentVideo.creator_profile.username}</Col>
                    </Row>
                    <Row>
                      <Col>{currentVideo.creator_profile.aggregate_star + " stars"}</Col>
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
                <Comment />
              </Row>
            </div>
            <VideoGrid videos={videos} />
          </Container>
        </>
        )
      }
    </>
  )
}

const Member = ({ currentVideo, videoLoading }) => {
  const playerRef = useRef();
  const history = useHistory()
  const videoRef = useRef()

  useEffect(() => {
    if (playerRef.current !== undefined) {
      const player = videojs(playerRef.current, {
        playbackRates: [0.5, 1, 1.5, 2],
        userActions: {
          doubleClick: true
        }
      })

      videoRef.current = player;

      player.ready(() => {
        player.poster("https://image.mux.com/" + currentVideo.playback_id + "/thumbnail.jpg")
        player.src("https://stream.mux.com/" + currentVideo.playback_id + ".m3u8");
        player.load();
      });

      return () => {
        player.dispose();
      };
    }
  }, [currentVideo]);


  return (
    <>
      {videoLoading && <LoadingSpinner />}
      {!videoLoading &&
        (<>
          <Container>
            <video
              id="my-player"
              className="video-js vjs-theme-sea"
              controls
              preload="auto"
              width="100%"
              data-setup='{}'
              ref={playerRef}
              fluid
            >
            </video>

            <div className="video-header">
              <Row>
                <Col className="video-title">{currentVideo.video_title}</Col>
              </Row>
              <Row>
                <Col md={4}>{currentVideo.views + " views | " + currentVideo.subject}</Col>
                <Col md={{ span: 4, offset: 4 }} className="video-date">{"Upload date: " + currentVideo.created_at}</Col>
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
                      <Col>{currentVideo.creator_profile.aggregate_star + " stars"}</Col>
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
                <Comment />
              </Row>
            </div>
          </Container>
        </>
        )
      }
    </>
  )
}


const WatchPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo, videoLoading, videos } = useSelector((state) => state.home)

  useEffect(() => {
    dispatch(loadWatchVideos(videoId))
  }, [dispatch, videoId])

  useEffect(() => {
    dispatch(loadHomeVideos())
  }, [dispatch])

  return (
    <>
      <AuthNavBar
        member={<Member
          currentVideo={currentVideo}
          videoLoading={videoLoading}
          videos={videos} />}
        guest={<Guest
          currentVideo={currentVideo}
          videoLoading={videoLoading}
          videos={videos} />}
      />
    </>
  )
}

export default WatchPage