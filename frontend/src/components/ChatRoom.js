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
        <div
          className="thumbnail-photo mr-3"
        >
          <Image
            src={profilePic}
            className="thumbnail-image"
            alt="profile picture"
            fluid
          />
        </div>
        <Media.Body>
          <h5 id="recipient">{username}</h5>
          {hasUnread && <div className="dot"></div>}
          <div className="hide-chat">✖</div>
        </Media.Body>
      </Media>
    </Card>
  );
};

export default ChatRoom;
