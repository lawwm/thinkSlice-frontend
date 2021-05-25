// include the video.js kit javascript and css
import React, { useState, useEffect, useRef } from 'react'

import { Row, Col, Container, Media } from 'react-bootstrap';
import NavBar from "../../components/NavBar.js";
import { useParams } from 'react-router-dom';
import { loadWatchVideos } from "../../store/home/action"
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { AuthNavBar } from "../../components/AuthNavBar"

import videojs from '@mux/videojs-kit';
import '@mux/videojs-kit/dist/index.css';
import "../styles.css";

const Guest = ({ currentVideo, videoLoading }) => {
  const playerRef = useRef();

  useEffect(() => {
    if (playerRef.current != undefined) {
      const player = videojs(playerRef.current, {
        playbackRates: [0.5, 1, 1.5, 2],
        userActions: {
          doubleClick: true
        }
      })
      player.ready(() => {

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
              className="video-js vjs-16-9 vjs-styles-defaults"
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
                  <Row>
                    <Col>{currentVideo.video_description}</Col>

                  </Row>
                </Media.Body>

              </Media>
              <Row>
                <Col>

                </Col>
              </Row>
            </div>
            <hr />
          </Container>
        </>
        )
      }
    </>
  )
}

const Member = ({ currentVideo, videoLoading }) => {
  console.log(currentVideo.playback_id)
  return (
    <>
      {videoLoading && <LoadingSpinner />}
      {!videoLoading &&
        (<>
          <Container>
            <video
              id="my-player"
              class="video-js vjs-16-9"
              controls
              preload="none"
              width="100%"
              data-setup='{}'
            >
              <source src="di9AA4EhaXRJV3NdsnMMs2QnZW2JmhZ00ou01rsKYP4jA" type="video/mux" />
            </video>
            <h1>{currentVideo.video_title}</h1>
          </Container>
        </>
        )
      }
    </>
  )
}


const WatchPage = (props) => {
  const [url, setUrl] = useState("https://stream.mux.com/YGfIkokAS46TEL1cTskw1WURQ6QFGgnY1vqo01k4ctWg.m3u8")

  const { videoId } = useParams();
  console.log(videoId)
  const dispatch = useDispatch();
  const { currentVideo, videoLoading } = useSelector((state) => state.home)

  useEffect(() => {
    dispatch(loadWatchVideos(videoId))
  }, [])

  return (
    <>
      <AuthNavBar
        member={<Member currentVideo={currentVideo} videoLoading={videoLoading} />}
        guest={<Guest currentVideo={currentVideo} videoLoading={videoLoading} />}
      />
    </>
  )
}

export default WatchPage