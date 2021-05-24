import axios from "axios";

import { DOMAINS } from "../endpoints";
import * as actionTypes from "./actionTypes";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getProfile = (userId) => async (dispatch) => {
  try {
    if (userId == null) throw new Error("no user in localStorage");
    const res = await axios.get(DOMAINS.PROFILE + "/" + userId);
    const res2 = await axios.get(DOMAINS.PROFILE + "/details/" + userId);

    console.log(res.data);
    console.log(res2.data);

    dispatch({
      type: actionTypes.PROFILE_LOADED,
      payload: { ...res.data, ...res2.data },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
    });
  }
};

export const toggleDetailedView = (boolean) => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_DETAILED_VIEW,
    payload: boolean,
  });
};

export const toggleEditMode = (boolean) => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_EDIT_MODE,
    payload: boolean,
  });
};

export const updateProfile = (userId, profile) => async (dispatch) => {

  const body = JSON.stringify(profile);

  try {
    const res = await axios.patch(DOMAINS.PROFILE + "/" + userId, body, config);
    const res2 = await axios.patch(DOMAINS.PROFILE + "/details/" + userId, body, config);

    dispatch({
      type: actionTypes.PROFILE_UPDATED,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
    });
  }
};

export const deleteProfile = (userId) => async (dispatch) => {
  try {
    if (userId == null) throw new Error("no user in localStorage");
    const res = await axios.delete(DOMAINS.PROFILE + "/" + userId);

    dispatch({
      type: actionTypes.PROFILE_DELETED,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
    });
  }
};

export const resetProfile = () => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_RESET,
  });
};
