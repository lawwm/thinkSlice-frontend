import React from "react";
import { connect } from "react-redux";
import WebSocketInstance from "../../websocket.js";
import * as chatActions from "../../store/chat/action.js";

import { Container, Col, Row, Form, Button } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import ChatRoom from "../../components/ChatRoom.js";
import "../styles.css";

class Chat extends React.Component {
  state = { message: "" };

  initialiseChat() {
    const room_id = this.props.match.params.room_id;

    this.waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(this.props.user, room_id);
    });
    WebSocketInstance.connect(room_id);
  }

  constructor(props) {
    super(props);
    WebSocketInstance.addCallbacks(
      this.props.setMessages.bind(this),
      this.props.addMessage.bind(this)
    );
    if (this.props.match.params.room_id) {
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
    const { loadChats, getChat, user, activeChat } = this.props;
    loadChats(user);
    const roomId = this.props.match.params.room_id;
    if (roomId && !activeChat) {
      getChat(roomId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.room_id !== prevProps.match.params.room_id) {
      WebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        WebSocketInstance.fetchMessages(
          this.props.username,
          this.props.match.params.room_id
        );
      });
      WebSocketInstance.connect(this.props.match.params.room_id);
    }
  }

  componentWillUnmount() {
    const { resetChats } = this.props;
    resetChats();
    if (this.props.match.params.room_id) {
      WebSocketInstance.disconnect();
    }
  }

  messageChangeHandler = (event) => {
    this.setState({ message: event.target.value });
  };

  sendMessageHandler = (e) => {
    e.preventDefault();
    const messageObject = {
      from: parseInt(this.props.user),
      content: this.state.message,
      chatId: parseInt(this.props.match.params.room_id),
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
    return chats.map((chat) => (
      <ChatRoom profilePic={chat.recipientPic} username={chat.recipientName} />
    ));
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
                  <div>
                    {this.props.chats.length > 0 ? (
                      this.renderChatRooms(this.props.chats)
                    ) : (
                      <p>You have not started any chats previously.</p>
                    )}
                  </div>
                </Col>
                <Col xs={7}>
                  <div className="chat-box">
                    {this.props.chatComponentLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        {this.props.activeChat &&
                          this.renderMessages(this.props.messages)}
                      </>
                    )}
                  </div>
                  <div>
                    {this.props.activeChat && (
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
    resetChats: () => dispatch(chatActions.resetChats()),
    getChat: (roomId) => dispatch(chatActions.getChat(roomId)),
    loadChats: (userId) => dispatch(chatActions.loadChats(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
