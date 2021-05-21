import axios from 'axios';

import { DOMAINS } from '../endpoints';
import { auth } from "../auth/reducer.js";
import * as actionTypes from './actionTypes';

export const getProfile = () => async (dispatch) => {
    try {
        const userId = auth.user.id;
        const res = await axios.get(DOMAINS.PROFILE + "/" + userId);

        dispatch({
            type: actionTypes.GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};