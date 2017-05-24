import Immutable from 'seamless-immutable';
import {
  FILL_CREDIT_CARD_SUCCESS,
  FILL_CREDIT_CARD_START
} from '../actions/types';

const Initial_State = {
  creditCard: {},
  isLoading: false
};

export default  creditCardReducer = (state = Initial_State, action) => {
  switch (action.type) {
    case FILL_CREDIT_CARD_START:
      return { isLoading: true };
    case FILL_CREDIT_CARD_SUCCESS:
      return { isLoading: false }
  }
}