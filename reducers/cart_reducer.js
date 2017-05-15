import Immutable from 'seamless-immutable';
import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CLEAR_CART,
  COUNT_TOTAL_PRODUCT_CART,
  COUNT_TOTAL_PRICE_CART
} from '../actions/types';

const Initial_State = {
  cartItems: [],
};

export default cartReducer = (state = Initial_State, action) => {
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
      return { ...state, totalCartPrice: action.payload };
    default:
      return state;
  }
};