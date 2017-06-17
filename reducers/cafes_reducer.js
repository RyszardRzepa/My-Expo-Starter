import {
  FETCH_CAFES_SUCCESS,
  FETCH_USER_LOCATION_SUCCESS,
  ADD_DETAILS_SCREEN_ITEM,
  CALCULATE_DISTANCE_SUCCESS,
  FETCH_USER_LOCATION_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  isLoading: true,
  cafesInfo: [],
  cafeDetails: {},
  userLocation: {},
  errorUserLocation: ''
};

export default function cafesReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CAFES_SUCCESS:
      return { ...state, cafesInfo: action.payload, isLoading: false };
    case ADD_DETAILS_SCREEN_ITEM:
      return { ...state, cafeDetails: action.payload };
    case CALCULATE_DISTANCE_SUCCESS:
      return { ...state, distance: action.payload };
    case FETCH_USER_LOCATION_SUCCESS:
      return { ...state, userLocation: action.payload };
    case FETCH_USER_LOCATION_ERROR:
      return { ...state, errorUserLocation: action.payload };
    default:
      return state;
  }
}