import WebSocketInstance from "../../websocket";
import * as actionTypes from "./actionTypes";
import Ding from "../../chatNotificationSound/Ding.mp3";
import { Howl } from "howler";

const initialState = {
  isChatOpen: false,
  chats: [],
  chatsLoaded: false,
  fetchedBefore: false,
  messagesLoaded: [],
  chatLoading: true,
  chatComponentLoading: false,
  activeChat: null,
  unreadChats: [],
  chatInitialised: false,
};

const sound = new Howl({ src: [Ding] });

const addMessage = (state = initialState, action) => {
  const chatToAdd = state.chats.find(
    (chat) => chat.chatroom === action.chatroom
  );
  const chatIndex = state.chats.indexOf(chatToAdd);
  const updateChats = state.chats;
  state.chats[chatIndex].messages = [...chatToAdd.messages, action.message];
  if (state.chats.length > 1) {
    updateChats.unshift(updateChats.splice(chatIndex, 1)[0]);
  }
  return { ...state, chats: updateChats };
};

const setMessages = (state, action) => {
  const chatToSet = state.chats.find(
    (chat) => chat.chatroom === action.chatroom
  );
  const chatIndex = state.chats.indexOf(chatToSet);
  const updateChats = state.chats;
  if (chatIndex > -1) {
    updateChats[chatIndex].messages = action.messages.reverse();
    return {
      ...state,
      chats: updateChats,
      messagesLoaded: state.messagesLoaded.concat(action.chatroom),
    };
  } else {
    return state;
  }
};

const setMoreMessages = (state, action) => {
  const chatToAdd = state.chats.find(
    (chat) => chat.chatroom === action.chatroom
  );
  const chatIndex = state.chats.indexOf(chatToAdd);
  const updateChats = state.chats;

  if (action.messages.length > 0) {
    updateChats[chatIndex] = {
      ...chatToAdd,
      messages: action.messages.reverse().concat(chatToAdd.messages),
      page: chatToAdd.page + 1,
    };
  } else {
    updateChats[chatIndex] = {
      ...chatToAdd,
      reachedEnd: true,
    };
  }
  return { ...state, chats: updateChats, chatComponentLoading: false };
};

export const chat = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHAT_OPEN:
      return {
        ...state,
        isChatOpen: true,
        chatLoading: true,
        chatComponentLoading: false,
      };

    case actionTypes.CHAT_CLOSED:
      return { ...state, isChatOpen: false, activeChat: null };

    case actionTypes.ADD_MESSAGE:
      return addMessage(state, action);

    case actionTypes.SET_MESSAGES:
      return setMessages(state, action);

    case actionTypes.LOAD_MORE_MESSAGES:
      return { ...state, chatComponentLoading: true };

    case actionTypes.SET_MORE_MESSAGES:
      return setMoreMessages(state, action);

    case actionTypes.NEW_MESSAGE:
      if (!sound.playing()) {
        sound.play();
      }

      if (!state.unreadChats.find((chat) => chat === action.chatroom)) {
        return {
          ...state,
          unreadChats: [...state.unreadChats, action.chatroom],
        };
      } else {
        return state;
      }

    case actionTypes.SET_ACTIVE:
      const chatroom = action.chatroom;
      localStorage.setItem("activeChat", chatroom);
      const wasUnread = state.unreadChats.indexOf(chatroom);
      const updatedChat = state.chats.find(
        (chat) => chat.chatroom === action.chatroom
      );
      const chatIndex = state.chats.indexOf(updatedChat);
      state.chats[chatIndex].last_message_count = updatedChat.new_message_count;

      if (wasUnread > -1) {
        state.unreadChats.splice(wasUnread, 1);
        return {
          ...state,
          activeChat: chatroom,
        };
      } else {
        return {
          ...state,
          activeChat: chatroom,
        };
      }

    case actionTypes.START_CHAT:
      return { ...state, chatComponentLoading: true };

    case actionTypes.START_CHAT_SUCCESS:
      const newChatroom = action.chat.chatroom;
      localStorage.setItem("activeChat", newChatroom);
      const startedChat = {
        ...action.chat,
        messages: [],
        reachedEnd: false,
        page: 0,
      };
      WebSocketInstance.fetchMessages(newChatroom);
      return {
        ...state,
        chats: [startedChat].concat(state.chats),
        activeChat: newChatroom,
      };

    case actionTypes.NEW_CHAT_SESSION:
      const incomingChat = {
        ...action.chat,
        messages: [action.message],
        reachedEnd: false,
        page: 0,
      };
      return {
        ...state,
        chats: [incomingChat, ...state.chats],
      };

    case actionTypes.HIDE_CHAT:
      state.chats[action.chatIndex].hidden = true;
      state.messagesLoaded.splice(action.loadedIndex, 1);
      state.unreadChats.splice(action.unreadIndex, 1);
      let newActiveChat = state.activeChat;
      if (action.chatroom === state.activeChat) {
        newActiveChat = null;
        localStorage.removeItem("activeChat");
      }
      return {
        ...state,
        activeChat: newActiveChat,
      };

    case actionTypes.REOPENING_CLOSED_CHAT:
      state.chats[action.chatIndex].hidden = false;
      return { ...state, chatComponentLoading: true };

    case actionTypes.CLOSED_CHAT_REOPENED:
      state.chats[action.chatIndex].hidden = false;
      state.chats[action.chatIndex].messages = action.messages.reverse();
      state.messagesLoaded = state.messagesLoaded.concat(action.chatroom);
      return { ...state, chatComponentLoading: false };

    case actionTypes.LOAD_CHATS_SUCCESS:
      let loadedChats = [];
      let hasUnread = [];
      for (const chat of action.chats) {
        loadedChats = [
          ...loadedChats,
          { ...chat, messages: [], reachedEnd: false, page: 0 },
        ];

        if (!chat.hidden && chat.last_message_count < chat.new_message_count) {
          hasUnread = [...hasUnread, chat.chatroom];
        }
      }
      return {
        ...state,
        chats: loadedChats,
        chatsLoaded: true,
        unreadChats: hasUnread,
      };

    case actionTypes.FETCHING_MESSAGES:
      return { ...state, fetchedBefore: true };

    case actionTypes.LOADED_ALL_CHAT_MESSAGES:
      return { ...state, chatInitialised: true, chatComponentLoading: false };

    case actionTypes.CHAT_LOADED:
      return { ...state, chatLoading: false };

    case actionTypes.RESET_CHATS:
    case actionTypes.START_CHAT_FAIL:
    case actionTypes.LOAD_CHATS_FAIL:
      localStorage.removeItem("activeChat");
      return {
        ...state,
        chats: [],
        unreadChats: [],
        chatsLoaded: false,
        messagesLoaded: [],
        chatLoading: true,
        chatComponentLoading: false,
        activeChat: null,
        chatInitialised: false,
        fetchedBefore: false,
      };

    default:
      return state;
  }
};
