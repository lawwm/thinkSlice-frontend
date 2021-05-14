import axios from 'axios'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from "./type.js"

import { DOMAINS, ENDPOINTS } from "../endpoints"

import setAuthToken from "../../util/setAuthToken";

const config = {
    headers: {
        "Content-Type": "application/json",
    },
};

// Load user
export const loadUser = (token) => async (dispatch) => {
    try {
        if (token == null) throw new Error("no token in localStorage")
        const res = await axios.get(DOMAINS.AUTH + ENDPOINTS.LOAD_USER);

        dispatch({
            type: USER_LOADED
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}

//Register User
export const register = ({ username, email, password }) => async (dispatch) => {
    //convert to json for post 

    const body = JSON.stringify({ username, email, password });

    try {
        const res = await axios.post(DOMAINS.AUTH + ENDPOINTS.REGISTER, body, config);
        setAuthToken(res.token)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL
        })
    }
};

//Login User
export const login = ({ username, password }) => async (dispatch) => {
    const body = JSON.stringify({ username, password });

    try {
        const res = await axios.post(DOMAINS.AUTH + ENDPOINTS.LOGIN, body, config);

        setAuthToken(res.data.token)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
};

//Logout & clear profile
export const logout = () => async (dispatch) => {
    try {
        const res = await axios.post('/api/auth/logout', config);

        dispatch({ type: LOGOUT });
    } catch (err) {

    }

}