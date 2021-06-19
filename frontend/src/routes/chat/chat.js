import React from "react";
import { connect } from "react-redux";
import WebSocketInstance from "../../websocket.js";
import * as chatActions from "../../store/chat/action.js";

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
    this.initialiseChat();
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
    } else if (timeDiff < 60 && timeDiff > 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      // less than 7 days ago
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  renderMessages = (messages) => {
    const currentUser = parseInt(this.props.user);
    return messages.map((message, i, arr) => (
      <li
        key={message.id}
        style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
        className={message.author === currentUser ? "sent" : "replies"}
      >
        <p>
          {message.content}
          <br />
          <small>{this.renderTimestamp(message.timestamp)}</small>
        </p>
      </li>
    ));
  };

  render() {
    return (
      <>
        <div className="messages">
          <ul id="chat-log">
            {this.props.messages && this.renderMessages(this.props.messages)}
            <div
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            />
          </ul>
        </div>
        <div className="message-input">
          <form onSubmit={this.sendMessageHandler}>
            <div className="wrap">
              <input
                onChange={this.messageChangeHandler}
                value={this.state.message}
                required
                id="chat-message-input"
                type="text"
                placeholder="Write your message..."
              />
              <button id="chat-message-submit" className="submit">
                <i className="fa fa-paper-plane" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  messages: state.chat.messages,
});

const mapDispatchToProps = dispatch => {
  return {
    addMessage: message => dispatch(chatActions.addMessage(message)),
    setMessages: messages => dispatch(chatActions.setMessages(messages)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
