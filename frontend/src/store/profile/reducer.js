import * as actionTypes from "./actionTypes";

const initialState = {
  profile: null,
  loading: true,
  detailedMode: false,
  editMode: false,
  reviews: null,
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.PROFILE_LOADING:
      return { ...state, loading: true };

    case actionTypes.PROFILE_LOADED:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case actionTypes.PROFILE_DETAILED_VIEW:
      return { ...state, detailedMode: payload };

    case actionTypes.PROFILE_EDIT_MODE:
      return { ...state, editMode: payload };

    case actionTypes.PROFILE_UPDATED:
      return { ...state, profile: payload, loading: false };

    case actionTypes.REVIEWS_LOADED:
      return { ...state, reviews: payload, loading: false };
      
    case actionTypes.PROFILE_ERROR:
    case actionTypes.PROFILE_DELETED:
    case actionTypes.PROFILE_RESET:
      return { ...state, profile: null, loading: false };

    default:
      return state;
  }
};

export default profile;
