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
  CHANGE_PAGE,
  CHANGE_AVAILABLE,
  CHANGE_SUBJECT,
  CHANGE_LOCATION,
  CHANGE_REVIEW,
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
  REMOVE_REPLY_LOADING_ID
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
  comments: [],
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
        homeLoading: false
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
        page: 1
      }
    case CHANGE_SUBJECT:
      return {
        ...state,
        subject: payload,
        videos: [],
        reachedEnd: false,
        page: 1
      }
    case CHANGE_LOCATION:
      return {
        ...state,
        location: payload,
        videos: [],
        reachedEnd: false,
        page: 1
      }
    case CHANGE_REVIEW:
      return {
        ...state,
        review: payload,
        videos: [],
        reachedEnd: false,
        page: 1
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
      return {
        ...state,
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
      const newCommentArrayDelete = [...state.comments]
      const commentIndexDelete = state.comments.findIndex(comment => comment.id === payload.commentId)
      newCommentArrayDelete[commentIndexDelete].replies = newCommentArrayDelete[commentIndexDelete].replies.filter(reply => reply.id !== payload.replyId)
      return {
        ...state,
        comments: newCommentArrayDelete,
        replyLoadingId: state.replyLoadingId.filter(loadingId => loadingId !== payload.replyId)
      }
    default:
      return state;
  }
}