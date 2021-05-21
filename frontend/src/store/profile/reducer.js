import {
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAIL,
  GET_PROFILE,
  PROFILE_ERROR
} from "./actionTypes";

const initialState = {
  profile: null,
  loading: true
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PROFILE_SUCCESS:
    case GET_PROFILE:
      return { ...state, profile: payload, loading: false };
    case CREATE_PROFILE_FAIL:
    case PROFILE_ERROR:
      return { ...state, profile: null, loading: false };
    default:
      return state;
  }
};

export default profile;
