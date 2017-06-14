import React, { Component, PropTypes } from 'react';
import { View, Text, AsyncStorage, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, List, ListItem } from 'react-native-elements';
import { fetchUserData } from '../../actions'
import firebase from 'firebase';

const list = [
  {
    title: 'Fill your coffee card',
    icon: 'account-balance-wallet',
    navigate: 'fill_credit_card',
    color: '#3c3c3c'
  },
  {
    title: 'Register credit card',
    icon: 'credit-card',
    navigate: 'credit_card',
    color: '#3c3c3c'
  },
  {
    title: 'Receipt',
    icon: 'receipt',
    navigate: 'map',
    color: '#3c3c3c'
  },
];

class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
    tabBarIcon: ({ tintColor }) => {
      return <Icon
        name="face"
        size={30}
        color={tintColor}/>;
    },
    header: false
  };
  
  componentWillMount () {
    this.props.fetchUserData();
  }
  
  onLogOut = () => {
    AsyncStorage.removeItem('token');
    this.props.navigation.navigate('welcome');
  };
  
  render () {
    {
      console.tron.log(this.props);
    }
    return (
      <View style={{ marginVertical: 50, flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
          <View>
          </View>
          <View style={{ flexDirection: 'column', margin: 10 }}>
            <Text style={{ fontSize: 20 }}>
              {this.props.userData.email}
            </Text>
            <Text style={{ fontSize: 20 }}>
              {this.props.userData.credits}
            </Text>
          </View>
          <Image
            style={{ height: 80, width: 80 }}
            source={{ uri: "https://firebasestorage.googleapis.com/v0/b/coffeecloud-dee31.appspot.com/o/coffee_bars%2Fdrinks%2Fimages%2F649ff5d5-f38c-481b-8872-59f1f74c884c.png?alt=media&token=a465e79d-a8c9-4c37-82d5-150245ff71fb" }}
          />
        </View>
        <View style={{ justifyContent: 'space-between', flex: 2, flexDirection: 'column' }}>
          <List>
            {
              list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  leftIcon={{ name: item.icon }}
                  onPress={() => this.props.navigation.navigate(item.navigate)}
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

ProfileScreen.defaultProps = {
  userData: {}
};

ProfileScreen.propTypes = {
  user: PropTypes.object,
  userData: PropTypes.object
};

mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
    userData: auth.userData
  }
};

export default connect(mapStateToProps, { fetchUserData })(ProfileScreen);
