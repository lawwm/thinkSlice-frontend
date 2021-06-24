import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { DOMAINS } from "../../store/endpoints.js";
import WebSocketInstance from "../../websocket.js";
import * as chatActions from "../../store/chat/action.js";
import { InView } from "react-intersection-observer";

import { Container, Col, Row, Form, Button, Nav } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ChatRoom from "../../components/ChatRoom.js";
import AlwaysScrollToBottom from "../../components/AlwaysScrollToBottom.js";
import "../styles.css";

class Chat extends React.Component {
  state = { message: "", page: 0 };

  initialiseChat() {
    const { activeChat } = this.props;
    this.waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(this.props.user, activeChat.chatroom);
    });
    WebSocketInstance.connect(activeChat.chatroom);
  }

  constructor(props) {
    super(props);
    WebSocketInstance.addCallbacks(
      this.props.setMessages.bind(this),
      this.props.addMessage.bind(this),
      this.props.loadMoreMessages.bind(this)
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
        this.setState({ page: 0 });
      }

      if (this.props.activeChat) {
        this.waitForSocketConnection(() => {
          WebSocketInstance.fetchMessages(
            this.props.username,
            this.props.activeChat.chatroom
          );
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

  renderTimestamp = (timestamp) => {
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

  renderMessages = (messages) => {
    const currentUser = parseInt(this.props.user);
    return messages.map((message, i, arr) => (
      <div
        key={message.id}
        style={{ marginBottom: arr.length - 1 === i ? "150px" : "15px" }}
        className={
          "message " + (message.author === currentUser ? "sent" : "replies")
        }
      >
        {message.content}
        <br />
        <small>{this.renderTimestamp(message.timestamp)}</small>
      </div>
    ));
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
                  <ul className="chat-box">
                    {this.props.chatComponentLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        {" "}
                        {this.props.messages.length > 15 && (
                          <InView
                            as="div"
                            threshold={1}
                            trackVisibility={true}
                            delay={100}
                            onChange={(inView, entry) => {
                              const { user, activeChat } = this.props;
                              WebSocketInstance.loadMoreMessages(
                                parseInt(user),
                                activeChat.chatroom,
                                this.state.page + 1
                              );
                              this.setState({ page: this.state.page + 1 });
                            }}
                          ><div className="chat-top"></div></InView>
                        )}
                        {this.props.activeChat &&
                          this.renderMessages(this.props.messages)}
                        {this.state.page === 0 && <AlwaysScrollToBottom />}
                      </>
                    )}
                  </ul>
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
    loadMoreMessages: (messages) =>
      dispatch(chatActions.loadMoreMessages(messages)),
    resetChats: () => dispatch(chatActions.resetChats()),
    getChat: (roomId) => dispatch(chatActions.getChat(roomId)),
    loadChats: (userId) => dispatch(chatActions.loadChats(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
