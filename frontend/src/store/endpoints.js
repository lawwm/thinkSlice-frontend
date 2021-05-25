import axios from "axios"

axios.defaults.baseURL = "http://localhost:8000";

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
    VIDEO: "/api/videos"
}