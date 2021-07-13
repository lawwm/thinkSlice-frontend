import * as actionTypes from "./actionTypes";

const initialState = {
  profile: null,
  profileLoading: true,
  profileComponentLoading: false,
  reviewLoading: true,
  reviewPostLoading: false,
  detailedMode: false,
  editMode: false,
  reviewUser: null,
  reviewsGiven: [],
  reviewsReceived: [],
  profileLikes: []
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

    case actionTypes.PROFILE_COMPONENT_LOADING:
      return {
        ...state, profileComponentLoading: true
      }
    case actionTypes.PROFILE_COMPONENT_LOADED:
      return {
        ...state, profileComponentLoading: false
      }
    case actionTypes.PROFILE_EDIT_VIDEO:
      const videoArray = [...state.profile.basic.video]
      const indexVideo = videoArray.findIndex(video => video.id === payload.id);
      videoArray[indexVideo] = {
        ...videoArray[indexVideo],
        video_title: payload.video_title,
        video_description: payload.video_description,
        subject: payload.subject
      }
      console.log(videoArray)
      return {
        ...state,
        profile: {
          ...state.profile,
          basic: {
            ...state.profile.basic,
            video: videoArray
          }
        }
      }
    case actionTypes.PROFILE_DELETE_VIDEO:
      return {
        ...state,
        profile: {
          ...state.profile,
          basic: {
            ...state.profile.basic,
            video: state.profile.basic.video.filter(video => video.id !== payload)
          }
        }
      }
    case actionTypes.PROFILE_DETAILED_VIEW:
      return { ...state, detailedMode: payload };

    case actionTypes.PROFILE_EDIT_MODE:
      return { ...state, editMode: payload };
    case actionTypes.PROFILE_PIC_EDIT:
      return {
        ...state,
        profile: {
          ...state.profile,
          basic: {
            ...state.profile.basic,
            profile_pic: payload
          }
        }
      }
    case actionTypes.PROFILE_UPDATED:
      return { ...state, profile: payload, profileLoading: false };

    case actionTypes.PROFILE_LIKED:
      return {
        ...state,
        profileLikes: payload
      }

    case actionTypes.REVIEWS_LOADED:
      return {
        ...state,
        reviewsGiven: payload.reviewsGiven,
        reviewsReceived: payload.reviewsReceived,
        reviewLoading: false,
        reviewUser: payload.reviewUser
      };
    case actionTypes.SET_REVIEW_LOADING:
      return {
        ...state,
        reviewLoading: true
      }
    case actionTypes.SET_REVIEW_POST_LOADING:
      return {
        ...state,
        reviewPostLoading: true
      }
    case actionTypes.STOP_REVIEW_LOADING:
      return {
        ...state,
        reviewLoading: false
      }
    case actionTypes.STOP_REVIEW_POST_LOADING:
      return {
        ...state,
        reviewPostLoading: false
      }
    case actionTypes.PROFILE_UPDATE_ERROR:
      return { ...state, profileLoading: false };
    case actionTypes.CREATE_REVIEW:
      return {
        ...state,
        reviewsReceived: [payload].concat(state.reviewsReceived),
        reviewLoading: false
      }
    case actionTypes.EDIT_REVIEW:
      const { id, updatedData } = payload

      const indexGiven = state.reviewsGiven.findIndex(review => review.id === id); //finding index of the item
      const indexReceived = state.reviewsReceived.findIndex(todo => todo.id === id); //finding index of the item
      const arrayGiven = [...state.reviewsGiven]
      const arrayReceived = [...state.reviewsReceived]

      if (indexGiven !== -1) {
        arrayGiven[indexGiven] = {
          ...updatedData,
          creator_details: arrayGiven[indexGiven].creator_details
        }
      }
      if (indexReceived !== -1) {
        arrayReceived[indexReceived] = {
          ...updatedData,
          creator_details: arrayReceived[indexReceived].creator_details
        }
      }
      return {
        ...state,
        reviewsGiven: arrayGiven,
        reviewsReceived: arrayReceived,
        reviewPostLoading: false
      }
    case actionTypes.DELETE_REVIEW:
      return {
        ...state,
        reviewsGiven: state.reviewsGiven.filter(review => review.id !== payload),
        reviewsReceived: state.reviewsReceived.filter(review => review.id !== payload),
        reviewPostLoading: false
      }
    case actionTypes.PROFILE_ERROR:
    case actionTypes.PROFILE_DELETED:
    case actionTypes.PROFILE_RESET:
      return { ...state, profile: null, profileLoading: false };

    default:
      return state;
  }
};

export default profile;
