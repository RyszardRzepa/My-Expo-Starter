import { compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import logger from 'redux-logger';
import Reactotron from 'reactotron-react-native'
import reducers from '../reducers';


const store = Reactotron.createStore(
  reducers,
  {},
  compose(
    applyMiddleware(thunk,logger),
    autoRehydrate()
  )
);

persistStore(store, { storage: AsyncStorage, whitelist: ['likedJobs'] });

export default store;
