import axios from "axios";
import * as actionTypes from "./actionTypes";
import { DOMAINS, ENDPOINTS } from "../endpoints";
import WebSocketInstance from "../../websocket";

export const openChat = () => async (dispatch) => {
  dispatch({
    type: actionTypes.CHAT_OPEN,
  });
};

export const closeChat = () => async (dispatch) => {
  dispatch({
    type: actionTypes.CHAT_CLOSED,
  });
};

export const addMessage = (message) => async (dispatch, getState) => {
  const { chats, isChatOpen, activeChat } = getState().chat;
  const user = parseInt(localStorage.getItem("user"));

  //Update unread messages if the user is in the chatroom
  if (
    isChatOpen &&
    activeChat === message.chatroom &&
    message.message.author !== user
  ) {
    const chatId = chats.find((chat) => chat.chatroom === message.chatroom).id;
    axios.patch(DOMAINS.CHAT + ENDPOINTS.UPDATE_UNREAD + "/" + chatId);
  }

  // If the user is not on the chat page or in another chatroom, display a notification.
  if (
    message.message.author !== user &&
    (!isChatOpen || activeChat !== message.chatroom)
  ) {
    dispatch({
      type: actionTypes.NEW_MESSAGE,
      chatroom: message.chatroom,
    });
  }

  const openedBefore = chats.find((chat) => chat.chatroom === message.chatroom);

  // Open new chat for the first message received from a new user.
  if (!openedBefore) {
    dispatch({
      type: actionTypes.NEW_CHAT_SESSION,
      message: message.message,
      chat: message.chat,
    });
  } else if (openedBefore.hidden) {
    //Reopen a chat that was previously closed.
    const chatIndex = chats.indexOf(openedBefore);
    dispatch({
      type: actionTypes.CLOSED_CHAT_REOPENED,
      messages: message.messages,
      chatIndex: chatIndex,
      chatroom: message.chatroom,
    });
  } else {
    // Add new message to relevant chat.
    dispatch({
      type: actionTypes.ADD_MESSAGE,
      message: message.message,
      chatroom: message.chatroom,
    });
  }
};

export const setMessages = (messages) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_MESSAGES,
    messages: messages.messages,
    chatroom: messages.chatroom,
  });
};

export const loadedAllChatMessages = () => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADED_ALL_CHAT_MESSAGES,
  });
};

export const loadMoreMessages = () => async (dispatch) => {
  dispatch({
    type: actionTypes.LOAD_MORE_MESSAGES,
  });
};

export const setMoreMessages = (messages) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_MORE_MESSAGES,
    messages: messages.messages,
    chatroom: messages.chatroom,
  });
};

export const startChat = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.START_CHAT,
    });
    const res = await axios.post(DOMAINS.CHAT + "/" + userId);
    dispatch({
      type: actionTypes.START_CHAT_SUCCESS,
      chat: res.data,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.START_CHAT_FAIL,
    });
  }
};

export const resetChats = () => async (dispatch) => {
  dispatch({
    type: actionTypes.RESET_CHATS,
  });
};

export const setActive = (chatroom) => async (dispatch, getState) => {
  if (getState().chat.unreadChats.includes(chatroom)) {
    const chatId = getState().chat.chats.find(
      (chat) => chat.chatroom === chatroom
    ).id;
    axios.patch(DOMAINS.CHAT + ENDPOINTS.UPDATE_UNREAD + "/" + chatId);
  }

  dispatch({
    type: actionTypes.SET_ACTIVE,
    chatroom: chatroom,
  });
};

export const loadChats = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(DOMAINS.CHAT + "/" + userId);
    dispatch({
      type: actionTypes.LOAD_CHATS_SUCCESS,
      chats: res.data,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.LOAD_CHATS_FAIL,
    });
  }
};

export const hideChat = (chat) => async (dispatch, getState) => {
  axios.patch(DOMAINS.CHAT + ENDPOINTS.ACCESS_CHAT + "/" + chat.id);
  const { chats, messagesLoaded, unreadChats } = getState().chat;
  const chatIndex = chats.indexOf(chat);
  const loadedIndex = messagesLoaded.indexOf(chat.chatroom);
  const unreadIndex = unreadChats.indexOf(chat.chatroom);
  dispatch({
    type: actionTypes.HIDE_CHAT,
    chatIndex: chatIndex,
    loadedIndex: loadedIndex,
    unreadIndex: unreadIndex,
    chatroom: chat.chatroom,
  });
};

export const chatLoaded = () => async (dispatch) => {
  dispatch({
    type: actionTypes.CHAT_LOADED,
  });
};

export const fetchingMessages = () => async (dispatch) => {
  dispatch({
    type: actionTypes.FETCHING_MESSAGES,
  });
};

export const reopenClosedChat = (chat) => async (dispatch, getState) => {
  axios.patch(DOMAINS.CHAT + ENDPOINTS.ACCESS_CHAT + "/" + chat.id);
  const { chats, chatInitialised } = getState().chat;
  const chatIndex = chats.indexOf(chat);
  dispatch({
    type: actionTypes.REOPENING_CLOSED_CHAT,
    chatIndex: chatIndex,
  });
  if (chatInitialised) {
    WebSocketInstance.fetchMessages(chat.chatroom);
  }
};
