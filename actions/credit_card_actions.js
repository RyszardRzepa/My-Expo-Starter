import firebase from 'firebase';

import { FILL_CREDIT_CARD_START, FILL_CREDIT_CARD_SUCCESS } from './types';

export const FillCreditCard = (amount) => async dispatch => {
  try {
    const userId = await firebase.auth().currentUser.uid;
    
    const userAccount = await firebase.database().ref('/users/accounts/' + userId);
    
    const creditCardRef = await firebase.database()
      .ref('/credit_cards/accounts/' + userId + '/credits');
    
    const userCredits = await firebase.database().ref('/users/accounts/' + userId)
      .once('value').then(user => user.val().credits);
    
    await dispatch({ type: FILL_CREDIT_CARD_START });
    
    await creditCardRef.push({
      credits: amount,
      date: Date.now()
    });
    
    await userAccount.update({
      credits: userCredits + amount
    });
    
    await dispatch({ type: FILL_CREDIT_CARD_SUCCESS });
  }
  catch (err) {
    console.log(err)
  }
};