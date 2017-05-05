import  firebase from 'firebase';
import _ from 'lodash';
import { FETCH_CAFES_SUCCESS} from './types';

export const FetchCafes = () => {
  return (dispatch) => {
    firebase.database().ref('/cafes/name').once('value').then(function (snapshot) {
      let items = [];
      snapshot.forEach((child) => {
        items.push({
          location: child.val().location,
          address: child.val().address,
          image: child.val().image,
        });
      });
      dispatch({ type: FETCH_CAFES_SUCCESS, payload: items })
    })
  }
};

