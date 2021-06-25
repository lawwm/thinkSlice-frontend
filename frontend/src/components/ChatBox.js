import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadMoreMessages } from "../store/chat/action.js";
import WebSocketInstance from "../websocket.js";

import AlwaysScrollToBottom from "./AlwaysScrollToBottom.js";
import LoadingSpinner from "./LoadingSpinner.js";

const ChatBox = () => {
  const loader = useRef();
  const lastMessage = useRef();
  const dispatch = useDispatch();
  const { chatComponentLoading, activeChat, reachedEnd, page, messages } =
    useSelector((state) => state.chat);
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (page > 0 && lastMessage.current) {
      lastMessage.current.scrollIntoView();
    }
  }, [page]);

  useEffect(() => {
    let options = {
      threshold: 0.5,
    };

    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        if (activeChat && !reachedEnd) {
          dispatch(loadMoreMessages());
          WebSocketInstance.loadMoreMessages(activeChat.chatroom, page + 1);
        }
      }
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [dispatch, reachedEnd, chatComponentLoading, activeChat, page]);

  const renderTimestamp = (timestamp) => {
    let prefix = "";
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
      // less than one minute ago
      prefix = "just now...";
    } else if (timeDiff === 1) {
      // one minute ago
      prefix = `1 minute ago`;
    } else if (timeDiff < 60 && timeDiff > 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      // less than 24 hours ago
      const rounded = Math.round(timeDiff / 60);
      if (rounded === 1) {
        prefix = `1 hour ago`;
      } else {
        prefix = `${rounded} hours ago`;
      }
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      // less than 7 days ago
      const rounded = Math.round(timeDiff / (60 * 24));
      if (rounded === 1) {
        prefix = `1 day ago`;
      } else {
        prefix = `${rounded} days ago`;
      }
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  const renderMessages = (messages, user) => {
    return messages.map((message, i, arr) => (
      <div
        key={message.id}
        style={{ marginBottom: arr.length - 1 === i ? "150px" : "15px" }}
        className={"message " + (message.author === user ? "sent" : "replies")}
        ref={lastMessage}
      >
        {message.content}
        <br />
        <small>{renderTimestamp(message.timestamp)}</small>
      </div>
    ));
  };

  return (
    <>
      <div className="chat-box">
        {!chatComponentLoading && <div ref={loader} className="chat-end"></div>}
        {chatComponentLoading && activeChat && <LoadingSpinner />}
        {chatComponentLoading && !activeChat ? (
          <LoadingSpinner />
        ) : (
          <ul className="conversation">
            {activeChat && renderMessages(messages, parseInt(user))}
            {page === 0 && !chatComponentLoading && <AlwaysScrollToBottom />}
          </ul>
        )}
      </div>
    </>
  );
};

export default ChatBox;