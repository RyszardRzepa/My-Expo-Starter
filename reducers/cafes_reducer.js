import { FETCH_CAFES_SUCCESS, ADD_DETAILS_SCREEN_ITEM } from '../actions/types';

const INITIAL_STATE = {
  isLoading: true,
  cafesInfo: [],
  cafeDetails: {}
};

export default function cafesReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CAFES_SUCCESS:
      return { ...state, cafesInfo: action.payload, isLoading: false };
    case ADD_DETAILS_SCREEN_ITEM:
      return { ...state, cafeDetails: action.payload };
    default:
      return state;
  }
}