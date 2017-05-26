import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_USER_START,
  REGISTER_USER_START,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_DATA_SUCCESS
} from '../actions/types';

const Initial_State = {
  isLoading: false,
  user: {},
  userData: {}
};

export default function authReducer (state = Initial_State, action) {
  switch (action.type) {
    case LOGIN_USER_START:
      return { isLoading: true };
    case LOGIN_SUCCESS:
      return { user: action.payload, isLoading: false };
    case LOGIN_FAIL:
      return { err: action.payload, isLoading: false };
    case REGISTER_USER_START:
      return { isLoading: true };
    case REGISTER_USER_SUCCESS:
      return { user: action.payload, isLoading: false };
    case REGISTER_USER_FAIL:
      return { err: action.payload, isLoading: false };
    case LOAD_USER_DATA_SUCCESS:
      return { userData: action.payload };
    default:
      return state;
  }
}
