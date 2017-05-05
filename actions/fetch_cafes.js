import  firebase from 'firebase';
import _ from 'lodash';
import { FETCH_CAFES_SUCCESS} from './types';

export const FetchCafes = () => {
  return (dispatch) => {
    firebase.database().ref('/cafes/name').once('value').then(function (snapshot) {
      const cafesInfo = snapshot.val();
      dispatch({ type: FETCH_CAFES_SUCCESS, payload: cafesInfo })
    })
  }
};

