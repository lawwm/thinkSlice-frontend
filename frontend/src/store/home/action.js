import axios from 'axios'
import { ENDPOINTS, DOMAINS } from "../endpoints"
import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  VIDEO_LOADING,
  VIDEO_LOAD_FAILED,
  UPLOAD_STARTED,
  UPLOAD_ENDED,
  CLEAR_VIDEO_PAGE,
  REACHED_END,
  CHANGE_FILTER,
  CHANGE_ASCENDING,
  CHANGE_PAGE
} from "./actionTypes"
import { format, formatDistance } from 'date-fns'

// function chunkArray(myArray, chunk_size) {
//   let results = [];

//   while (myArray.length) {
//     results.push(myArray.splice(0, chunk_size))
//   }

//   return results
// }

// Helper functions
function convertUnixToTimeElapsed(date) {
  date = new Date(date * 1000)
  return formatDistance(
    date,
    new Date(),
    { addSuffix: true },
  )
}

function convertUnixToExactDate(date) {
  date = new Date(date * 1000)
  console.log(date)
  console.log(format(date, 'PPP'))
  return format(date, 'PPP')
}

// Actions
export const changeFilter = (filter) => async (dispatch) => {
  try {
    dispatch({
      type: CHANGE_FILTER,
      payload: filter
    })
  } catch (err) {
    console.log(err)
  }
}

export const changeAscending = (order) => async (dispatch) => {
  try {
    dispatch({
      type: CHANGE_ASCENDING,
      payload: order
    })
  } catch (err) {
    console.log(err)
  }
}

export const changePage = (page) => async (dispatch) => {
  try {
    dispatch({
      type: CHANGE_PAGE,
      payload: page
    })
  } catch (err) {
    console.log(err)
  }
}

export const clearVideos = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_VIDEO_PAGE
    })
  } catch (err) {
    console.log(err)
  }
}

export const loadHomeVideos = (filtered = "recent", ascending = false, num = 1, reachedEnd = false) => async (dispatch) => {
  try {

    //Prevent getting API when last query has been reached
    //Else set loading
    if (reachedEnd) {
      return
    }
    dispatch(setVideoLoading())

    //field manipulation
    let filterBy
    if (filtered === "recent") {
      filterBy = "created_at"
    } else {
      filterBy = "views"
    }
    let order = ascending ? "true" : "false"

    // GET video arrays
    const res = await axios.get(DOMAINS.VIDEO + ENDPOINTS.LIST_VIDEOS
      + "?n=" + num + "&filter_by=" + filterBy + "&ascending=" + order);
    let data = res.data

    //Set reached end to true if no data found
    if (data.length === 0) {
      dispatch({
        type: REACHED_END
      })
      dispatch({
        type: HOMEPAGE_LOAD_FAIL
      })
      return
    }

    //Manipulate fields
    data = data.map(video => {
      return {
        ...video,
        created_at: convertUnixToTimeElapsed(video.created_at)
      }
    })
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