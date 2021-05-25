import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import { AuthNavBar } from "../../components/AuthNavBar"
import { Container, Col, Row } from "react-bootstrap";
import "../styles.css";

import { loadHomeVideos } from "../../store/home/action"
import Thumbnail from "../../components/Thumbnail"



const VideoGrid = ({ videos }) => {
  return (
    <>
      {videos.map((video) => {
        return (
          <Col>
            <Thumbnail
              title={video.video_title}
              username={video.creator_profile.username}
              views={video.views}
              subject={video.subject}
              date={video.created_at}
              playback_id={video.playback_id}
              imageSrc={video.creator_profile.profile_pic}
              videoId={video.id}
            />
          </Col>
        )
      })}
    </>
  )
}

const Member = (props) => {
  const { videos, videoLoading } = useSelector((state) => state.home)

  return (
    <Container>
      <h2>Welcome, registered user.</h2>
      <Row>
        {videoLoading
          ? <LoadingSpinner />
          : <VideoGrid videos={videos} />
        }
      </Row>
    </Container>
  )
}

const Guest = () => {
  const { videos, videoLoading } = useSelector((state) => state.home)

  return (
    <Container>
      <h2>Log in to get started.</h2>
      <Row>
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

  useEffect(() => {
    dispatch(loadHomeVideos())
  }, [])

  return (
    <>
      <AuthNavBar member={<Member />} guest={<Guest />} />
    </>
  );
};

export default Home;
