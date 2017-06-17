import  firebase from 'firebase';
import { FETCH_CAFES_SUCCESS, FETCH_USER_LOCATION_SUCCESS, CALCULATE_DISTANCE_SUCCESS, CALCULATE_DISTANCE_START, FETCH_USER_LOCATION_ERROR} from './types';
import _ from 'lodash';

export const fetchCafes = () => {
  return (dispatch) => {
    firebase.database().ref('/coffee_bars/accounts').once('value').then(function (snapshot) {
      let items = [];
      
      snapshot.forEach((child) => {
        let menu = [];
        _.map(child.val().menu, item => {
          menu.push({
            name: item.name,
            image: item.image,
            price: item.price,
            size: item.size
          })
        });
        items.push({
          location: child.val().location,
          address: child.val().address,
          image: child.val().cafeImage,
          menu,
          pinCode: child.val().pinCode,
          name: child.val().name
        });
      });
      dispatch({ type: FETCH_CAFES_SUCCESS, payload: items })
    })
  }
};

