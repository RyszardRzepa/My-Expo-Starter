import { combineReducers } from 'redux';
import auth from './auth_reducer';
import cafes from './cafes_reducer';

export default combineReducers({
  auth, cafes
});
