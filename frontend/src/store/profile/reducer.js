import {
  PROFILE_ERROR,
  PROFILE_LOADED
} from "./actionTypes";

const initialState = {
  profile: null,
  loading: true
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case PROFILE_LOADED:
      return { ...state, profile: payload, loading: false };
    case PROFILE_ERROR:
      return { ...state, profile: null, loading: false };
    default:
      return state;
  }
};

export default profile;
