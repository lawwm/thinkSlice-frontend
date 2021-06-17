import React from "react";

import { Media, Card, Image } from "react-bootstrap";
import Joe_Biden from "../images/Joe_Biden.jpg";
import "./components.css";

const ChatRoom = () => {
  return (
    <Card>
      <Media>
        <Image
          src={Joe_Biden}
          className="thumbnail-photo"
          alt="profile picture"
          fluid
        />
        <Media.Body >
          <h5>Joe Biden</h5>
        </Media.Body>
      </Media>
    </Card>
  );
};

export default ChatRoom;
