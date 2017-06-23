import { combineReducers } from 'redux';
import auth from './auth_reducer';
import cafes from './cafes_reducer';
import cart from './cart_reducer';
import orders from './orders_history_reducer';
import search from './search_reducer';

export default combineReducers({
  auth, cafes, cart, orders, search
});
