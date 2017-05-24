import './ReactotronConfig'
import Expo, { Notifications } from 'expo';
import React from 'react';
import { Alert, Platform, StatusBar } from 'react-native';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import registerForNotifications from './services/push_notifications';

import store from './store';

import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import DetailsScreen from './screens/DetailsScreen';
import CashierScreen from './screens/CashierScreen';
import CreditCard from './components/CreditCard';
import FillCreditCard from './screens/CreditCardScreen';

const config = {
  apiKey: "AIzaSyBaB_6jFIUG7q8lpYHbxvtsNzyVr0xDuXA",
  authDomain: "weather-forecast-9a2a5.firebaseapp.com",
  databaseURL: "https://weather-forecast-9a2a5.firebaseio.com",
  projectId: "weather-forecast-9a2a5",
  storageBucket: "weather-forecast-9a2a5.appspot.com",
  messagingSenderId: "317335334484"
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
    });
    
    const MainNavigator = StackNavigator({
      welcome: { screen: WelcomeScreen },
      main: {screen : TabNav},
      details: { screen: DetailsScreen },
      cashier: { screen: CashierScreen },
      credit_card: { screen: CreditCard }
    }, {
      navigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#00adf5',
        },
        lazy: true,
        tabBarVisible: false
      },
    });
    
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

Expo.registerRootComponent(App);
