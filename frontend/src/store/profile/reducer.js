import { GET_PROFILE, PROFILE_ERROR } from "./actionTypes";

const initialState = {
  user: null,
  loading: true,
  error: {}
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return { ...state, user: payload, loading: false };
      case PROFILE_ERROR:
          return { ...state, error: payload, loading: false, user: null}
    default:
      return state;
  }
};

export default profile;