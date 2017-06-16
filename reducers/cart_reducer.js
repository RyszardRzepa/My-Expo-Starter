import Immutable from 'seamless-immutable';
import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CLEAR_CART,
  COUNT_TOTAL_PRODUCT_CART,
  COUNT_TOTAL_PRICE_CART,
  CASHIER_CONFIRM_ORDER_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  cartItems: [],
  totalCartPrice: 0,
  totalCartItems: 0,
};

export default cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return Object.assign({}, state, {
        cartItems: Immutable(action.payload)
      });
    case REMOVE_ITEM_FROM_CART:
      return { cartItems: Immutable(action.payload) };
    case CLEAR_CART:
      return { cartItems: Immutable(action.payload) };
    case COUNT_TOTAL_PRODUCT_CART:
      return { ...state, totalCartItems: Immutable(action.payload) };
    case COUNT_TOTAL_PRICE_CART:
      return { ...state, totalCartPrice: Immutable(action.payload) };
     case CASHIER_CONFIRM_ORDER_SUCCESS:
       return { isModalOpen: false };
    default:
      return state;
  }
};