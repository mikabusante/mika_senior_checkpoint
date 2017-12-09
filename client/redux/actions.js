import axios from 'axios';
import { SET_CAMPUSES, SELECT_CAMPUS, ADD_CAMPUS } from './constants';

export function setCampuses (campuses) {
  //your code here
  return {
    type: SET_CAMPUSES,
    campuses
  }
}

export function selectCampus (campus) {
  return {
    type: SELECT_CAMPUS,
    campus
  }
}

export function addCampus (campus) {
  //your code here
  return {
    type: ADD_CAMPUS,
    campus
  }
}

export function fetchCampuses () {
  //your code here
  return dispatch => {
    return axios.get('/api/campuses')
      .then(res => res.data)
      .then(campuses => dispatch(setCampuses(campuses)))
      .catch(console.error)
  }
}

export function postCampus (campus) {
  //your code here
  return dispatch => {
    return axios.post('/api/campuses', campus)
      .then(res => res.data)
      .then(newCampus => dispatch(addCampus(newCampus)))
      .catch(console.error)
  }
}
