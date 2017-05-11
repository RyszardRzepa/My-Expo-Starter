import { ADD_TO_CART, REMOVE_ITEM_FROM_CART, CLEAR_CART } from './types';

let cart = [];

let Item = function (name, price, count) {
  this.count = count;
  this.price = price;
  this.name = name;
};

export const addDrink = (name, price, count) => {
  return (dispatch) => {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count += count;
        
        dispatch({ type: ADD_TO_CART, payload: cart })
        return;
      }
    }
    
    let item = new Item(name, price, count);
    cart = [...cart, item]
    
    dispatch({ type: ADD_TO_CART, payload: cart })
  }
};

export const removeItemFromCart = (name) => {
  return dispatch => {
    if (name) {
      for (let i in cart) {
        if (cart[i].name === name) {
          cart[i].count--;
          
          dispatch({ type: REMOVE_ITEM_FROM_CART, payload: cart });
          if (cart[i].count === 0) {
            cart.splice(i, 1);
            dispatch({ type: REMOVE_ITEM_FROM_CART, payload: cart });
          }
          return;
        }
      }
    }
  }
};

export const clearCart = () => {
  
  return dispatch => {
    dispatch({ type: CLEAR_CART, payload: cart = [] })
  }
}
