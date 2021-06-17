import * as actionTypes from "./actionTypes";

const initialState = {
  messages: [],
  chats: [],
};

export const chat = (state = initialState, action) => {
  const { type, payload } = action;

  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] };

    case actionTypes.SET_MESSAGES:
      return { ...state, messages: action.messages.reverse() };

    case actionTypes.GET_CHATS_SUCCESS:
      return { ...state, chats: action.chats };

    default:
      return state;
  }
};
