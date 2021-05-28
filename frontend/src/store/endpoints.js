import axios from "axios"

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

    //VIDEO
    LIST_VIDEOS: ''
}

export const DOMAINS = {
    AUTH: "/api/auth",
    PROFILE: "/api/profiles",
    REVIEWS: "api/reviews",
    VIDEO: "/api/videos"
}