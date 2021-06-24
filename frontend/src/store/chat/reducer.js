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
  return {
    ...state,
    messages: action.messages.reverse(),
    chatComponentLoading: false,
  };
};

const loadMoreMessages = (state, action) => {
  console.log(action.messages)
  if (action.messages) {
    return {
    ...state,
    messages: action.messages.reverse().concat(state.messages),
    };
  } else {
    return state;
  }
};

export const chat = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return addMessage(state, action);

    case actionTypes.SET_MESSAGES:
      return setMessages(state, action);

    case actionTypes.LOAD_MORE_MESSAGES:
      return loadMoreMessages(state, action);

    case actionTypes.GET_CHAT:
    case actionTypes.START_CHAT:
      return { ...state, chatComponentLoading: true };

    case actionTypes.GET_CHAT_SUCCESS:
    case actionTypes.START_CHAT_SUCCESS:
      return {
        ...state,
        activeChat: action.chat,
      };

    case actionTypes.LOAD_CHATS:
      return { ...state, chatsLoading: true };

    case actionTypes.LOAD_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.chats,
        chatsLoading: false,
      };

    case actionTypes.GET_CHAT_FAIL:
      return {
        ...state,
        activeChat: null,
        chatComponentLoading: false,
      };

    case actionTypes.RESET_CHAT:
    case actionTypes.START_CHAT_FAIL:
    case actionTypes.LOAD_CHATS_FAIL:
      return {
        ...state,
        messages: [],
        chats: [],
        chatComponentLoading: false,
        activeChat: null,
      };

    default:
      return state;
  }
};
