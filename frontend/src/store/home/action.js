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
  CHANGE_PAGE,
  COMMENT_LOADING,
  COMMENT_LOADED,
  GET_COMMENTS,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  SET_COMMENT_LOADING_ID,
  REMOVE_COMMENT_LOADING_ID,
  GET_REPLIES,
  CREATE_REPLIES,
  EDIT_REPLIES,
  DELETE_REPLIES,
  SET_COMMENTREPLY_LOADING_ID,
  SET_REPLY_LOADING_ID,
  REMOVE_COMMENTREPLY_LOADING_ID,
  REMOVE_REPLY_LOADING_ID
} from "./actionTypes"
import { format, formatDistance } from 'date-fns'
import { setAlert } from '../components/action';

// function chunkArray(myArray, chunk_size) {
//   let results = [];

//   while (myArray.length) {
//     results.push(myArray.splice(0, chunk_size))
//   }

//   return results
// }

// Helper functions
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

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
    //zero and below are invalid queries
    if (num <= 0) {
      return
    }

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
    // console.log(data)

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

export const commentsLoading = () => async (dispatch) => {
  dispatch({
    type: COMMENT_LOADING
  })
}

export const commentsLoaded = () => async (dispatch) => {
  dispatch({
    type: COMMENT_LOADED
  })
}

export const getComments = (videoId) => async (dispatch) => {
  try {
    //Prevent getting API when last query has been reached
    //Else set loading
    if (videoId === undefined) {
      throw new Error("No video id is provided.")
    }

    // GET video arrays
    const res = await axios.get(DOMAINS.VIDEO + ENDPOINTS.GET_ADD_COMMENT + '/' + videoId)

    let comments = res.data

    console.log(comments)
    dispatch({
      type: GET_COMMENTS,
      payload: comments
    });
  } catch (err) {
    console.log(err)
    // dispatch({
    //   type: HOMEPAGE_LOAD_FAIL,
    // })
  }
}

export const addComments = ({ comment }, videoId, closeCommentForm, emptyCommentForm) => async (dispatch) => {
  try {
    dispatch(commentsLoading())
    if (comment === '') {
      throw new Error('Comment field cannot be empty')
    }

    if (comment === undefined || videoId === undefined) {
      throw new Error("Error, no comment or videoId found")
    }

    const body = JSON.stringify({
      "comment_text": comment
    })

    const res = await axios.post(DOMAINS.VIDEO + ENDPOINTS.GET_ADD_COMMENT + '/' + videoId,
      body,
      config)

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    })
    dispatch(setAlert("Comment successfully added!", "success"));
    closeCommentForm()
    emptyCommentForm()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch(commentsLoaded())
  }
}

export const editComments = (comment, commentId, closeFormFunction) => async (dispatch) => {
  try {
    dispatch({
      type: SET_COMMENT_LOADING_ID,
      payload: commentId
    })
    if (comment === '') {
      throw new Error('Comment field cannot be empty')
    }

    if (comment === undefined || commentId === undefined) {
      throw new Error("Error, no comment or comment Id found")
    }

    const body = JSON.stringify({
      "comment_text": comment
    })

    const res = await axios.patch(DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/' + commentId,
      body,
      config)
    dispatch({
      type: EDIT_COMMENT,
      payload: {
        id: commentId,
        data: res.data,
      }
    })
    dispatch(setAlert("Comment successfully edited!", "success"));
    closeFormFunction()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: REMOVE_COMMENT_LOADING_ID,
      payload: commentId
    })
    closeFormFunction()
  }
}

export const deleteComments = (commentId) => async (dispatch) => {
  try {
    dispatch({
      type: SET_COMMENT_LOADING_ID,
      payload: commentId
    })


    if (commentId === undefined) {
      throw new Error("Error, no comment Id found")
    }

    await axios.delete(DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/' + commentId,
      config)

    dispatch({
      type: DELETE_COMMENT,
      payload: commentId
    })
    dispatch(setAlert("Comment successfully deleted!", "success"));
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: REMOVE_COMMENT_LOADING_ID,
      payload: commentId
    })
  }
}

export const getReplies = (commentId) => async (dispatch) => {
  try {
    dispatch({
      type: SET_COMMENTREPLY_LOADING_ID,
      payload: commentId
    })

    if (commentId === undefined) {
      throw new Error("Error, no comment Id found")
    }

    const res = await axios.get(DOMAINS.COMMENTS + ENDPOINTS.GET_ADD_REPLY + '/' + commentId,
      config)

    console.log(res.data)
    dispatch({
      type: GET_REPLIES,
      payload: {
        id: commentId,
        data: res.data,
      }
    })
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: REMOVE_COMMENTREPLY_LOADING_ID,
      payload: commentId
    })
  }
}

export const postReply = ({ reply }, commentId, closeReplyForm) => async (dispatch) => {
  try {
    dispatch({
      type: SET_COMMENT_LOADING_ID,
      payload: commentId
    })
    if (reply === '') {
      throw new Error('Reply field cannot be empty')
    }

    if (reply === undefined || commentId === undefined) {
      throw new Error("Error, no reply or comment Id found")
    }

    const body = JSON.stringify({
      "comment_text": reply
    })

    console.log(body)

    const res = await axios.post(DOMAINS.COMMENTS + ENDPOINTS.GET_ADD_REPLY + '/' + commentId,
      body,
      config)

    dispatch({
      type: CREATE_REPLIES,
      payload: {
        data: res.data,
        id: commentId
      }
    })
    dispatch(setAlert("Reply successfully created!", "success"));
    closeReplyForm()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: REMOVE_COMMENT_LOADING_ID,
      payload: commentId
    })
  }
}

export const editReply = (reply, replyId, commentId, closeFormFunction) => async (dispatch) => {
  try {
    dispatch({
      type: SET_REPLY_LOADING_ID,
      payload: replyId
    })
    if (reply === '') {
      throw new Error('Comment field cannot be empty')
    }

    if (reply === undefined || replyId === undefined || commentId === undefined) {
      throw new Error("Error, no comment, comment id or reply id found")
    }

    const body = JSON.stringify({
      "comment_text": reply
    })

    const res = await axios.patch(DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/' + replyId,
      body,
      config)

    console.log(res.data)
    dispatch({
      type: EDIT_REPLIES,
      payload: {
        commentId: commentId,
        replyId: replyId,
        data: res.data,
      }
    })
    dispatch(setAlert("Reply successfully edited!", "success"));
    closeFormFunction()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: REMOVE_REPLY_LOADING_ID,
      payload: replyId
    })
    closeFormFunction()
  }
}

export const deleteReply = (replyId, commentId, closeFormFunction) => async (dispatch) => {
  try {
    dispatch({
      type: SET_REPLY_LOADING_ID,
      payload: replyId
    })


    if (replyId === undefined) {
      throw new Error("Error, no reply Id found")
    }

    await axios.delete(DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/' + replyId,
      config)

    dispatch({
      type: DELETE_REPLIES,
      payload: {
        replyId: replyId,
        commentId: commentId
      }
    })
    dispatch(setAlert("Reply successfully deleted!", "success"));
    closeFormFunction()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: REMOVE_REPLY_LOADING_ID,
      payload: replyId
    })
    closeFormFunction()

  }
}