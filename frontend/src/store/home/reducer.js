import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  VIDEO_LOADING,
  UPLOAD_STARTED,
  UPLOAD_ENDED,
  REACHED_END,
  CHANGE_FILTER,
  CHANGE_ASCENDING,
  CHANGE_PAGE
  // UPDATE_WINDOW_SIZE
} from "./actionTypes.js"

const initialState = {
  videos: [],
  videoLoading: true,
  currentVideo: {},
  isUploading: false,
  reachedEnd: false,
  filterBy: "recent",
  ascending: false,
  page: 0
}
//set initial page to zero so initial loadhomevideo action before 
//bottom div is observed is negated 


export const home = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case HOMEPAGE_LOADED:
      let payloadId = payload.map(video => video.id)
      let newVideos = state.videos.filter(val => !payloadId.includes(val.id))
      return {
        ...state,
        videos: newVideos.concat(payload),
        videoLoading: false
      }
    case VIDEO_LOADED:
      return {
        ...state,
        currentVideo: payload,
        videoLoading: false
      }
    case VIDEO_LOADING:
      return {
        ...state,
        videoLoading: true
      }
    case HOMEPAGE_LOAD_FAIL:
      return {
        ...state,
        videoLoading: false
      }
    case UPLOAD_STARTED:
      return {
        ...state,
        isUploading: true
      }
    case UPLOAD_ENDED:
      return {
        ...state,
        isUploading: false
      }
    case REACHED_END:
      return {
        ...state,
        reachedEnd: true
      }
    case CHANGE_FILTER:
      return {
        ...state,
        filterBy: payload,
        videos: [],
        reachedEnd: false,
        page: 0
      }
    case CHANGE_ASCENDING:
      return {
        ...state,
        ascending: payload,
        videos: [],
        reachedEnd: false,
        page: 0
      }
    case CHANGE_PAGE:
      return {
        ...state,
        page: state.page + 1
      }
    default:
      return state;
  }
}