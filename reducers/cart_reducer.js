import Immutable from 'seamless-immutable';
import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CLEAR_CART
} from '../actions/types';

const Initial_State = {
  cartItems: [
    {count: 0}
  ]
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
    default:
      return state;
  }
};