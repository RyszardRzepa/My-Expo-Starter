import { combineReducers } from 'redux';
import auth from './auth_reducer';
import cafes from './cafes_reducer';
import cart from './cart_reducer';

export default combineReducers({
  auth, cafes, cart
});
