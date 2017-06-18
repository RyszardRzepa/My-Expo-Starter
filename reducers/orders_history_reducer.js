import {
  FETCH_USER_ORDERS_FAIL,
  FETCH_USER_ORDERS_SUCCESS,
  FETCH_USER_ORDERS_START
} from '../actions/types';

const INITIAL_STATE = {
  userOrders: [],
  loading: false,
  error: {}
};

export default orderHistory = (state= INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_ORDERS_START:
      return { loading: true };
    case FETCH_USER_ORDERS_SUCCESS:
      return { ...state, userOrders: action.payload, loading: false };
    case FETCH_USER_ORDERS_FAIL:
      return { error: action.payload };
    default:
      return state;
  }
}