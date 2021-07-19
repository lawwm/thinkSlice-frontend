import { isEmpty } from "lodash"
import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  HOME_UNFILTER_CURRENT,
  VIDEO_LOADING,
  UPLOAD_STARTED,
  UPLOAD_ENDED,
  REACHED_END,
  CHANGE_FILTER,
  CHANGE_ASCENDING,
  CHANGE_PAGE,
  CHANGE_AVAILABLE,
  CHANGE_SUBJECT,
  CHANGE_LOCATION,
  CHANGE_REVIEW,
  SEARCH_VIDEO,
  CLEAR_SEARCH_VIDEO,
  CLEAR_VIDEO_PAGE,
  HOME_LOADING,
  COMMENT_LOADING,
  COMMENT_LOADED,
  SET_COMMENT_LOADING_ID,
  REMOVE_COMMENT_LOADING_ID,
  GET_COMMENTS,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  GET_REPLIES,
  CREATE_REPLIES,
  EDIT_REPLIES,
  DELETE_REPLIES,
  SET_COMMENTREPLY_LOADING_ID,
  REMOVE_COMMENTREPLY_LOADING_ID,
  SET_REPLY_LOADING_ID,
  REMOVE_REPLY_LOADING_ID,
  ADD_LIKE,
  REMOVE_LIKE,
} from "./actionTypes.js"

const initialState = {
  videos: [],
  homeLoading: true,
  videoLoading: true,
  commentLoading: true,
  commentLoadingId: [],
  commentReplyLoadingId: [],
  replyLoadingId: [],
  currentVideo: {},
  isUploading: false,
  reachedEnd: false,
  filterBy: "recent",
  ascending: false,
  page: 1,
  subject: '',
  location: '',
  availability: '',
  review: '',
  searchQuery: '',
  firstLoad: true,
  removedVideoIndex: -1,
  comments: [],
}
//set initial page to zero so initial loadhomevideo action before 
//bottom div is observed is negated 

export const home = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case HOMEPAGE_LOADED:
      let payloadId = payload.map(video => video.id)
      //Remove accidental repeating videos if any
      let newVideos = state.videos.filter(val => !payloadId.includes(val.id))
      newVideos = newVideos.concat(payload)
      //Remove current video if any
      let newRemovedVideoIndex = -1;
      if (!isEmpty(state.currentVideo)) {
        newRemovedVideoIndex = newVideos.findIndex(video => video.id === state.currentVideo.id)
        newVideos = newVideos.filter(video => video.id !== state.currentVideo.id)
      }
      return {
        ...state,
        videos: newVideos,
        homeLoading: false,
        firstLoad: false,
        removedVideoIndex: newRemovedVideoIndex
      }
    case SEARCH_VIDEO:
      return {
        ...state,
        searchQuery: payload,
        videos: [],
        reachedEnd: false,
        page: 1
      }
    case CLEAR_SEARCH_VIDEO:
      return {
        ...state,
        searchQuery: '',
        videos: [],
        reachedEnd: false,
        page: 1,
        firstLoad: true,
        currentVideo: {}
      }
    case CLEAR_VIDEO_PAGE:
      return {
        ...state,
        videos: [],
      }
    case VIDEO_LOADED:
      // Remove current video from video array when leaving current video
      let newVideoArray = [...state.videos]
      let anotherRemovedVideoIndex = -1
      anotherRemovedVideoIndex = newVideoArray.findIndex(video => video.id === payload.id)
      newVideoArray = newVideoArray.filter(video => video.id !== payload.id)
      return {
        ...state,
        currentVideo: payload,
        videos: newVideoArray,
        videoLoading: false,
        removedVideoIndex: anotherRemovedVideoIndex
      }
    case HOME_UNFILTER_CURRENT:
      // Refill video array with current video when leaving current video
      let refilledVideoArray = [...state.videos]
      if (!isEmpty(state.currentVideo)) {
        refilledVideoArray.splice(state.removedVideoIndex, 0, state.currentVideo)
      }
      return {
        ...state,
        currentVideo: {},
        videos: refilledVideoArray,
        videoLoading: true,
        removedVideoIndex: -1
      }
    case VIDEO_LOADING:
      return {
        ...state,
        videoLoading: true
      }
    case HOME_LOADING:
      return {
        ...state,
        homeLoading: true
      }
    case HOMEPAGE_LOAD_FAIL:
      return {
        ...state,
        homeLoading: false
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
        page: 1
      }
    case CHANGE_ASCENDING:
      return {
        ...state,
        ascending: payload,
        videos: [],
        reachedEnd: false,
        page: 1
      }
    case CHANGE_PAGE:
      return {
        ...state,
        page: state.page + 1
      }
    case CHANGE_AVAILABLE:
      return {
        ...state,
        availability: payload,
        videos: [],
        reachedEnd: false,
        page: 1,
      }
    case CHANGE_SUBJECT:
      return {
        ...state,
        subject: payload,
        videos: [],
        reachedEnd: false,
        page: 1,
      }
    case CHANGE_LOCATION:
      return {
        ...state,
        location: payload,
        videos: [],
        reachedEnd: false,
        page: 1,
      }
    case ADD_LIKE:
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          hasUserLiked: !state.currentVideo.hasUserLiked,
          likes: state.currentVideo.likes + 1
        }
      }
    case REMOVE_LIKE:
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          hasUserLiked: !state.currentVideo.hasUserLiked,
          likes: state.currentVideo.likes - 1
        }
      }
    case CHANGE_REVIEW:
      return {
        ...state,
        review: payload,
        videos: [],
        reachedEnd: false,
        page: 1,
      }
    case COMMENT_LOADING:
      return {
        ...state,
        commentLoading: true
      }
    case COMMENT_LOADED:
      return {
        ...state,
        commentLoading: false
      }
    case GET_COMMENTS:
      return {
        ...state,
        commentLoading: false,
        comments: payload.map(comment => {
          return {
            ...comment,
            replies: []
          }
        })
      }
    case ADD_COMMENT:
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          num_of_comments: state.currentVideo.num_of_comments + 1
        },
        comments: state.comments.concat([{ ...payload, replies: [] }]),
        commentLoading: false
      }
    case SET_COMMENT_LOADING_ID:
      return {
        ...state,
        commentLoadingId: state.commentLoadingId.concat([payload])
      }
    case REMOVE_COMMENT_LOADING_ID:
      return {
        ...state,
        commentLoadingId: state.commentLoadingId.filter(loadingId => loadingId !== payload)
      }
    case EDIT_COMMENT:
      const { id, data } = payload
      const commentIndex = state.comments.findIndex(comment => comment.id === id)
      const newCommentArray = [...state.comments]
      newCommentArray[commentIndex] = {
        ...data,
        username: state.comments[commentIndex].username,
        profilePic: state.comments[commentIndex].profilePic,
        userId: state.comments[commentIndex].userId,
        replies: state.comments[commentIndex].replies
      }
      return {
        ...state,
        comments: newCommentArray,
        commentLoadingId: state.commentLoadingId.filter(loadingId => loadingId !== id)
      }
    case DELETE_COMMENT:
      const comment = state.comments.filter(comment => comment.id === payload)
      const replyNum = comment[0].replies.length
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          num_of_comments: state.currentVideo.num_of_comments - 1 - replyNum
        },
        comments: state.comments.filter(comment => comment.id !== payload),
        commentLoadingId: state.commentLoadingId.filter(loadingId => loadingId !== payload)
      }
    case SET_COMMENTREPLY_LOADING_ID:
      return {
        ...state,
        commentReplyLoadingId: state.commentReplyLoadingId.concat([payload])
      }
    case SET_REPLY_LOADING_ID:
      return {
        ...state,
        replyLoadingId: state.replyLoadingId.concat([payload])
      }
    case REMOVE_COMMENTREPLY_LOADING_ID:
      return {
        ...state,
        commentReplyLoadingId: state.commentReplyLoadingId.filter(loadingId => loadingId !== payload)
      }
    case REMOVE_REPLY_LOADING_ID:
      return {
        ...state,
        replyLoadingId: state.replyLoadingId.filter(loadingId => loadingId !== payload)
      }
    case GET_REPLIES:
      const findComment = state.comments.findIndex(comment => comment.id === payload.id)
      const newComment = [...state.comments]
      // console.log(payload.data)
      // console.log(newComment[findComment])
      newComment[findComment] = {
        ...newComment[findComment],
        replies: payload.data
      }
      return {
        ...state,
        comments: newComment,
        commentReplyLoadingId: state.commentReplyLoadingId.filter(loadingId => loadingId !== payload.id)
      }
    case CREATE_REPLIES:
      const createCommentIndex = state.comments.findIndex(comment => comment.id === payload.id)
      const commentArray = [...state.comments]
      commentArray[createCommentIndex] = {
        ...commentArray[createCommentIndex],
        has_replies: true,
        replies: [payload.data].concat(commentArray[createCommentIndex].replies)
      }
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          num_of_comments: state.currentVideo.num_of_comments + 1
        },
        comments: commentArray,
        commentLoadingId: state.commentLoadingId.filter(loadingId => loadingId !== payload.id)
      }
    case EDIT_REPLIES:
      const commentIndexEdit = state.comments.findIndex(comment => comment.id === payload.commentId)
      const replyIndexEdit = state.comments[commentIndexEdit].replies.findIndex(reply => reply.id === payload.replyId)
      const newReplyArrayEdit = [...state.comments[commentIndexEdit].replies]
      const newCommentArrayEdit = [...state.comments]
      newReplyArrayEdit[replyIndexEdit] = {
        ...payload.data,
        username: state.comments[commentIndexEdit].replies[replyIndexEdit].username,
        profilePic: state.comments[commentIndexEdit].replies[replyIndexEdit].profilePic,
        userId: state.comments[commentIndexEdit].replies[replyIndexEdit].userId,
      }
      newCommentArrayEdit[commentIndexEdit] = {
        ...newCommentArrayEdit[commentIndexEdit],
        replies: newReplyArrayEdit
      }
      return {
        ...state,
        comments: newCommentArrayEdit,
        replyLoadingId: state.replyLoadingId.filter(loadingId => loadingId !== payload.replyId)
      }
    case DELETE_REPLIES:
      // Create new array of comments
      const newCommentArrayDelete = [...state.comments]
      // Find index of comment where reply is deleted from
      const commentIndexDelete = state.comments.findIndex(comment => comment.id === payload.commentId)
      // Remove the reply from the reply array within the comment
      newCommentArrayDelete[commentIndexDelete].replies = newCommentArrayDelete[commentIndexDelete].replies.filter(reply => reply.id !== payload.replyId)
      // Check if there is any replies remaining in comment, if none then set hasReplies to false
      if (newCommentArrayDelete[commentIndexDelete].replies.length === 0) {
        newCommentArrayDelete[commentIndexDelete].has_replies = false
      }
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          num_of_comments: state.currentVideo.num_of_comments - 1
        },
        comments: newCommentArrayDelete,
        replyLoadingId: state.replyLoadingId.filter(loadingId => loadingId !== payload.replyId)
      }
    default:
      return state;
  }
}