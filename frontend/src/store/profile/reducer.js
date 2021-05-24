import * as actionTypes from "./actionTypes";

const initialState = {
  profile: null,
  loading: true,
  detailedMode: false,
  editMode: false
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {   
    case actionTypes.PROFILE_LOADED:
      return { ...state, profile: payload, loading: false };
    case actionTypes.PROFILE_DETAILED_VIEW:
      return { ...state, detailedMode: payload }
    case actionTypes.PROFILE_EDIT_MODE:
      return { ...state, editMode: payload };
    case actionTypes.PROFILE_ERROR:
    case actionTypes.PROFILE_DELETED:
      return { ...state, profile: null, loading: true };
    case actionTypes.PROFILE_RESET:
      return { ...state, profile: null, loading: true };
    default:
      return state;
  }
};

export default profile;
