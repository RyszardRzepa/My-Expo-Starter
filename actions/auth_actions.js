import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_USER_START,
  REGISTER_USER_START,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_DATA_START,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAIL
} from './types';

export const LoginUser = (email, password, redirect) => async dispatch => {
  try {
    dispatch({ type: LOGIN_USER_START });
    
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    
    const token = await firebase.auth().currentUser.getToken();
    
    await AsyncStorage.setItem('token', token);
    redirect();
    
  } catch (err) {
    console.log(err);
    dispatch({ type: LOGIN_FAIL, payload: err })
  }
};

//TODO create login/register in one auth action creator
export const RegisterUser = (email, password, redirect) => async dispatch => {
  try {
    dispatch({ type: REGISTER_USER_START })
    const user = await firebase.auth().createUserWithEmailAndPassword(email, password);
    dispatch({ type: REGISTER_USER_SUCCESS, payload: user });
    
    const userRef = firebase.database().ref('users/accounts');
    const userLoginRef = userRef.child(user.uid);
    userLoginRef.set({
      uid: user.uid,
      Office_Phone: Math.floor(Math.random() * 90000) + 10000,
      email: email,
      name: email,
      credit_card_registered: false,
      credits: 0,
      date: Date.now()
    });
    
    const token = await firebase.auth().currentUser.getToken();
    
    await AsyncStorage.setItem('token', token);
    redirect();
  } catch (err) {
    console.log(err);
    dispatch({ type: REGISTER_USER_FAIL, payload: err })
  }
};

export const FetchUserData = () => async dispatch => {
  const userId = firebase.auth().currentUser.uid;
  const userRef = await firebase.database().ref(`/users/accounts/${userId}`);
  try {
    dispatch({ type: LOAD_USER_DATA_START });
    userRef.once('value')
      .then(data => {
        dispatch({ type: LOAD_USER_DATA_SUCCESS, payload: data.val() })
      })
  }
  catch (err) {
    console.tron.log("error user data loading", err)
  }
};

