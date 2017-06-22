import firebase from 'firebase';
import { SEARCH_START, SEARCH_SUCCESS } from './types';
import _ from 'lodash';

export const searchCafes = (text) => {
  return dispatch => {
    dispatch({ type: SEARCH_START, payload: true });
    if (text !== '') {
      const cafeRef = firebase.database().ref('coffee_bars/accounts');
      cafeRef.orderByChild("name").startAt(text).endAt(`${text}\uf8ff`)
        .on("child_added", snapshot => {
          
          let items = [];
          let menu = [];
          
          _.map(snapshot.val().menu, item => {
            menu.push({
              name: item.name,
              image: item.image,
              price: item.price,
              size: item.size
            })
          });
          
          items.push({
            location: snapshot.val().location,
            address: snapshot.val().address,
            image: snapshot.val().cafeImage,
            menu,
            pinCode: snapshot.val().pinCode,
            name: snapshot.val().name
          });
          
          dispatch({ type: SEARCH_SUCCESS, payload: items })
        });
    }
  };
};
