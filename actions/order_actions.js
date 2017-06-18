import firebase from 'firebase';
import { FETCH_USER_ORDERS_SUCCESS, FETCH_USER_ORDERS_START, FETCH_USER_ORDERS_FAIL } from './types';

export const fetchUserOrders = () => async dispatch => {
  const uid = await firebase.auth().currentUser.uid;
  const userRef = await firebase.database().ref(`users/orders/${uid}`);
  try {
    dispatch({ type: FETCH_USER_ORDERS_START });
    userRef.on('value', orders => {
      let userOrders = [];
      orders.forEach(order => {
        userOrders.push({
          order: order.val().order,
          date: order.val().date
        })
      });
      dispatch({ type: FETCH_USER_ORDERS_SUCCESS, payload: userOrders })
    });
  }
  catch (err) {
    dispatch({ type: FETCH_USER_ORDERS_FAIL, payload: err })
  }
  
};