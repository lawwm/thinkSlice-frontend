import React from "react";

import { Media, Card, Image } from "react-bootstrap";
import "./components.css";

const ChatRoom = ({profilePic, username }) => {
  return (
    <Card>
      <Media>
        <Image
          src={profilePic}
          className="thumbnail-photo"
          alt="profile picture"
          fluid
        />
        <Media.Body >
          <h5>{username}</h5>
        </Media.Body>
      </Media>
    </Card>
  );
};

export default ChatRoom;
