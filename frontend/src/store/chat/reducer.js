import WebSocketInstance from "../../websocket";
import * as actionTypes from "./actionTypes";

const initialState = {
  isChatOpen: false,
  chats: [],
  chatsLoaded: false,
  messagesLoaded: [],
  chatLoading: true,
  chatComponentLoading: false,
  activeChat: null,
  unreadChats: [],
  chatInitialised: false,
};

const addMessage = (state = initialState, action) => {
  const chatToAdd = state.chats.find(
    (chat) => chat.chatroom === action.chatroom
  );
  const chatIndex = state.chats.indexOf(chatToAdd);
  const updateChats = state.chats;
  updateChats[chatIndex].messages = [...chatToAdd.messages, action.message];
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
      return { ...state, isChatOpen: true, chatLoading: true };

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

      if (wasUnread > -1) {
        const updateUnread = state.unreadChats;
        updateUnread.splice(wasUnread, 1);
        return {
          ...state,
          activeChat: chatroom,
          unreadChats: updateUnread,
          chatComponentLoading: false,
        };
      } else {
        return {
          ...state,
          activeChat: chatroom,
          chatComponentLoading: false,
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
        messagesLoaded: [action.chat.chatroom, ...state.messagesLoaded],
      };

    case actionTypes.HIDE_CHAT:
      const updatedChats = state.chats;
      updatedChats.splice(action.chatIndex, 1);
      const updateLoadedMessages = state.messagesLoaded;
      updateLoadedMessages.splice(action.loadedIndex, 1);
      let newActiveChat = state.activeChat;
      if (action.chatroom === state.activeChat) {
        newActiveChat = null;
        localStorage.removeItem("activeChat");
      }
      return {
        ...state,
        chats: updatedChats,
        messagesLoaded: updateLoadedMessages,
        activeChat: newActiveChat,
      };

    case actionTypes.LOAD_CHATS_SUCCESS:
      let loadedChats = [];
      let hasUnread = [];
      for (const chat of action.chats) {
        loadedChats = [
          ...loadedChats,
          { ...chat, messages: [], reachedEnd: false, page: 0 },
        ];

        if (chat.last_message_count < chat.new_message_count) {
          hasUnread = [...hasUnread, chat.chatroom];
        }
      }
      return {
        ...state,
        chats: loadedChats,
        chatsLoaded: true,
        unreadChats: hasUnread,
      };

    case actionTypes.LOADED_ALL_CHAT_MESSAGES:
      return { ...state, chatLoading: false, chatInitialised: true };

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
      };

    default:
      return state;
  }
};
