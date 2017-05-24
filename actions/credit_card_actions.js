import firebase from 'firebase';

import { FILL_CREDIT_CARD_START, FILL_CREDIT_CARD_SUCCESS } from './types';

export const FillCreditCard = (amount) => async dispatch => {
  try {
    const userId = await firebase.auth().currentUser.uid;
    const userRef = await firebase.database().ref(`/credits/${userId}`);
  
    dispatch({ type: FILL_CREDIT_CARD_START });
    userRef.set({
      credits: amount
    })
    dispatch({ type: FILL_CREDIT_CARD_SUCCESS });
  }
  catch (err) {
    console.log(err)
  }
};