import React, { Component } from 'react';
import { View, Image, Text, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, List, ListItem } from 'react-native-elements';

const list = [
  {
    title: 'Fill your coffee wallet',
    icon: 'account-balance-wallet'
  },
  {
    title: 'Receipt',
    icon: 'receipt'
  },
];

class DeckScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="face" size={30} color={tintColor}/>;
    },
    header: false
  };
  
  onLogOut = () => {
    AsyncStorage.removeItem('token');
    this.props.navigation.navigate('welcome');
  };
  
  render () {
    console.log("props profile", this.props.user);
    return (
      <View style={{ marginVertical: 50, flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
          <Text>
            User Name and image section
          </Text>
        </View>
        <View style={{ justifyContent: 'space-between', flex: 2, flexDirection: 'column' }}>
          <List>
            {
              list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  leftIcon={{name: item.icon}}
                />
              ))
            }
          </List>
          <Button
            light
            title="Logout"
            onPress={() => this.onLogOut()}
          />
        </View>
      </View>
    );
  }
}

mapStateToProps = ({ auth }) => {
  return {
    user: auth.user
  }
};

export default connect(mapStateToProps)(DeckScreen);
