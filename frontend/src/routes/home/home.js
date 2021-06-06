import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import NavBar from "../../components/NavBar"
import { AuthNavBar } from "../../components/AuthNavBar"
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
          <div className="home-filter-description">{"Filter: " + filtered + " in "
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
                profileId={videoRow.creator_profile.user}
              />
            </Col>
          </div>
        )
      })}
    </>
  )
}

const Member = () => {
  const dispatch = useDispatch();
  const { filterBy, ascending, page, videos, homeLoading, reachedEnd } = useSelector((state) => state.home)

  const loader = useRef(null);

  useEffect(() => {
    dispatch(loadHomeVideos(filterBy, ascending, page, reachedEnd))
  }, [dispatch, page, ascending, filterBy, reachedEnd])

  useEffect(() => {
    let options = {
      threshold: 0.5
    }

    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        if (!reachedEnd) {
          // console.log("Just saw the footer man!")
          dispatch(changePage())
        }
      }
    }
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [dispatch, reachedEnd])


  const setFilterOption = (input) => {
    dispatch(changeFilter(input))
  }

  const setOrderOption = (input) => {
    dispatch(changeAscending(input))
  }

  return (
    <>
      <NavBar />
      <Container>
        <div className="home-div">
          <h2>Welcome, registered user.</h2>
          <FilterOptions
            filtered={filterBy}
            ascending={ascending}
            setFilterOption={setFilterOption}
            setOrderOption={setOrderOption}
          />
          <hr className="home-filter-break" />
          <Row className="justify-content-md-left">
            <VideoGrid videos={videos} />
          </Row>
          <div ref={loader} className="home-footer">
            {homeLoading && <HomeSpinner />}
            {reachedEnd && <div className="home-content-end">
              <hr className="home-footer-break" />
              <h5>You've reached the end of the page.</h5>
              <a href="#top">Back to top.</a>
            </div>}
          </div>
        </div>
      </Container>
    </>
  )
}

const Guest = () => {
  const dispatch = useDispatch();
  const { filterBy, ascending, page, videos, homeLoading, reachedEnd } = useSelector((state) => state.home)

  const loader = useRef(null);

  useEffect(() => {
    dispatch(loadHomeVideos(filterBy, ascending, page, reachedEnd))
  }, [dispatch, page, ascending, filterBy, reachedEnd])

  useEffect(() => {
    let options = {
      threshold: 0.5
    }

    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        if (!reachedEnd) {
          // console.log("Just saw the footer man!")
          dispatch(changePage())
        }
      }
    }
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [dispatch, reachedEnd])

  const setFilterOption = (input) => {
    dispatch(changeFilter(input))
  }

  const setOrderOption = (input) => {
    dispatch(changeAscending(input))
  }

  return (
    <>
      <NavBar />
      <Container>
        <div className="home-div">
          <h2>Log in to get started.</h2>
          <FilterOptions
            filtered={filterBy}
            ascending={ascending}
            setFilterOption={setFilterOption}
            setOrderOption={setOrderOption}
          />
          <hr className="home-filter-break" />
          <Row className="justify-content-md-left">
            <VideoGrid videos={videos} />
          </Row>
          <div ref={loader} className="home-footer">
            {homeLoading && <HomeSpinner />}
            {reachedEnd && <div className="home-content-end">
              <hr className="home-footer-break" />
              <h5>You've reached the end of the page.</h5>
              <a href="#top">Back to top.</a>
            </div>}
          </div>
        </div>
      </Container>
    </>
  )
}

const Home = () => {
  return (
    <>
      <AuthNavBar member={<Member />} guest={<Guest />} />
    </>
  );
};

export default Home;
