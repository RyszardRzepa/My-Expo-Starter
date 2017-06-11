import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements';
import { fetchUserData } from '../../actions'
import Cart from '../../components/Cart';
import Header from '../../components/common/Header';

class DetailsScreen extends Component {
  componentWillMount () {
    this.props.fetchUserData()
  }
  
  static navigationOptions = {
    title: 'Cafe Details',
    headerRight: (<Text>0</Text>),
    headerTitleStyle: { alignSelf: 'center' },
    headerStyle: { backgroundColor: '#59bcfe' },
    header: false,
  };
  
  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop)
  };
  
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Header
          headerText="Cafe Details"
          textRight={this.props.userData.credits}
          iconLeft={
            <Icon
              name="keyboard-arrow-left"
              size={35}
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <Cart
          data={this.props.navigation.state.params}
          navigation={this.navigateCallback}
        />
      </View>
    )
  }
}

DetailsScreen.defaultProps = {
  userData: {
    credits: 0
  }
};

mapStateToProps = ({ auth }) => {
  return {
    userData: auth.userData
  }
};

export default connect(mapStateToProps, { fetchUserData })(DetailsScreen);
