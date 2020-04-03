import axios from "axios";
import { SET_CAMPUSES, SELECT_CAMPUS, ADD_CAMPUS } from "./constants";

// ACTION CREATORS

export const setCampuses = campuses => ({
  type: SET_CAMPUSES,
  campuses
});

export const selectCampus = campus => ({
  type: SELECT_CAMPUS,
  campus
});

export const addCampus = campus => ({
  type: ADD_CAMPUS,
  campus
});

// THUNK CREATORS

export const fetchCampuses = () => {
  return async dispatch => {
    const res = await axios.get("/api/campuses");
    dispatch(setCampuses(res.data));
  };
};

export const postCampus = campusInfo => {
  return async dispatch => {
    const res = await axios.post("/api/campuses", campusInfo);
    dispatch(addCampus(res.data));
  };
};
