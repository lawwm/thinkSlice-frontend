import axios from 'axios'
import * as actionTypes from './actionTypes'

import { DOMAINS, ENDPOINTS } from "../endpoints"

import setAuthToken from "../../util/setAuthToken"
import { setAlert } from "../../store/components/action"
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
            type: actionTypes.USER_LOADED
        });
    } catch (err) {
        dispatch({
            type: actionTypes.AUTH_ERROR
        });
    }
}

//Register User
export const register = ({ username, email, password }) => async (dispatch) => {
    //convert to json for post 

    const body = JSON.stringify({ username, email, password });

    try {
        dispatch({
            type: actionTypes.AUTH_BUTTON_LOADING
        })
        const res = await axios.post(DOMAINS.AUTH + ENDPOINTS.REGISTER, body, config);
        setAuthToken(res.token)
        dispatch({
            type: actionTypes.AUTH_BUTTON_LOADED
        })
        dispatch({
            type: actionTypes.REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(setAlert("Welcome to ThinkSlice", "success"))
    } catch (err) {
        dispatch({
            type: actionTypes.REGISTER_FAIL
        })
        dispatch({
            type: actionTypes.AUTH_BUTTON_LOADED
        })
        dispatch(setAlert("Failed to register", "danger"))
    }
};

//Login User
export const login = ({ username, password }) => async (dispatch) => {
    const body = JSON.stringify({ username, password });

    try {
        dispatch({
            type: actionTypes.AUTH_BUTTON_LOADING
        })
        const res = await axios.post(DOMAINS.AUTH + ENDPOINTS.LOGIN, body, config);

        setAuthToken(res.data.token)
        dispatch({
            type: actionTypes.AUTH_BUTTON_LOADED
        })
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(setAlert("Login successful", "success"))
    } catch (err) {
        dispatch({
            type: actionTypes.AUTH_BUTTON_LOADED
        })
        dispatch({
            type: actionTypes.LOGIN_FAIL
        })
        dispatch(setAlert("Login failed", "danger"))
    }
};

//Logout & clear profile
export const logout = () => async (dispatch) => {
    try {
        //const res = await axios.post('/api/auth/logout', config);
        //console.log(res)
        dispatch({ type: actionTypes.LOGOUT });
        dispatch(setAlert("See you next time!", "success"))
    } catch (err) {
        dispatch(setAlert("Failed to logout", "danger"))
    }

}