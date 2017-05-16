import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CLEAR_CART,
  COUNT_TOTAL_PRODUCT_CART,
  COUNT_TOTAL_PRICE_CART
} from './types';

let cart = [];

let Item = function (name, price, count, size, image) {
  this.count = count;
  this.price = price;
  this.name = name;
  this.size = size;
  this.image = image;
};

export const addDrinkToCart = (name, price, count, size, image) => {
  return (dispatch) => {
    for (let i in cart) {
      if (cart[i].name === name && cart[i].size === size) {
        cart[i].count += count;
          dispatch({ type: ADD_TO_CART, payload: cart });
          dispatch(cartCountTotalItems());
          dispatch(cartCountTotalPrice());
        return;
      }
    }
    let item = new Item(name, price, count, size, image);
    cart = [...cart, item];
    dispatch({ type: ADD_TO_CART, payload: cart });
    dispatch(cartCountTotalItems());
    dispatch(cartCountTotalPrice());
  }
};

export const removeItemFromCart = (name, size) => {
  return dispatch => {
    if (name) {
      for (let i in cart) {
        if (cart[i].name === name && cart[i].size === size) {
          cart[i].count--;
          
          dispatch({ type: REMOVE_ITEM_FROM_CART, payload: cart });
          dispatch(cartCountTotalItems());
          dispatch(cartCountTotalPrice());
          if (cart[i].count === 0) {
            cart.splice(i, 1);
            dispatch({ type: REMOVE_ITEM_FROM_CART, payload: cart });
            dispatch(cartCountTotalItems());
            dispatch(cartCountTotalPrice());
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
};

export const cartCountTotalItems = () => {
  return dispatch => {
    let totalProductsNumber = 0;
    cart.map(item => {
      return totalProductsNumber += item.count;
    });
    dispatch({ type: COUNT_TOTAL_PRODUCT_CART, payload: totalProductsNumber });
    console.log("totalProductsNumber", totalProductsNumber)
  }
};

export const cartCountTotalPrice = () => {
  return dispatch => {
    let totalProductsPrice = 0;
    cart.map(item => {
      if (item.count > 0) {
        return totalProductsPrice += (item.price * item.count);
      }
    });
    dispatch({ type: COUNT_TOTAL_PRICE_CART, payload: totalProductsPrice });
  }
};


