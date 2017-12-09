import { SET_CAMPUSES, SELECT_CAMPUS, ADD_CAMPUS } from './constants';

const initialState = {
  campuses: [],
  selectedCampus: {}
};

export default (state = initialState, action) => {
  //your code here

  switch (action.type) {
    case SET_CAMPUSES:
      return Object.assign({}, state, {campuses: action.campuses})
    case SELECT_CAMPUS:
      return Object.assign({}, state, {selectedCampus: action.campus})
    case ADD_CAMPUS:
      return Object.assign({}, state, {
        campuses: [...state.campuses, action.campus]
      })
    default:
      return state;
  }
};
