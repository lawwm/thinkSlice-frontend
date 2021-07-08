import axios from "axios";
import * as actionTypes from "./actionTypes";
import { DOMAINS, ENDPOINTS } from "../endpoints";

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
  const chat = getState().chat;
  const user = parseInt(localStorage.getItem("user"));

  //Update unread messages if the user is in the chatroom
  if (
    chat.isChatOpen &&
    chat.activeChat === message.chatroom &&
    message.author !== user
  ) {
    const chatId = chat.chats.find((chat) => chat.chatroom === message.chatroom).id;
    axios.patch(DOMAINS.CHAT + ENDPOINTS.UPDATE_UNREAD + "/" + chatId);
  }

  // If the user is not on the chat page or in another chatroom, display a notification.
  if (!chat.isChatOpen || chat.activeChat !== message.chatroom) {
    dispatch({
      type: actionTypes.NEW_MESSAGE,
      chatroom: message.chatroom,
    });
  }

  // Open new chat for the first message received from a new user.
  if (message.chat && message.recipient === user) {
    dispatch({
      type: actionTypes.NEW_CHAT_SESSION,
      message: message.message,
      chat: message.chat,
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
