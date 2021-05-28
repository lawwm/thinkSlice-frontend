import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import { AuthNavBar } from "../../components/AuthNavBar"
import { Container, Col, Row } from "react-bootstrap";
import "../styles.css";

import { loadHomeVideos } from "../../store/home/action"
import Thumbnail from "../../components/Thumbnail"

const VideoGrid = ({ videos }) => {
  return (
    <>
      {videos.map((videoRow) => {
        return (
          <div className="home-video-row">
            <Col md={"auto"} key={videoRow.id}>
              <Thumbnail
                title={videoRow.video_title}
                username={videoRow.creator_profile.username}
                views={videoRow.views}
                subject={videoRow.subject}
                date={videoRow.created_at}
                playback_id={videoRow.playback_id}
                imageSrc={videoRow.creator_profile.profile_pic}
                videoId={videoRow.id}
              />
            </Col>
          </div>
        )
      })}
    </>
  )
}

const Member = ({ videos, videoLoading }) => {
  return (
    <Container>
      <h2>Welcome, registered user.</h2>
      <Row className="justify-content-md-left">
        {videoLoading
          ? <LoadingSpinner />
          : <VideoGrid videos={videos} />
        }
      </Row>
    </Container>
  )
}

const Guest = ({ videos, videoLoading }) => {
  return (
    <Container>
      <h2>Log in to get started.</h2>
      <Row className="justify-content-md-left">
        {videoLoading
          ? <LoadingSpinner />
          : <VideoGrid videos={videos} />
        }
      </Row>
    </Container>
  )
}



const Home = () => {
  const dispatch = useDispatch();
  const { videos, videoLoading } = useSelector((state) => state.home)

  useEffect(() => {
    dispatch(loadHomeVideos())
  }, [dispatch])

  return (
    <>
      <AuthNavBar
        member={<Member videos={videos} videoLoading={videoLoading} />}
        guest={<Guest videos={videos} videoLoading={videoLoading} />}

      />
    </>
  );
};

export default Home;
