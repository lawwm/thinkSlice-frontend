import {
  PROFILE_ERROR,
  PROFILE_LOADED,
  PROFILE_UPDATED,
  PROFILE_DELETED,
  PROFILE_RESET
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
    case PROFILE_DELETED:
      return { ...state, profile: null, loading: true };
    case PROFILE_RESET:
      return { ...state, profile: null, loading: true };
    default:
      return state;
  }
};

export default profile;
