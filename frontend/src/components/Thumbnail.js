import React, { useState } from "react";
import { Row, Media, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { setVideoLoading } from "../store/home/action";
import { useDispatch } from "react-redux";

const Thumbnail = ({ title, username, views, date, subject, playback_id, imageSrc, videoId }) => {

  const dispatch = useDispatch();
  const history = useHistory();
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
          onClick={() => {
            dispatch(setVideoLoading())
            history.push('/watch/' + videoId)
          }
          }
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
          <div className="thumbnail-photo" onClick={() => history.push('/profile')}>
            <Image src={imageSrc} alt="profile picture" fluid />
          </div>

          <Media.Body onClick={() => history.push('/watch/' + videoId)}>
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
