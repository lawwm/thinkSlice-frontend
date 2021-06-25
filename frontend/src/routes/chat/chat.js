import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { DOMAINS } from "../../store/endpoints.js";
import WebSocketInstance from "../../websocket.js";
import * as chatActions from "../../store/chat/action.js";

import { Container, Col, Row, Form, Button, Nav } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ChatRoom from "../../components/ChatRoom.js";
import ChatBox from "../../components/ChatBox.js";
import "../styles.css";

class Chat extends React.Component {
  state = { message: "" };

  initialiseChat() {
    const { activeChat } = this.props;
    this.waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(activeChat.chatroom);
    });
    WebSocketInstance.connect(activeChat.chatroom);
  }

  constructor(props) {
    super(props);
    WebSocketInstance.addCallbacks(
      this.props.setMessages.bind(this),
      this.props.addMessage.bind(this),
      this.props.setMoreMessages.bind(this)
    );
    if (this.props.activeChat) {
      this.initialiseChat();
    }
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
        callback();
        return;
      } else {
        console.log("wait for connection...");
        component.waitForSocketConnection(callback);
      }
    }, 100);
  }

  componentDidMount() {
    const { loadChats, user } = this.props;
    loadChats(user);
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeChat !== prevProps.activeChat) {
      if (prevProps.activeChat) {
        WebSocketInstance.disconnect();
      }

      if (this.props.activeChat) {
        this.waitForSocketConnection(() => {
          WebSocketInstance.fetchMessages(this.props.activeChat.chatroom);
        });
        WebSocketInstance.connect(this.props.activeChat.chatroom);
      }
    }
  }

  componentWillUnmount() {
    const { resetChats } = this.props;
    resetChats();
    if (this.props.activeChat) {
      WebSocketInstance.disconnect();
    }
  }

  messageChangeHandler = (event) => {
    this.setState({ message: event.target.value });
  };

  sendMessageHandler = (e) => {
    e.preventDefault();
    if (this.props.messages.length === 0) {
      axios.patch(DOMAINS.CHAT + "/" + this.props.activeChat.recipient);
    }
    const messageObject = {
      from: parseInt(this.props.user),
      content: this.state.message,
      chatId: parseInt(this.props.activeChat.chatroom),
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({ message: "" });
  };

  renderChatRooms = (chats) => {
    const { activeChat, getChat } = this.props;
    return chats.map((chat) => {
      const isActive = activeChat && chat.chatroom === activeChat.chatroom;
      return (
        <Nav.Item key={chat.id}>
          <Nav.Link
            className="chatroom"
            eventKey={chat.id}
            onSelect={() => {
              getChat(chat.chatroom);
            }}
            disabled={isActive}
          >
            <ChatRoom
              profilePic={
                "https://thinkslice-project.s3.amazonaws.com/" +
                chat.recipientPic
              }
              username={chat.recipientName}
            />
          </Nav.Link>
        </Nav.Item>
      );
    });
  };

  render() {
    return (
      <>
        {this.props.chatsLoading ? (
          <LoadingSpinner />
        ) : (
          <Container fluid>
            <div className="container-padding">
              <Row>
                <Col>
                  <Nav className="flex-column">
                    {this.props.chats.length > 0 ? (
                      this.renderChatRooms(this.props.chats)
                    ) : (
                      <p>You have not started any chats previously.</p>
                    )}
                  </Nav>
                </Col>
                <Col xs={7}>
                  <ChatBox />
                  <div>
                    {this.props.activeChat && !this.props.chatComponentLoading && (
                      <Form onSubmit={(e) => this.sendMessageHandler(e)}>
                        <Form.Control
                          onChange={(e) => this.messageChangeHandler(e)}
                          value={this.state.message}
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
  }
}

const mapStateToProps = (state) => ({
  user: localStorage.getItem("user"),
  messages: state.chat.messages,
  activeChat: state.chat.activeChat,
  chats: state.chat.chats,
  chatComponentLoading: state.chat.chatComponentLoading,
  chatsLoading: state.chat.chatsLoading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (message) => dispatch(chatActions.addMessage(message)),
    setMessages: (messages) => dispatch(chatActions.setMessages(messages)),
    setMoreMessages: (messages) =>
      dispatch(chatActions.setMoreMessages(messages)),
    resetChats: () => dispatch(chatActions.resetChats()),
    getChat: (roomId) => dispatch(chatActions.getChat(roomId)),
    loadChats: (userId) => dispatch(chatActions.loadChats(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
