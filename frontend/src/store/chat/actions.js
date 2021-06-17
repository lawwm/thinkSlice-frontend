import axios from "axios";
import * as actionTypes from "./actionTypes";
import { ENDPOINTS, DOMAINS } from "../endpoints"

export const addMessage = (message) => {
  return {
    type: actionTypes.ADD_MESSAGE,
    message: message,
  };
};

export const setMessages = (messages) => {
  return {
    type: actionTypes.SET_MESSAGES,
    messages: messages,
  };
};

// const getUserChatsSuccess = (chats) => {
//   return {
//     type: actionTypes.GET_CHATS_SUCCESS,
//     chats: chats,
//   };
// };

// export const getUserChats = (username, token) => {
//   try {
//     axios
//       .get(`${HOST_URL}/chat/?username=${username}`)
//       .then((res) => dispatch(getUserChatsSuccess(res.data)));
//   } catch (err) {
//     dispatch({
//       type: actionTypes.GET_CHATS_FAIL,
//     });
//   }
// };
