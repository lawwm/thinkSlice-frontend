import React from "react";
import thumbPic from "../images/Cooking_thumbnail.jpg";
import profilePic from "../images/Joe_Biden.jpg";
import { Media, Image } from "react-bootstrap";

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
          <Image
            src={profilePic}
            alt="profile picture"
            fluid
          />
        </div>
        <Media.Body>
            <h5>Roast chicken recipe</h5>
            <p className="caption">Joe Biden 14k views</p>
        </Media.Body>
      </Media>
    </>
  );
};

export default Thumbnail;
