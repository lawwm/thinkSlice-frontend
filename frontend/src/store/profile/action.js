import axios from 'axios';

import { DOMAINS } from '../endpoints';
import * as actionTypes from './actionTypes';

export const getProfile = (userId) => async (dispatch) => {
    try {
        if (userId == null) throw new Error("no user in localStorage")
        const res = await axios.get(DOMAINS.PROFILE + "/" + userId);
        const res2 = await axios.get(DOMAINS.PROFILE + "/details/" + userId);

        dispatch({
            type: actionTypes.PROFILE_LOADED,
            payload: {...res.data, ...res2.data}
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR
        });
    }
};

export const updateProfile = (userId) => async(dispatch) => {

}

export const deleteProfile = (userId) => async(dispatch) => {
    try {
        if (userId == null) throw new Error("no user in localStorage")
        const res = await axios.delete(DOMAINS.PROFILE + "/" + userId);
        
        dispatch({
            type: actionTypes.PROFILE_DELETED
        });
    } catch (err) {
        dispatch({
            type: actionTypes.PROFILE_ERROR
        });
    }
}

export const resetProfile = () => async(dispatch) => {
    dispatch({
        type: actionTypes.PROFILE_RESET
    });
}