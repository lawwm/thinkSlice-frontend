import axios from "axios";
// import { logout } from "../auth/action";
import { setAlert } from "../components/action";

import { DOMAINS, ENDPOINTS } from "../endpoints";
import * as actionTypes from "./actionTypes";
import { formatDistance } from 'date-fns'
import { CustomError } from "../../util/errorClasses";

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

export const editVideo = (videoId, videoData, closeModalFunction, stopLoading) => async (dispatch) => {
  try {
    if (videoId === undefined || videoId === "" || videoData === undefined) {
      throw new Error("No video id provided")
    }

    const { video_title, subject, video_description } = videoData
    const body = JSON.stringify({ video_title, subject, video_description })
    const res = await axios.patch(DOMAINS.VIDEO + "/" + videoId, body, config)

    dispatch({
      type: actionTypes.PROFILE_EDIT_VIDEO,
      payload: res.data
    })
    // console.log(videoId)
    dispatch(setAlert("Video has been successfully edited", "success"));
    closeModalFunction()
    stopLoading()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    closeModalFunction()
    stopLoading()
  }
}

export const deleteVideo = (videoId, closeModalFunction, stopLoading) => async (dispatch) => {
  try {
    if (videoId === undefined || videoId === "") {
      throw new Error("No video id provided")
    }
    // console.log("inside delete action")
    await axios.delete(DOMAINS.VIDEO + "/" + videoId);
    dispatch({
      type: actionTypes.PROFILE_DELETE_VIDEO,
      payload: videoId
    })
    // console.log(videoId)
    dispatch(setAlert("Video has been successfully deleted", "success"));
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

    if (imageFile === undefined) {
      throw new Error("There is no image selected")
    }

    if (imageFile.size > 100000) {
      // console.log("shit's fucked")
      throw new Error("Image size should be less than 100kb")
    }

    let formData = new FormData();
    formData.append("profile_pic", imageFile, imageFile.name);
    const res = await axios.post(DOMAINS.PROFILE + '/' + localStorage.getItem('user'), formData, {
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
    dispatch(setAlert(err.message, "danger"));
    dispatch(profileComponentLoaded())
  }
}

export const updateProfile = (userId, profile) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.PROFILE_LOADING,
    });
    // console.log(profile);
    const res = await axios.patch(
      DOMAINS.PROFILE + "/" + userId,
      profile.basic
    );
    const res2 = await axios.patch(
      DOMAINS.PROFILE + ENDPOINTS.PROFILE_DETAILS + "/" + userId,
      profile.detailed
    );

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
      type: actionTypes.PROFILE_UPDATED,
      payload: { basic: basicRes, detailed: res2.data },
    });
    dispatch(setAlert("Profile updated", "success"));
  } catch (err) {
    // console.log(err);
    dispatch({
      type: actionTypes.PROFILE_UPDATE_ERROR,
    });
    dispatch(setAlert("Profile update failed, please try again", "danger"));
  }
};

export const deleteProfile = (userId) => async (dispatch) => {
  try {
    await axios.delete(DOMAINS.PROFILE + "/" + userId)
    dispatch({
      type: actionTypes.PROFILE_DELETED,
    });
    dispatch(setAlert("Account deleted", "success"));
  } catch (err) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
    });
    dispatch(setAlert("Account deletion failed, please try again", "danger"));
  }
};

export const resetProfile = () => async (dispatch) => {
  dispatch({
    type: actionTypes.PROFILE_RESET,
  });
};

export const profileLikedVideos = (id, loading) => async (dispatch) => {
  try {
    const res = await axios.get(DOMAINS.VIDEO + ENDPOINTS.LIKE_VIDEOS + '/' + id)
    const resData = res.data.map(data => data.videoDetails)
    const resDataTime = resData.map(data => {
      return {
        ...data,
        created_at: convertUnixToTimeElapsed(data.created_at)
      }
    })
    dispatch({
      type: actionTypes.PROFILE_LIKED,
      payload: resDataTime
    })
    loading()
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
  }
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
      type: actionTypes.SET_REVIEW_LOADING,
    });
    const res = await axios.get(DOMAINS.REVIEWS + "/tutors/" + userId);
    const res2 = await axios.get(DOMAINS.REVIEWS + "/students/" + userId);
    // console.log(res.data)
    // console.log(res2.data)
    dispatch({
      type: actionTypes.REVIEWS_LOADED,
      payload: { reviewsGiven: res2.data, reviewsReceived: res.data, reviewUser: userId },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.REVIEWS_ERROR,
    });
  }
}

export const createReviews = ({ review_title, review_subject, review_essay, star_rating, tutorId }, closeModalFunction, clearFormData) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SET_REVIEW_LOADING,
    })
    if (star_rating === 0) {
      throw new CustomError("Please give a star rating.")
    }
    if (review_title === "") {
      throw new CustomError("Please give a title to your review.")
    }
    if (review_subject.length === 0) {
      throw new CustomError("Please state which subject(s) you studied under this tutor.")
    }
    if (review_essay === "") {
      throw new CustomError("Please give a description to your review.")
    }
    const body = JSON.stringify({ review_title, review_subject, review_essay, star_rating })
    console.log(body)

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
    dispatch(setAlert(err.response.data, "danger"));
    dispatch({
      type: actionTypes.STOP_REVIEW_LOADING,
    })
  }
}

export const editReviews = ({ review_title, review_subject, review_essay, star_rating, reviewId }, closeModalFunction) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SET_REVIEW_POST_LOADING,
    })
    if (star_rating === 0) {
      throw new CustomError("Please give a star rating.")
    }
    if (review_title === "") {
      throw new CustomError("Please give a title to your review.")
    }
    if (review_subject.length === 0) {
      throw new CustomError("Please state which subject(s) you studied under this tutor.")
    }
    if (review_essay === "") {
      throw new CustomError("Please give a description to your review.")
    }
    const body = JSON.stringify({ review_title, review_subject, review_essay, star_rating })
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