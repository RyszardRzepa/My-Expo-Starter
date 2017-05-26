import firebase from 'firebase';

import {
  FILL_CREDIT_CARD_START,
  FILL_CREDIT_CARD_SUCCESS,
  REGISTER_CREDIT_CARD_START,
  REGISTER_CREDIT_CARD_SUCCESS
} from './types';

export const FillCreditCard = (amount) => async dispatch => {
  try {
    const userId = await firebase.auth().currentUser.uid;
    
    const userAccount = await firebase.database().ref('/users/accounts/' + userId);
    
    const creditCardRef = await firebase.database()
      .ref('/credit_cards/accounts/' + userId + '/credits');
    
    const userCredits = await userAccount.once('value').then(user => user.val().credits);
    
    dispatch({ type: FILL_CREDIT_CARD_START });
    
    await creditCardRef.push({
      credits: amount,
      date: Date.now()
    });
    
    userAccount.update({
      credits: userCredits + amount
    });
    
    dispatch({ type: FILL_CREDIT_CARD_SUCCESS });
  }
  catch (err) {
    console.tron.log(err)
  }
};

export const RegisterCreditCard = () => async dispatch => {
  try {
    const userId = await firebase.auth().currentUser.uid;
    const userAccount = await firebase.database().ref('/users/accounts/' + userId);
  
    dispatch({ type: REGISTER_CREDIT_CARD_START });
    
    userAccount.update({
      credit_card_registered: true
    });
    
    dispatch({ type: REGISTER_CREDIT_CARD_SUCCESS });
  }
  catch (err) {
    console.tron.log(err)
  }
};
