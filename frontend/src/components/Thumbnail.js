import React, { useState } from "react";
import thumbPic from "../images/Cooking_thumbnail.jpg";
import profilePic from "../images/Joe_Biden.jpg";
import { Container, Col, Row, Media, Image } from "react-bootstrap";

const Thumbnail = ({ title, username, views, date, subject, playback_id }) => {

  const [urlFormat, setUrlFormat] = useState("/thumbnail.jpg")
  const animateThumbnail = (shouldAnimate) => {
    shouldAnimate
      ? setUrlFormat("/animated.gif")
      : setUrlFormat("/thumbnail.jpg")
  }

  return (
    <>
      <div className="thumbnail-div" >
        <Image
          width={337}
          height={192}
          src={"https://image.mux.com/" + playback_id + urlFormat}
          onMouseEnter={() => animateThumbnail(true)}
          onMouseLeave={() => animateThumbnail(false)}
          alt="video thumbnail">
        </Image>
        <div className="thumbnail-subject-info">
          {subject}
        </div>
        <div className="thumbnail-subject-duration">
          {date}
        </div>
        <Media>
          <div className="thumbnail-photo">
            <Image src={profilePic} alt="profile picture" fluid />
          </div>

          <Media.Body>
            <div className="thumbnail-body">
              <Row>
                <h5 className="thumbnail-title">{title}</h5>
              </Row>
              <Row>
                <div className="thumbnail-caption">{username} </div>
                <div className="thumbnail-line">{views} views</div>
              </Row>
            </div>
          </Media.Body>
        </Media>
      </div>
    </>
  );
};

export default Thumbnail;
