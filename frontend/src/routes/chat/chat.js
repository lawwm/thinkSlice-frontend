import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebSocketInstance from "../../websocket.js";
import * as chatActions from "../../store/chat/action.js";

import { Container, Col, Row, Form, Button, InputGroup, ListGroup } from "react-bootstrap";
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
      return (
        <ListGroup.Item
          key={chat.id}
          className={(activeChat === chat.chatroom) ? "chatroom-selected" : "chatroom"}
        >
          <div
            onClick={() => {
              if (activeChat !== chat.chatroom) {
                console.log("Choose chat")
                dispatch(chatActions.setActive(chat.chatroom));
              }
            }}
          >
            <ChatRoom
              profilePic={
                "https://thinkslice-project.s3.amazonaws.com/" +
                chat.recipientPic
              }
              username={chat.recipientName}
              chatroom={chat.chatroom}
            />
          </div>
          <div
            onClick={() => console.log("Close chat")}
            className={(activeChat === chat.chatroom) ? "hide-chat-selected" : "hide-chat"}>✖</div>
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
              <Col xs={12} sm={12} md={5} lg={4} xl={3}>
                <ListGroup className="flex-column chatroom-group">
                  {chats.length > 0 ? (
                    renderChatRooms(chats)
                  ) : (
                    <p>You have not started any chats previously.</p>
                  )}
                </ListGroup>
              </Col>
              <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                <ChatBox />
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
                          <Button className="chat-sendbutton" type="submit" variant="outline-secondary">Send</Button>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className="chat-empty-space"></div>
        </Container>
      )}
    </>
  );
};

export default Chat;
