import axios from 'axios'
import { ENDPOINTS, DOMAINS } from "../endpoints"
import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  VIDEO_LOADING,
  VIDEO_LOAD_FAILED,
  UPLOAD_STARTED,
  UPLOAD_ENDED
} from "./actionTypes"
import { format, formatDistance } from 'date-fns'

// Helper functions
function convertUnixToTimeElapsed(date) {
  var date = new Date(date * 1000)
  return formatDistance(
    date,
    new Date(),
    { addSuffix: true },
  )
}

function convertUnixToExactDate(date) {
  var date = new Date(date * 1000)
  console.log(date)
  console.log(format(date, 'PPP'))
  return format(date, 'PPP')
}

// Actions
export const loadHomeVideos = () => async (dispatch) => {
  try {
    const res = await axios.get(DOMAINS.VIDEO + ENDPOINTS.LIST_VIDEOS);
    let data = res.data
    data = data.map(video => {
      return {
        ...video,
        created_at: convertUnixToTimeElapsed(video.created_at)
      }
    }
    )
    console.log(data)
    dispatch({
      type: HOMEPAGE_LOADED,
      payload: data
    });
  } catch (err) {
    console.log(err)
    dispatch({
      type: HOMEPAGE_LOAD_FAIL,
    })
  }
}

export const loadWatchVideos = (videoId) => async (dispatch) => {
  try {
    const res = await axios.get(DOMAINS.VIDEO + "/" + videoId)
    let data = res.data
    data = {
      ...data,
      created_at: convertUnixToExactDate(data.created_at)
    }
    dispatch({
      type: VIDEO_LOADED,
      payload: data
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: VIDEO_LOAD_FAILED
    })
  }
}

export const setVideoLoading = () => async (dispatch) => {
  dispatch({
    type: VIDEO_LOADING
  })
}

export const startUpload = () => async (dispatch) => {
  dispatch({
    type: UPLOAD_STARTED
  })
}

export const endUpload = () => async (dispatch) => {
  dispatch({
    type: UPLOAD_ENDED
  })
}