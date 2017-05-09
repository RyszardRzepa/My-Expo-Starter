import  firebase from 'firebase';
import { FETCH_CAFES_SUCCESS} from './types';
import _ from 'lodash';

export const FetchCafes = () => {
  return (dispatch) => {
    firebase.database().ref('/cafes/name').once('value').then(function (snapshot) {
      let items = [];
      
      snapshot.forEach((child) => {
        let menu = [];
        _.map(child.val().meny, item => {
          menu.push({
            name: item.name,
            image: item.image,
            price: item.price
          })
        });
        items.push({
          location: child.val().location,
          address: child.val().address,
          image: child.val().image,
          menu
        });
      });
      dispatch({ type: FETCH_CAFES_SUCCESS, payload: items })
    })
  }
};

