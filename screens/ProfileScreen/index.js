import React, { Component, PropTypes } from 'react';
import { View, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, List, ListItem } from 'react-native-elements';
import { fetchUserData } from '../../actions'

class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
    tabBarIcon: ({ tintColor }) => {
      return <Icon
        name="face"
        size={30}
        color={tintColor}/>;
    },
    header: false,
    gesturesEnabled: false
  };
  
  componentWillMount () {
    this.props.fetchUserData();
  }
  
  componentWillReceiveProps (nextProps) {
    this.renderUserData(nextProps.userData);
  }
  
  renderUserData = (props) => {
    if (props)
      return <View style={{ flexDirection: 'column', margin: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>
          {props.email}
        </Text>
        <Text style={{ fontSize: 20 }}>
          {props.credits} credits
        </Text>
      </View>;
    
    return <Text>
      Place for my email
    </Text>
  };
  
  onLogOut = () => {
    AsyncStorage.removeItem('token');
    this.props.navigation.navigate('welcome');
  };
  
  render () {
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
        title: 'Order History',
        icon: 'receipt',
        navigate: 'order_history',
        color: '#3c3c3c',
        data: this.props.userData
      },
      {
        title: 'Settings',
        icon: 'settings',
        navigate: 'order_history',
        color: '#a2bafe',
        data: this.props.userData
      },
    ];
   
    return (
      <View style={{ marginTop: 50, flex: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
          <View>
          </View>
          {this.renderUserData(this.props.userData)}
          <Image
            style={{ height: 80, width: 80 }}
            source={require('../../assets/icons/user.png')}
          />
        </View>
        <View style={{ flex: 2 }}>
          <List>
            {
              list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  leftIcon={{ name: item.icon, style: { color: item.color} }}
                  onPress={() => this.props.navigation.navigate(item.navigate, item.data)}
                />
              ))
            }
          </List>
        </View>
        <View style={{ backgroundColor: '#47b1e8', height: 40, alignItems: 'center', justifyContent: 'center'  }}>
          <TouchableOpacity  onPress={() => this.onLogOut()}>
            <Text style={{ fontSize: 20, color: '#fff'}}> Logout </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

ProfileScreen.defaultProps = {
  userData: {}
};

ProfileScreenPropTypes = {
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
