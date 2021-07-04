import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DOMAINS } from "../../store/endpoints.js";
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
  const { activeChat, chats, messages, chatsLoading, chatComponentLoading } =
    useSelector((state) => state.chat);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activeChat = localStorage.getItem("activeChat");

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

    if (activeChat) {
      dispatch(chatActions.getChat(activeChat));
      waitForSocketConnection(() => {
        WebSocketInstance.fetchMessages(activeChat);
      });
    }
  }, [dispatch]);

  useEffect(() => () => localStorage.removeItem("activeChat"), []);

  const messageChangeHandler = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (messages.length === 0) {
      axios.patch(DOMAINS.CHAT + "/" + activeChat.recipient);
    }
    const messageObject = {
      from: parseInt(user),
      to: parseInt(activeChat.recipientId),
      content: message,
      chatId: parseInt(activeChat.chatroom),
    };
    WebSocketInstance.newChatMessage(messageObject);
    setMessage("");
  };

  const renderChatRooms = (chats) => {
    return chats.map((chat) => {
      const isActive = activeChat && chat.chatroom === activeChat.chatroom;
      return (
        <Nav.Item key={chat.id}>
          <Nav.Link
            className="chatroom"
            eventKey={chat.id}
            onSelect={() => {
              dispatch(chatActions.getChat(chat.chatroom));
              WebSocketInstance.fetchMessages(chat.chatroom);
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
      {chatsLoading ? (
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
                  {activeChat && !chatComponentLoading && (
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
