import { SET_CAMPUSES, SELECT_CAMPUS, ADD_CAMPUS } from "./constants";

const initialState = {
  campuses: [],
  selectedCampus: {},
  students: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CAMPUSES:
      return { ...state, campuses: action.campuses };
    case SELECT_CAMPUS:
      return { ...state, selectedCampus: action.campus };
    case ADD_CAMPUS:
      return { ...state, campuses: [...state.campuses, action.campus] };
    default:
      return state;
  }
};
