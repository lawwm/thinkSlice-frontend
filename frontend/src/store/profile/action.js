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
    dispatch({
      type: actionTypes.PROFILE_LOADING,
    })
    const res = await axios.get(DOMAINS.PROFILE + "/" + userId);
    const res2 = await axios.get(DOMAINS.PROFILE + "/details/" + userId);

    dispatch({
      type: actionTypes.PROFILE_LOADED,
      payload: { basic: res.data, detailed: res2.data },
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
  try {
    console.log(profile.basic);
    console.log(profile.detailed);

    const res = await axios.patch(
      DOMAINS.PROFILE + "/" + userId,
      profile.basic
    );
    const res2 = await axios.patch(
      DOMAINS.PROFILE + "/details/" + userId,
      profile.detailed
    );

    dispatch({
      type: actionTypes.PROFILE_UPDATED,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.PROFILE_ERROR,
    });
  }
};

export const deleteProfile = (userId) => async (dispatch) => {
  axios.delete(DOMAINS.PROFILE + "/" + userId).then(
    (response) => {
      dispatch({
        type: actionTypes.PROFILE_DELETED,
      });
    },
    (err) => {
      dispatch({
        type: actionTypes.PROFILE_ERROR,
      });
    }
  );
};

export const resetProfile = () => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_RESET,
  });
};
