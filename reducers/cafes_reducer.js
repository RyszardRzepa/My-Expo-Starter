import { FETCH_CAFES_SUCCESS } from '../actions/types';

const INITIAL_STATE = {
  isLoading: true
};

export default function cafesReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CAFES_SUCCESS:
      return { ...state, cafesInfo: action.payload, isLoading: false };
    default:
      return state;
  }
}