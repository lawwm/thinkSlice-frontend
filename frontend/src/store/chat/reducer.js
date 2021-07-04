import * as actionTypes from "./actionTypes";

const initialState = {
  messages: [],
  chats: [],
  chatsLoading: true,
  chatComponentLoading: false,
  activeChat: null,
  page: 0,
  reachedEnd: false,
  unreadChats: [],
};

const addMessage = (state, action) => {
  return { ...state, messages: [...state.messages, action.message] };
};

const setMessages = (state, action) => {
  return {
    ...state,
    messages: action.messages.reverse(),
    chatComponentLoading: false,
  };
};

const setMoreMessages = (state, action) => {
  if (action.messages.length > 0) {
    return {
      ...state,
      messages: action.messages.reverse().concat(state.messages),
      chatComponentLoading: false,
      page: state.page + 1,
    };
  } else {
    return { ...state, reachedEnd: true, chatComponentLoading: false };
  }
};

export const chat = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return addMessage(state, action);

    case actionTypes.SET_MESSAGES:
      return setMessages(state, action);

    case actionTypes.LOAD_MORE_MESSAGES:
      return { ...state, chatComponentLoading: true };

    case actionTypes.SET_MORE_MESSAGES:
      return setMoreMessages(state, action);

    case actionTypes.NEW_MESSAGE:
      if (!state.unreadChats.find((element) => element === action.chat)) {
        return { ...state, unreadChats: [...state.unreadChats, action.chat] };
      } else {
        return state;
      }

    case actionTypes.GET_CHAT:
    case actionTypes.START_CHAT:
      return { ...state, chatComponentLoading: true };

    case actionTypes.GET_CHAT_SUCCESS:
    case actionTypes.START_CHAT_SUCCESS:
      const chatroom = action.chat.chatroom;
      localStorage.setItem("activeChat", chatroom);
      if (state.unreadChats.indexOf(chatroom) > -1) {
        return {
          ...state,
          unreadChats: state.unreadChats.splice(chatroom, 1),
          activeChat: action.chat,
          reachedEnd: false,
          page: 0,
        };
      } else {
        return {
          ...state,
          activeChat: action.chat,
          reachedEnd: false,
          page: 0,
        };
      }

    case actionTypes.LOAD_CHATS:
      return { ...state, chatsLoading: true };

    case actionTypes.LOAD_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.chats,
        chatsLoading: false,
      };

    case actionTypes.GET_CHAT_FAIL:
      localStorage.removeItem("activeChat");
      return {
        ...state,
        activeChat: null,
        chatComponentLoading: false,
      };

    case actionTypes.RESET_CHATS:
    case actionTypes.START_CHAT_FAIL:
    case actionTypes.LOAD_CHATS_FAIL:
      localStorage.removeItem("activeChat");
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
