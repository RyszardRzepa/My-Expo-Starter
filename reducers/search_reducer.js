import { SEARCH_START, SEARCH_SUCCESS } from '../actions/types';

const INITIAL_STATE = {
  cafeInfoSearch: null
};

export default searchCafe = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_START:
      return { loading: true };
    case SEARCH_SUCCESS:
      return { cafeInfoSearch: action.payload };
    default:
      return state;
  }
}