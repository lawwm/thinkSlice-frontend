import axios from 'axios';

import { DOMAINS } from '../endpoints';
import { useSelector } from "react-redux";
import * as actionTypes from './actionTypes';

const config = {
    headers: {
        "Content-Type": "application/json",
    },
};

export const getProfile = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(DOMAINS.PROFILE + "/" + userId);

        dispatch({
            type: actionTypes.GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR
        });
    }
};

export const createProfile = ({ username }) => async (dispatch) => {

    const body = JSON.stringify({ username });

    try {
        const res = await axios.post(DOMAINS.PROFILE, body, config);

        dispatch({
            type: actionTypes.CREATE_PROFILE_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: actionTypes.CREATE_PROFILE_FAIL
        });
    }
}