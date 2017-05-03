import  firebase from 'firebase';
import _ from 'lodash';
import { FETCH_CAFES_SUCCESS} from './types';

export const FetchCafes = () => {
  return (dispatch) => {
    firebase.database().ref('/coffeeshops/name').once('value').then(function (snapshot) {
      const cafesName = _.map(snapshot.val(), (item) => {
        return item.coordinates
      });
      dispatch({ type: FETCH_CAFES_SUCCESS, payload: cafesName })
    })
  }
};

