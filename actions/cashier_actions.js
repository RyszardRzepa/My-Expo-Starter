import firebase from 'firebase';
import { CASHIER_CONFIRM_ORDER_START,
  CASHIER_CONFIRM_ORDER_SUCCESS,
  UPDATE_USER_CREDITS_SUCCESS
} from './types';

export const cashierConfirmOrder = (order, total) => async dispatch => {
  try {
    const userId = firebase.auth().currentUser.uid;
    const userRef = firebase.database().ref(`/users/accounts/${userId}`);
    const userCredits = await userRef.once('value').then(user => user.val().credits);
    
    const creditCardOrdersRef = await firebase.database()
      .ref(`/users/orders`);
    
    await dispatch(updateUserCredits(total, userCredits, userRef));
    
    dispatch({ type: CASHIER_CONFIRM_ORDER_START });
    
    creditCardOrdersRef.child(userId).push({ order, date: Date.now() });
    
    dispatch({ type: CASHIER_CONFIRM_ORDER_SUCCESS, payload: order });
  }
  catch (err) {
    console.tron.log(`error saving order:: ${err}`)
  }
};

export const updateUserCredits = (total, userCredits, userRef) => async dispatch => {
  try {
    const updatedCredits = userCredits - total;
    
    userRef.update({
      credits: updatedCredits
    });
    
    dispatch({ type: UPDATE_USER_CREDITS_SUCCESS, payload: updatedCredits })
  }
  catch (err) {
    console.tron.log(err)
  }
};