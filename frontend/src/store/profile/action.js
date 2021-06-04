import axios from "axios";
// import { logout } from "../auth/action";
import { setAlert } from "../components/action";

import { DOMAINS, ENDPOINTS } from "../endpoints";
import * as actionTypes from "./actionTypes";
import { formatDistance } from 'date-fns'

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

//Helper function
function convertUnixToTimeElapsed(date) {
  date = new Date(date * 1000)
  return formatDistance(
    date,
    new Date(),
    { addSuffix: true },
  )
}

export const loadProfileComponent = () => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_COMPONENT_LOADING
  })
}

export const profileComponentLoaded = () => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_COMPONENT_LOADED
  })
}

export const getProfile = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.PROFILE_LOADING,
    });
    const res = await axios.get(DOMAINS.PROFILE + "/" + userId);
    const res2 = await axios.get(DOMAINS.PROFILE + "/details/" + userId);
    const basicRes = {
      ...res.data,
      video: res.data.video.map(video => {
        return {
          ...video,
          created_at: convertUnixToTimeElapsed(video.created_at)
        }
      })
    }

    dispatch({
      type: actionTypes.PROFILE_LOADED,
      payload: { basic: basicRes, detailed: res2.data },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
    });
  }
};

export const deleteVideo = (videoId, closeModalFunction, stopLoading) => async (dispatch) => {
  try {
    if (videoId === null) {
      throw new Error("No video id provided")
    }
    await axios.delete(DOMAINS.VIDEO + "/" + videoId);
    dispatch({
      type: actionTypes.PROFILE_DELETE_VIDEO,
      payload: videoId
    })
    dispatch(setAlert("Video has successfully been deleted", "success"));
    closeModalFunction()
    stopLoading()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    closeModalFunction()
    stopLoading()
  }
}

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

export const changePicture = (imageFile, closeModalFunction) => async (dispatch) => {
  try {
    dispatch(loadProfileComponent())
    if (imageFile === null) {
      return new Error("There is no image selected")
    }
    let formData = new FormData();
    formData.append("profile_pic", imageFile, imageFile.name);
    const res = await axios.post("/api/profiles/" + localStorage.user, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: actionTypes.PROFILE_PIC_EDIT,
      payload: res.data.profile_pic,
    });
    dispatch(setAlert("Image changed successfully", "success"));
    dispatch(profileComponentLoaded())
    closeModalFunction()
  } catch (err) {
    dispatch(setAlert("Profile update failed, please try again", "danger"));
    dispatch(profileComponentLoaded())
  }
}

export const updateProfile = (userId, profile) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.PROFILE_LOADING,
    });
    console.log(profile);
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
      payload: { basic: res.data, detailed: res2.data },
    });
    dispatch(setAlert("Profile updated", "success"));
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.PROFILE_UPDATE_ERROR,
    });
    dispatch(setAlert("Profile update failed, please try again", "danger"));
  }
};

export const deleteProfile = (userId) => async (dispatch) => {
  axios.delete(DOMAINS.PROFILE + "/" + userId).then(
    (response) => {
      dispatch({
        type: actionTypes.PROFILE_DELETED,
      });
      dispatch(setAlert("Account deleted", "success"));
    },
    (err) => {
      dispatch({
        type: actionTypes.PROFILE_ERROR,
      });
      dispatch(setAlert("Account deletion failed, please try again", "danger"));
    }
  );
};

export const resetProfile = () => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_RESET,
  });
};

export const setReviewLoading = () => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_REVIEW_LOADING,
  })
}

export const stopReviewLoading = () => async (dispatch) => {
  dispatch({
    type: actionTypes.STOP_REVIEW_LOADING,
  })
}

export const getReviews = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.PROFILE_LOADING,
    });
    const res = await axios.get(DOMAINS.REVIEWS + "/tutors/" + userId);
    const res2 = await axios.get(DOMAINS.REVIEWS + "/students/" + userId);
    // console.log(res.data)
    // console.log(res2.data)
    dispatch({
      type: actionTypes.REVIEWS_LOADED,
      payload: { reviewsGiven: res2.data, reviewsReceived: res.data },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.REVIEWS_ERROR,
    });
  }
}

export const createReviews = ({ review_title, review_essay, star_rating, tutorId }, closeModalFunction, clearFormData) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SET_REVIEW_LOADING,
    })
    if (review_title === "" || review_essay === "" || star_rating === 0) {
      throw new Error("Fields are empty!")
    }
    const body = JSON.stringify({ review_title, review_essay, star_rating })

    const res = await axios.post(DOMAINS.REVIEWS + ENDPOINTS.CREATE_REVIEW + '/' + tutorId,
      body,
      config)
    dispatch({
      type: actionTypes.CREATE_REVIEW,
      payload: res.data
    });
    dispatch(setAlert("Review has successfully been created", "success"));
    closeModalFunction()
    clearFormData()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: actionTypes.STOP_REVIEW_LOADING,
    })
  }
}

export const editReviews = ({ review_title, review_essay, star_rating, reviewId }, closeModalFunction) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SET_REVIEW_POST_LOADING,
    })
    if (review_title === "" || review_essay === "" || star_rating === 0) {
      throw new Error("Fields are empty!")
    }
    const body = JSON.stringify({ review_title, review_essay, star_rating })
    const res = await axios.patch(DOMAINS.REVIEWS + ENDPOINTS.EDIT_DELETE_REVIEW + '/' + reviewId,
      body,
      config)
    dispatch({
      type: actionTypes.EDIT_REVIEW,
      payload: {
        id: res.data.id,
        updatedData: res.data
      }
    });
    closeModalFunction()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: actionTypes.STOP_REVIEW_POST_LOADING,
    })
  }
}

export const deleteReviews = (reviewId, closeModalFunction) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SET_REVIEW_POST_LOADING,
    })
    await axios.delete(DOMAINS.REVIEWS + ENDPOINTS.EDIT_DELETE_REVIEW + '/' + reviewId,
      config)
    dispatch({
      type: actionTypes.DELETE_REVIEW,
      payload: reviewId
    });
    closeModalFunction()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: actionTypes.STOP_REVIEW_POST_LOADING,
    })
  }
}