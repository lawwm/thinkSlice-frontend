import axios from "axios";
import * as actionTypes from "./actionTypes";

import { DOMAINS, ENDPOINTS } from "../endpoints";

import setAuthToken from "../../util/setAuthToken";
import { setAlert } from "../../store/components/action";
import { loadChats } from "../chat/action";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Load user
export const loadUser = (token) => async (dispatch) => {
  try {
    if (token == null) throw new Error("no token in localStorage");
    const res = await axios.get(DOMAINS.AUTH + ENDPOINTS.LOAD_USER);

    dispatch({
      type: actionTypes.USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.AUTH_ERROR,
    });
  }
};

//Register User
export const register =
  ({ username, email, password, confirmPassword }) =>
    async (dispatch) => {

      // Check regex
      let reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

      //Start checks
      if (confirmPassword !== password) {
        dispatch({
          type: actionTypes.REGISTER_FAIL,
        });
        dispatch({
          type: actionTypes.AUTH_BUTTON_LOADED,
        });
        dispatch(setAlert("Passwords must match", "danger"));
      } else if (!reg.test(password)) {

        dispatch({
          type: actionTypes.REGISTER_FAIL,
        });
        dispatch({
          type: actionTypes.AUTH_BUTTON_LOADED,
        });
        dispatch(setAlert("Password must contain at least 1 lowercase, uppercase, numeric, special character, and be longer than 8 characters", "danger", 10000));

      } else {
        const body = JSON.stringify({ username, email, password });

        try {
          dispatch({
            type: actionTypes.AUTH_BUTTON_LOADING,
          });
          const res = await axios.post(
            DOMAINS.AUTH + ENDPOINTS.REGISTER,
            body,
            config
          );
          setAuthToken(res.data.token);
          dispatch({
            type: actionTypes.AUTH_BUTTON_LOADED,
          });
          dispatch({
            type: actionTypes.REGISTER_SUCCESS,
            payload: res.data,
          });
          dispatch(setAlert("Welcome to ThinkSlice", "success"));
        } catch (err) {
          dispatch({
            type: actionTypes.REGISTER_FAIL,
          });
          dispatch({
            type: actionTypes.AUTH_BUTTON_LOADED,
          });
          dispatch(setAlert("Failed to register", "danger"));
        }
      }
    };

//Login User
export const login =
  ({ username, password }) =>
    async (dispatch) => {
      const body = JSON.stringify({ username, password });

      try {
        dispatch({
          type: actionTypes.AUTH_BUTTON_LOADING,
        });

        if (username === "" || password === "") {
          throw new Error("Fields cannot be empty")
        }

        const res = await axios.post(
          DOMAINS.AUTH + ENDPOINTS.LOGIN,
          body,
          config
        );

        setAuthToken(res.data.token);
        dispatch({
          type: actionTypes.AUTH_BUTTON_LOADED,
        });
        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: res.data,
        });
        dispatch(setAlert("Login successful", "success"));
        dispatch(loadChats(localStorage.getItem('user')));

      } catch (err) {
        dispatch({
          type: actionTypes.AUTH_BUTTON_LOADED,
        });
        dispatch({
          type: actionTypes.LOGIN_FAIL,
        });
        dispatch(setAlert(err.message, "danger"));
      }
    };

//Logout & clear profile
export const logout = () => async (dispatch) => {
  //const res = await axios.post('/api/auth/logout', config);
  //console.log(res)
  dispatch({ type: actionTypes.LOGOUT });
  dispatch(setAlert("See you next time!", "success"));
};
