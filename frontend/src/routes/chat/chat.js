import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebSocketInstance from "../../websocket.js";
import * as chatActions from "../../store/chat/action.js";

import { Container, Col, Row, Form, Button, Nav } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ChatRoom from "../../components/ChatRoom.js";
import ChatBox from "../../components/ChatBox.js";
import "../styles.css";

const Chat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeChat, chats, chatsLoaded, chatLoading, messagesLoaded } =
    useSelector((state) => state.chat);
  const [message, setMessage] = useState("");

  useEffect(() => dispatch(chatActions.openChat()), [dispatch]);

  useEffect(() => {
    const waitForSocketConnection = (callback) => {
      setTimeout(function () {
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made");
          callback();
          return;
        } else {
          console.log("wait for connection...");
          waitForSocketConnection(callback);
        }
      }, 100);
    };

    if (chats.length > 0 && messagesLoaded.length < 1) {
      waitForSocketConnection(() => {
        chats.forEach((chat) => {
          WebSocketInstance.fetchMessages(chat.chatroom);
        });
      });
    }
  }, [messagesLoaded, chats]);

  useEffect(() => {
    if (chatsLoaded && messagesLoaded.length === chats.length) {
      dispatch(chatActions.loadedAllChatMessages());
    }
  }, [dispatch, chatsLoaded, messagesLoaded, chats]);

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
    const currentChat = chats.find((chat) => chat.chatroom === activeChat);

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

  const renderChatRooms = (chats) => {
    return chats.map((chat) => {
      const isActive = chat.chatroom === activeChat;
      return (
        <Nav.Item key={chat.id}>
          <Nav.Link
            className="chatroom"
            eventKey={chat.id}
            onSelect={() => {
              dispatch(chatActions.setActive(chat.chatroom));
            }}
            disabled={isActive}
          >
            <ChatRoom
              profilePic={
                "https://thinkslice-project.s3.amazonaws.com/" +
                chat.recipientPic
              }
              username={chat.recipientName}
              chatroom={chat.chatroom}
            />
          </Nav.Link>
        </Nav.Item>
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
              <Col>
                <Nav className="flex-column">
                  {chats.length > 0 ? (
                    renderChatRooms(chats)
                  ) : (
                    <p>You have not started any chats previously.</p>
                  )}
                </Nav>
              </Col>
              <Col xs={7}>
                <ChatBox />
                <div>
                  {activeChat && (
                    <Form onSubmit={(e) => sendMessageHandler(e)}>
                      <Form.Control
                        onChange={(e) => messageChangeHandler(e)}
                        value={message}
                        required
                        className="message-input"
                        placeholder="Write your message..."
                      />
                      <Button type="submit">Send</Button>
                    </Form>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      )}
    </>
  );
};

export default Chat;
