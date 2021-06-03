import * as actionTypes from "./actionTypes";

const initialState = {
  profile: null,
  profileLoading: true,
  detailedMode: false,
  editMode: false,
  reviewsGiven: [],
  reviewsReceived: []
};

export const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.PROFILE_LOADING:
      return { ...state, profileLoading: true };

    case actionTypes.PROFILE_LOADED:
      return {
        ...state,
        profile: payload,
        profileLoading: false,
      };
    case actionTypes.PROFILE_DETAILED_VIEW:
      return { ...state, detailedMode: payload };

    case actionTypes.PROFILE_EDIT_MODE:
      return { ...state, editMode: payload };

    case actionTypes.PROFILE_UPDATED:
      return { ...state, profile: payload, profileLoading: false };

    case actionTypes.REVIEWS_LOADED:
      return {
        ...state,
        reviewsGiven: payload.reviewsGiven,
        reviewsReceived: payload.reviewsReceived,
        profileLoading: false
      };

    case actionTypes.PROFILE_UPDATE_ERROR:
      return { ...state, profileLoading: false };

    case actionTypes.PROFILE_ERROR:
    case actionTypes.PROFILE_DELETED:
    case actionTypes.PROFILE_RESET:
      return { ...state, profile: null, profileLoading: false };

    default:
      return state;
  }
};

export default profile;
