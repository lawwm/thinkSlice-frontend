import React from "react";

import { Media, Card, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./components.css";

const ChatRoom = ({ profilePic, username, chatroom }) => {
  const { unreadChats } = useSelector((state) => state.chat);
  var hasUnread = false;

  for (const chat of unreadChats) {
    if (chat === chatroom) {
      hasUnread = true;
      break;
    }
  }

  return (
    <Card>
      <Media>
        <Image
          src={profilePic}
          className="thumbnail-photo"
          alt="profile picture"
          fluid
        />
        <Media.Body>
          {hasUnread && <span className="dot"></span>}
          <h5>{username}</h5>
        </Media.Body>
      </Media>
    </Card>
  );
};

export default ChatRoom;
