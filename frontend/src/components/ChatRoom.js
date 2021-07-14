import React from "react";

import { Media, Image, } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./components.css";

const ChatRoom = ({ profilePic, username, chatroom, userId }) => {
  const { unreadChats } = useSelector((state) => state.chat);
  var hasUnread = false;
  const history = useHistory();

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
            onClick={()=> history.push("/profile/" + userId)}
          />
        </div>
        <Media.Body >
          <div className="chatroom-center">
            <h5 id="recipient">{username}</h5>
            {hasUnread && <span className="dot-positioning">
              <div className="chatroom-dot"/>
            </span>}
          </div>
        </Media.Body>
      </Media>
    </>
  );
};

export default ChatRoom;
