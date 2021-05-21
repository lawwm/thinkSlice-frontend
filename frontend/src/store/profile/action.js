import axios from 'axios';

import { DOMAINS } from '../endpoints';
import * as actionTypes from './actionTypes';

const config = {
    headers: {
        "Content-Type": "application/json",
    },
};

export const getProfile = (userId) => async (dispatch) => {
    try {
        if (userId == null) throw new Error("no user in localStorage")
        const res = await axios.get(DOMAINS.PROFILE + "/" + userId);

        dispatch({
            type: actionTypes.PROFILE_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR
        });
    }
};