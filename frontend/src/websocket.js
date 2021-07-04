class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (WebSocketService.instance === null) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect() {
    var SOCKET_URL;
    if (process.env.NODE_ENV === "development") {
      SOCKET_URL = "ws://127.0.0.1:8000";
    } else if (process.env.NODE_ENV === "production") {
      SOCKET_URL = "wss://thinkslice.herokuapp.com";
    }
    const path = `${SOCKET_URL}/ws/chat`;
    this.socketRef = new WebSocket(path);

    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = (e) => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed");
    };
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }

    console.log(parsedData);

    const command = parsedData.command;
    if (command === "messages") {
      this.callbacks[command](parsedData.messages);
    }
    if (command === "new_message") {
      const user = parseInt(localStorage.getItem("user"));
      if (parsedData.recipient === user || parsedData.message.author === user) {
        this.callbacks[command](parsedData.message, parsedData.chatId);
      }
    }
    if (command === "more_messages") {
      this.callbacks[command](parsedData.messages);
    }
  }

  fetchMessages(chatId) {
    this.sendMessage({
      command: "fetch_messages",
      chatId: chatId,
    });
  }

  newChatMessage(message) {
    this.sendMessage({
      command: "new_message",
      from: message.from,
      to: message.to,
      message: message.content,
      chatId: message.chatId,
    });
  }

  loadMoreMessages(chatId, page) {
    this.sendMessage({
      command: "more_messages",
      chatId: chatId,
      page: page,
    });
  }

  addCallbacks(messagesCallback, newMessageCallback, moreMessagesCallback) {
    this.callbacks["messages"] = messagesCallback;
    this.callbacks["new_message"] = newMessageCallback;
    this.callbacks["more_messages"] = moreMessagesCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    if (this.socketRef) {
      return this.socketRef.readyState;
    } else {
      return 0;
    }
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
