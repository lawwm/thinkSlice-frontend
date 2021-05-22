import React from "react";
import thumbPic from "../images/Cooking_thumbnail.jpg";
import profilePic from "../images/Joe_Biden.jpg";
import { Container, Col, Row, Media, Image } from "react-bootstrap";

const Thumbnail = () => {
  return (
    <>
      <Image
        width={600}
        height={315}
        src={thumbPic}
        alt="video thumbnail"
        fluid
      />
      <Media>
        <div className="circle-small">
          <Image src={profilePic} alt="profile picture" fluid />
        </div>
        <Media.Body>
          <Container className="title-caption">
            <Row>
              <h5 className="video-title">Roast chicken recipe</h5>
            </Row>
            <Row>
                <div className="caption">Joe Biden </div>
                <div className="vertical-line">14k views</div>
            </Row>
          </Container>
        </Media.Body>
      </Media>
    </>
  );
};

export default Thumbnail;
