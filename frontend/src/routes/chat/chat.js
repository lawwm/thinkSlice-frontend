import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebSocketInstance from "../../websocket.js";
import * as chatActions from "../../store/chat/action.js";

import {
  Container,
  Col,
  Row,
  Form,
  Button,
  InputGroup,
  ListGroup,
  Media,
  Image,
  Card,
} from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ChatRoom from "../../components/ChatRoom.js";
import ChatBox from "../../components/ChatBox.js";
import "../styles.css";
import { useHistory } from "react-router-dom";

const Chat = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    activeChat,
    chats,
    chatsLoaded,
    chatLoading,
    fetchedBefore,
    messagesLoaded,
    chatInitialised,
  } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");
  const [chatFilter, setChatFilter] = useState("");
  const [chatroomsCollapsed, collapseChatrooms] = useState(
    window.innerWidth <= 768
  );
  const [chatroomsView, toggleChatrooms] = useState(false);
  const [visibleChats, setVisibleChats] = useState([]);
  const [visibleFiltered, filteredVisible] = useState(false);

  const currentChat = chats.find((chat) => chat.chatroom === activeChat);

  useEffect(() => dispatch(chatActions.openChat()), [dispatch]);

  useEffect(() => {
    if (chatsLoaded) {
      setVisibleChats(chats.filter((chat) => !chat.hidden));
      filteredVisible(true);
    }
  }, [chats, chatsLoaded]);

  useEffect(() => {
    const waitForSocketConnection = (callback) => {
      setTimeout(function () {
        if (WebSocketInstance.state() === 1) {
          // console.log("Connection is made");
          callback();
          return;
        } else {
          // console.log("wait for connection...");
          waitForSocketConnection(callback);
        }
      }, 100);
    };

    if (visibleFiltered && !fetchedBefore) {
      waitForSocketConnection(() => {
        visibleChats.forEach((chat) => {
          WebSocketInstance.fetchMessages(chat.chatroom);
        });
        dispatch(chatActions.fetchingMessages());
      });
    }
  }, [dispatch, visibleFiltered, visibleChats, fetchedBefore]);

  useEffect(() => {
    if (visibleFiltered && messagesLoaded.length === visibleChats.length) {
      dispatch(chatActions.loadedAllChatMessages());
    }
  }, [dispatch, visibleFiltered, visibleChats, messagesLoaded]);

  useEffect(() => {
    if (chatInitialised) {
      dispatch(chatActions.chatLoaded());
    }
  }, [dispatch, chatInitialised]);

  useEffect(() => {
    const activeChat = localStorage.getItem("activeChat");

    if (activeChat && chatsLoaded) {
      dispatch(chatActions.setActive(parseInt(activeChat)));
    }
  }, [dispatch, chatsLoaded]);

  useEffect(() => () => dispatch(chatActions.closeChat()), [dispatch]);

  const messageChangeHandler = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageHandler = (e) => {
    e.preventDefault();

    let messageObject = {
      from: parseInt(user),
      to: parseInt(currentChat.recipient),
      content: message,
      chatroom: parseInt(currentChat.chatroom),
      isFirst: false,
    };

    if (currentChat.messages.length === 0) {
      WebSocketInstance.newChatMessage({
        ...messageObject,
        isFirst: true,
      });
    } else {
      WebSocketInstance.newChatMessage(messageObject);
    }
    setMessage("");
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        collapseChatrooms(true);
      } else {
        collapseChatrooms(false);
      }
    });
  }, []);

  const renderChatRooms = (chats) => {
    return chats.map((chat) => {
      return (
        <ListGroup.Item
          key={chat.id}
          className={
            activeChat === chat.chatroom ? "chatroom-selected" : "chatroom"
          }
        >
          <div
            onClick={() => {
              if (chat.hidden) {
                dispatch(chatActions.reopenClosedChat(chat));
                setVisibleChats(visibleChats.concat(chat));
              }
              if (activeChat !== chat.chatroom) {
                dispatch(chatActions.setActive(chat.chatroom));
              }
              setChatFilter("");
              toggleChatrooms(false);
            }}
          >
            <ChatRoom
              profilePic={
                // "https://thinkslice-project.s3.amazonaws.com/" +
                "https://d9ws6ej9ht96n.cloudfront.net/" + chat.recipientPic
              }
              username={chat.recipientName}
              chatroom={chat.chatroom}
              userId={chat.recipient}
            />
          </div>
          {!chat.hidden && (
            <div
              onClick={() => {
                // console.log("Close chat");
                dispatch(chatActions.hideChat(chat));
                visibleChats.splice(visibleChats.indexOf(chat), 1);
              }}
              className="hide-chat"
            >
              ✖
            </div>
          )}
        </ListGroup.Item>
      );
    });
  };

  return (
    <>
      {chatLoading ? (
        <LoadingSpinner />
      ) : (
        <Container fluid>
          <div className="container-padding">
            <Row>
              {(!chatroomsCollapsed || chatroomsView) && (
                <Col md={5} lg={4} xl={3}>
                  <Form.Control
                    className="chatroom-group-search"
                    placeholder={"Search chats..."}
                    value={chatFilter}
                    onChange={(e) => {
                      setChatFilter(e.target.value);
                    }}
                  ></Form.Control>
                  <div className="chatroom-list">
                    <ListGroup className="flex-column chatroom-group">
                      {chats.length > 0 && visibleChats.length > 0 ? (
                        renderChatRooms(
                          chatFilter === ""
                            ? chats.filter((chat) => !chat.hidden)
                            : chats.filter((chat) =>
                                chat.recipientName
                                  .toLowerCase()
                                  .includes(chatFilter.toLowerCase())
                              )
                        )
                      ) : (
                        <>
                          {chats.length > 0 && visibleChats.length === 0 ? (
                            <>
                              {visibleChats.length === 0 &&
                                chatFilter === "" && (
                                  <p className="no-chats">
                                    You may use the search bar to reopen chats
                                    that were closed.
                                  </p>
                                )}
                              {chatFilter !== "" &&
                                renderChatRooms(
                                  chats.filter((chat) =>
                                    chat.recipientName
                                      .toLowerCase()
                                      .includes(chatFilter.toLowerCase())
                                  )
                                )}
                            </>
                          ) : (
                            <p className="no-chats">
                              You have not started any chats previously.
                            </p>
                          )}
                          {chatroomsCollapsed && (
                            <span
                              className="forward-arrow"
                              onClick={() => toggleChatrooms(false)}
                            >
                              ❯
                            </span>
                          )}
                        </>
                      )}
                    </ListGroup>
                  </div>
                </Col>
              )}
              {(!chatroomsView || !chatroomsCollapsed) && (
                <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                  <Card className="active-chat">
                    <Media>
                      {chatroomsCollapsed && (
                        <div
                          className="back-arrow"
                          onClick={() => toggleChatrooms(true)}
                        >
                          ❮
                        </div>
                      )}
                      {currentChat && (
                        <>
                          <div className="chat-photo mr-3">
                            <Image
                              src={
                                // "https://thinkslice-project.s3.amazonaws.com/" +
                                "https://d9ws6ej9ht96n.cloudfront.net/" +
                                currentChat.recipientPic
                              }
                              className="thumbnail-image"
                              alt="profile picture"
                              fluid
                              onClick={() =>
                                history.push(
                                  "/profile/" + currentChat.recipient
                                )
                              }
                            />
                          </div>
                          <Media.Body>
                            <div>
                              <div className="chatroom-center">
                                <h5
                                  id="recipient-header"
                                  onClick={() =>
                                    history.push(
                                      "/profile/" + currentChat.recipient
                                    )
                                  }
                                >
                                  {currentChat.recipientName}
                                </h5>
                              </div>
                            </div>
                          </Media.Body>
                        </>
                      )}
                    </Media>
                  </Card>
                  <ChatBox
                    visibleChats={visibleChats}
                  />
                  <div>
                    {activeChat && (
                      <Form onSubmit={(e) => sendMessageHandler(e)}>
                        <InputGroup>
                          <Form.Control
                            onChange={(e) => messageChangeHandler(e)}
                            value={message}
                            required
                            className="message-input chat-sendbox"
                            placeholder="Write your message..."
                          />
                          <InputGroup.Append>
                            <Button
                              className="chat-sendbutton"
                              type="submit"
                              variant="outline-secondary"
                            >
                              Send
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </Form>
                    )}
                  </div>
                </Col>
              )}
            </Row>
          </div>
          <div className="chat-empty-space"></div>
        </Container>
      )}
    </>
  );
};

export default Chat;
