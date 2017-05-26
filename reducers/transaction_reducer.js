import Immutable from 'seamless-immutable';
import {
  CASHIER_CONFIRM_ORDER_SUCCESS,
  CASHIER_CONFIRM_ORDER_START,
  UPDATE_USER_CREDITS_SUCCESS
} from '../actions/types';

const Initial_State = {
  order: {},
  isLoading: false,
  userCredits: Number
};

export default  creditCardReducer = (state = Initial_State, action) => {
  switch (action.type) {
    case CASHIER_CONFIRM_ORDER_START:
      return { isLoading: true };
    case CASHIER_CONFIRM_ORDER_SUCCESS:
      return { order: action.payload, isLoading: false };
    case UPDATE_USER_CREDITS_SUCCESS:
      return { ...state, userCredits: Immutable(action.payload) };
    default:
      return state;
  }
}