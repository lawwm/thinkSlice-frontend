import axios from "axios";
import * as actionTypes from "./actionTypes";
import { DOMAINS, ENDPOINTS } from "../endpoints";

export const addMessage = (message) => async (dispatch) => {
  dispatch({
    type: actionTypes.ADD_MESSAGE,
    message: message,
  });
};

export const setMessages = (messages) => async (dispatch) => {
  console.log(messages)
  dispatch({
    type: actionTypes.SET_MESSAGES,
    messages: messages,
  });
};

export const loadMoreMessages = (messages) => async(dispatch) => {
  console.log(messages)
  dispatch({
    type: actionTypes.LOAD_MORE_MESSAGES,
    messages: messages,
  })
}

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
    type: actionTypes.RESET_CHAT,
  });
};

export const getChat = (roomId) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.GET_CHAT,
    });
    const res = await axios.get(
      DOMAINS.CHAT + ENDPOINTS.ACCESS_CHATROOM + "/" + roomId
    );
    dispatch({
      type: actionTypes.GET_CHAT_SUCCESS,
      chat: res.data,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_CHAT_FAIL,
    });
  }
};

export const loadChats = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.LOAD_CHATS,
    });
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
