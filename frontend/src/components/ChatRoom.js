import React from "react";

import { Media, Image, } from "react-bootstrap";
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
    <>
      <Media className="chatroom-div">
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
        <Media.Body >
          <div className="chatroom-center">
            <h5 id="recipient">{username}</h5>
            {hasUnread && <span className="dot-positioning">
              <div className="chatroom-dot" />
            </span>}
          </div>
        </Media.Body>
      </Media>
    </>
  );
};

export default ChatRoom;
