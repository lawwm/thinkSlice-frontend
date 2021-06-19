import axios from "axios";
import * as actionTypes from "./actionTypes";
import { DOMAINS } from "../endpoints";

export const addMessage = (message) => async (dispatch) => {
  dispatch({
    type: actionTypes.ADD_MESSAGE,
    message: message,
  });
};

export const setMessages = (messages) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_MESSAGES,
    messages: messages,
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
      type: actionTypes.RESET_CHAT,
    });
};

export const loadChats = (userId) => async (dispatch) => {
  try {
  } catch (err) {
    dispatch({
      type: actionTypes.GET_CHATS_FAIL,
    });
  }
};
