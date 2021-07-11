import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    AUTH_BUTTON_LOADED,
    AUTH_BUTTON_LOADING
} from "./actionTypes.js";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    username: null,
    authLoading: false
}

export const auth = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: localStorage.getItem('user'),
                username: localStorage.getItem('username')
            }
        case REGISTER_SUCCESS:
            localStorage.setItem('user', payload.user.id);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
                user: payload.user.id,
                username: payload.user.username
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('user', payload.user.id);
            localStorage.setItem('username', payload.user.username);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
                user: payload.user.id,
                username: payload.user.username
            }
        case AUTH_BUTTON_LOADING:
            return {
                ...state,
                authLoading: true
            }
        case AUTH_BUTTON_LOADED:
            return {
                ...state,
                authLoading: false
            }
        case LOGOUT:
        case AUTH_ERROR:
        case REGISTER_FAIL:
        case LOGIN_FAIL:
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            localStorage.removeItem('activeChat');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                username: null
            }
        default:
            return state;
    }
}