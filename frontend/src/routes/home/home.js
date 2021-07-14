import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import LoadingSpinner from "../../components/LoadingSpinner.js";
import NavBar from "../../components/NavBar"
import { AuthNavBar } from "../../components/AuthNavBar"
import { Container, Col, Row, Dropdown, Button, InputGroup, FormControl } from "react-bootstrap";
import "../styles.css";

import { changeFilter, changeAscending, changePage, loadHomeVideos, searchVideos, clearSearchVideos } from "../../store/home/action"
import Thumbnail from "../../components/Thumbnail"
import { Sidebar } from "../../components/Sidebar"
import { SidebarModal } from "../../components/SidebarModal.js";
import { FaSearch } from "react-icons/fa";
import { BsFillXCircleFill } from "react-icons/bs";
import greyload from "../../images/Solid_grey.svg"

const HomeSpinner = () => {
  return (
    <>
      <div className="home-spinner-child">
        <LoadingSpinner />
      </div>
    </>
  )
}

export const FilterOptions = ({ filtered, ascending, setFilterOption, setOrderOption }) => {
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

export const VideoGrid = ({ videos }) => {
  return (
    <>
      {videos.map((videoRow) => {
        return (
          <Col key={videoRow.id} xs={12} sm={6} xl={4} className="home-video-row">
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
        )
      })}
    </>
  )
}

const Member = () => {
  return (
    <>
      <Guest />
    </>
  )
}

const Guest = () => {
  const dispatch = useDispatch();
  const { filterBy, ascending, page, subject, location, availability, review, videos, homeLoading, reachedEnd, searchQuery } = useSelector((state) => state.home)

  const loader = useRef(null);
  const [showModal, setShowModal] = useState(false)
  const [searchForm, setSearchForm] = useState("")

  useEffect(() => {
    dispatch(loadHomeVideos(filterBy, ascending, page, reachedEnd, availability, subject, location, review, searchQuery))
  }, [dispatch, page, ascending, filterBy, reachedEnd, availability, subject, location, review, searchQuery])

  useEffect(() => {
    let options = {
      threshold: 0.9
    }

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
      observer.observe(loader.current);
    }

    return () => {
      observer.disconnect()
    }
  }, [dispatch, reachedEnd, homeLoading])

  const setFilterOption = (input) => {
    dispatch(changeFilter(input))
  }

  const setOrderOption = (input) => {
    dispatch(changeAscending(input))
  }

  const submitSearch = () => {
    dispatch(searchVideos(searchForm))
    setSearchForm("")
  }

  const enterSubmitSearch = (keycode) => {
    if (keycode === 13) {
      dispatch(searchVideos(searchForm))
      setSearchForm("")
    }
  }

  return (
    <>
      <link rel="preload" as="image" href={greyload} />
      <NavBar />
      <Container fluid>
        <div className="home-div">
          <div className="container-padding">
            <Row>
              <Col xs={12} md={3}>
                <Sidebar
                  selectedSubject={subject}
                  selectedLocation={location}
                  selectedAvailability={availability}
                  selectedReview={review}
                />
              </Col>
              <Col xs={12} md={9}>
                <div className="home-searchbar-refine">
                  <Row>
                    <Col xs={4}>
                      <Button
                        onClick={() => setShowModal(true)}
                        className="sidebar-button">Refine by</Button>
                    </Col>
                    <Col xs={8}>
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
                    </Col>
                  </Row>
                  <Row>
                    {(searchQuery !== '') &&
                      <div className="home-searchbar">
                        <Col>
                          <Button
                            className="home-clearsearch-btn"
                            onClick={() => dispatch(clearSearchVideos())}
                          >
                            <span>{searchQuery} &nbsp;</span>
                            <span ><BsFillXCircleFill /></span>
                          </Button>
                        </Col>
                      </div>
                    }
                  </Row>
                </div>

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
                {homeLoading && <div className="home-footer">
                  <HomeSpinner />
                </div>}

                {!homeLoading && <div ref={loader} className="home-footer">
                  {reachedEnd && <div className="home-content-end">
                    <hr className="home-footer-break" />
                    <h5>You've reached the end of the page.</h5>
                    <a href="#top">Back to top.</a>
                  </div>}
                </div>}
              </Col>
            </Row>
            <SidebarModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              selectedSubject={subject}
              selectedLocation={location}
              selectedAvailability={availability}
              selectedReview={review}
            />
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
