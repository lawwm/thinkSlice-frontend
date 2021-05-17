import axios from 'axios'
import * as actionTypes from './actionTypes'

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
        const res = await axios.post(DOMAINS.AUTH + ENDPOINTS.REGISTER, body, config);
        setAuthToken(res.token)
        dispatch({
            type: actionTypes.REGISTER_SUCCESS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: actionTypes.REGISTER_FAIL
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
            type: actionTypes.LOGIN_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: actionTypes.LOGIN_FAIL
        })
    }
};

//Logout & clear profile
export const logout = () => async (dispatch) => {
    try {
        //const res = await axios.post('/api/auth/logout', config);
        //console.log(res)
        dispatch({ type: actionTypes.LOGOUT });
    } catch (err) {

    }

}