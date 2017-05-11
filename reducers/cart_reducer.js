import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART
} from '../actions/types';

const Initial_State = {
  cart: []
};

export default cartReducer = (state = Initial_State, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state, cart: action.payload
      };
    case REMOVE_ITEM_FROM_CART:
      return {
        ...state, cart: action.payload
      };
    default:
      return state;
  }
};