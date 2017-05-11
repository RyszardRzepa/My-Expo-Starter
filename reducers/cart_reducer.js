import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CLEAR_CART
} from '../actions/types';

const Initial_State = {
  cartItems: []
};

export default cartReducer = (state = Initial_State, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return { ...state, cartItems: action.payload };
    case REMOVE_ITEM_FROM_CART:
      return { cartItems: action.payload };
    case CLEAR_CART:
      return { cartItems: action.payload };
    default:
      return state;
  }
};