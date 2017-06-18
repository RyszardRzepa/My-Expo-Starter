import './ReactotronConfig'
import Expo, { Notifications } from 'expo';
import React from 'react';
import { Alert } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import firebase from 'firebase';

import registerForNotifications from './services/push_notifications';
import configKey from './config';
import store from './store';

import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import DetailsScreen from './screens/DetailsScreen';
import CashierScreen from './screens/CashierScreen';
import CreditCard from './components/CreditCard';
import FillCreditCard from './screens/CreditCardScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import OrderHistory from './screens/OrderHistory';

import colors from './theme/colors';

const config = {
  apiKey: configKey.apiKey,
  authDomain: configKey.authDomain,
  databaseURL: configKey.databaseURL,
  projectId: configKey.projectId,
  storageBucket: configKey.storageBucket,
  messagingSenderId: configKey.messagingSenderId
};
firebase.initializeApp(config);
console.ignoredYellowBox = ['Setting a timer', 'Back android'];

class App extends React.Component {
  componentDidMount () {
    registerForNotifications();
    Notifications.addListener((notification) => {
      const { data: { text }, origin } = notification;
      
      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text: 'Ok.' }]
        );
      }
    });
  }
  
  render () {
    
    const TabNav = TabNavigator({
      map: { screen: MapScreen },
      profile: { screen: ProfileScreen },
    }, {
      tabBarPosition: 'bottom',
      animationEnabled: true,
      tabBarOptions: {
        activeTintColor: colors.lightBlue,
      }, lazy: true,
    });
    
    const MainNavigator = StackNavigator({
      welcome: { screen: WelcomeScreen },
      main: { screen: TabNav },
      details: { screen: DetailsScreen },
      cashier: { screen: CashierScreen },
      credit_card: { screen: CreditCard },
      fill_credit_card: { screen: FillCreditCard },
      receipt: { screen: ReceiptScreen },
      order_history: { screen: OrderHistory}
    }, {
      navigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#00adf5',
        },
        lazy: true,
        tabBarVisible: false
      },
      headerMode: 'screen'
    });
    
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

Expo.registerRootComponent(App);
