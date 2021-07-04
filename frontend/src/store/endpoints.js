import axios from "axios";

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost:8000";
} else if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = "https://thinkslice.herokuapp.com";
}

export const ENDPOINTS = {
  //AUTH
  LOGIN: "/login",
  REGISTER: "/register",
  LOAD_USER: "/user",
  LOGOUT: "/logout",

  //PROFILE
  PROFILE_DETAILS: "/details",

  //VIDEO
  LIST_VIDEOS: "",
  SEARCH_VIDEOS: "/search",
  LIKE_VIDEOS: "/likes",

  //REVIEWS
  TUTOR: "/tutors",
  STUDENT: "/students",
  CREATE_REVIEW: "/tutors",
  EDIT_DELETE_REVIEW: "",

  //COMMENTS
  GET_ADD_COMMENT: "/comments",
  EDIT_DELETE_COMMENT: "",
  GET_ADD_REPLY: "/replies",

  //CHAT
  ACCESS_CHAT: "/handle",
  ACCESS_CHATROOM: "/chatroom",
};

export const DOMAINS = {
  AUTH: "/api/auth",
  PROFILE: "/api/profiles",
  REVIEWS: "api/reviews",
  VIDEO: "/api/videos",
  COMMENTS: "/api/comments",
  CHAT: "/api/chat",
};
