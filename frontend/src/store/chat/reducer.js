import * as actionTypes from "./actionTypes";

const initialState = {
  messages: [],
  chats: [],
  chatsLoading: true,
  chatComponentLoading: false,
  activeChat: null,
};

const addMessage = (state, action) => {
  return { ...state, messages: state.messages.concat(action.message) };
};

const setMessages = (state, action) => {
  return { ...state, messages: action.messages.reverse() };
};

export const chat = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return addMessage(state, action);

    case actionTypes.SET_MESSAGES:
      return setMessages(state, action);

    case actionTypes.START_CHAT:
      return { ...state, chatComponentLoading: true };

    case actionTypes.START_CHAT_SUCCESS:
      return {
        ...state,
        chatComponentLoading: false,
        activeChat: action.chat,
      };

    case actionTypes.START_CHAT_FAIL:
      return {
        ...state,
        chatComponentLoading: false,
        activeChat: null,
      };

    default:
      return state;
  }
};
