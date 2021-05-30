import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import NavBar from "../../components/NavBar"
// import { AuthNavBar } from "../../components/AuthNavBar"
import { Container, Col, Row, Dropdown } from "react-bootstrap";
import "../styles.css";

import { changeFilter, changeAscending, changePage, loadHomeVideos } from "../../store/home/action"
import Thumbnail from "../../components/Thumbnail"
// import { findByAltText } from "@testing-library/dom";

const HomeSpinner = () => {
  return (
    <>
      <div className="home-spinner-child">
        <LoadingSpinner />
      </div>
    </>
  )
}

const FilterOptions = ({ filtered, ascending, setFilterOption, setOrderOption }) => {
  return (
    <>
      <Row>
        <Col md={6}>
          <div>{"Filter: " + filtered + " in "
            + (!ascending ? "descending order" : "ascending order")}
          </div>
        </Col>
        <Col md={6}>
          <div className="dropdown-div">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Sort by
            </Dropdown.Toggle>

              <Dropdown.Menu align="right">
                <Dropdown.Item
                  onClick={() => setFilterOption("popular")}
                  as="button"
                >
                  Popular
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setFilterOption("recent")}
                  as="button"
                >
                  Recent
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Order
            </Dropdown.Toggle>

              <Dropdown.Menu align="right">
                <Dropdown.Item
                  onClick={() => setOrderOption(true)}
                  as="button"
                >Ascending
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setOrderOption(false)}
                  as="button">
                  Descending
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </>
  )
}

const VideoGrid = ({ videos }) => {
  return (
    <>
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
              />
            </Col>
          </div>
        )
      })}
    </>
  )
}


const Home = () => {
  const dispatch = useDispatch();
  const { filterBy, ascending, page, videos, videoLoading, reachedEnd } = useSelector((state) => state.home)
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const loader = useRef(null);

  useEffect(() => {
    let options = {
      threshold: 1.0
    }

    const node = loader.current

    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        if (!reachedEnd) {
          dispatch(changePage())
        }
      }
    }
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(node)
    }

    return () => {
      observer.disconnect()
    }
  }, [dispatch, reachedEnd])

  useEffect(() => {
    dispatch(loadHomeVideos(filterBy, ascending, page, reachedEnd))
  }, [page, dispatch, ascending, filterBy, reachedEnd])

  const setFilterOption = (input) => {
    dispatch(changeFilter(input))
  }

  const setOrderOption = (input) => {
    dispatch(changeAscending(input))
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading &&
        (isAuthenticated ? (
          <>
            <NavBar />
            <Container>
              <h2>Welcome, registered user.</h2>
              <FilterOptions
                filtered={filterBy}
                ascending={ascending}
                setFilterOption={setFilterOption}
                setOrderOption={setOrderOption}
              />
              <hr />
              <Row className="justify-content-md-left">
                {!videoLoading && <VideoGrid videos={videos} />}
              </Row>
              <div ref={loader} className="home-footer">
                {videoLoading && <HomeSpinner />}
              </div>
            </Container>
          </>
        ) : (
          <>
            <NavBar />
            <Container>
              <h2>Log in to get started.</h2>
              <FilterOptions
                filtered={filterBy}
                ascending={ascending}
                setFilterOption={setFilterOption}
                setOrderOption={setOrderOption}
              />
              <hr />
              <Row className="justify-content-md-left">
                {!videoLoading && <VideoGrid videos={videos} />}
              </Row>
              <div ref={loader} className="home-footer">
                {videoLoading && <HomeSpinner />}
              </div>
            </Container>
          </>
        ))
      }
    </>
  );
};

export default Home;
