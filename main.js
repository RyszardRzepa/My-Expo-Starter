import './ReactotronConfig'
import Expo, { Notifications } from 'expo';
import React from 'react';
import { Alert } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import registerForNotifications from './services/push_notifications';

import store from './store';

import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import DetailsScreen from './screens/DetailsScreen';
import CashierScreen from './screens/CashierScreen';

const config = {
  apiKey: "AIzaSyBaB_6jFIUG7q8lpYHbxvtsNzyVr0xDuXA",
  authDomain: "weather-forecast-9a2a5.firebaseapp.com",
  databaseURL: "https://weather-forecast-9a2a5.firebaseio.com",
  projectId: "weather-forecast-9a2a5",
  storageBucket: "weather-forecast-9a2a5.appspot.com",
  messagingSenderId: "317335334484"
};
firebase.initializeApp(config);

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
    const MainNavigator = StackNavigator({
      welcome: { screen: WelcomeScreen },
      main: {
        screen: TabNavigator({
          map: { screen: MapScreen },
          list: { screen: ProfileScreen },
        }, {
          tabBarOptions: {
            labelStyle: { fontSize: 12 }
          }
        })
      },
      details: { screen: DetailsScreen },
      cashier: { screen: CashierScreen }
    }, {
      initialRouteName: 'welcome',
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
