import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements';
import { fetchUserData } from '../../actions'
import Cart from '../../components/Cart';
import Header from '../../components/common/Header';
import styles from './styles';

class DetailsScreen extends Component {
  static navigationOptions = {
    header: false,
  };
  
  componentWillMount () {
    this.props.fetchUserData();
  }
  
  componentWillReceiveProps (nextProps) {
    this.renderUserCredits(nextProps.userData.credits);
    console.tron.log(nextProps.userData)
  }
  
  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop);
  };
  
  renderUserCredits = (credits) => {
    return credits ? credits : this.props.userData.credits;
  };
  
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Icon
            name="keyboard-arrow-left"
            size={35}
            color="#fff"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Details Screen</Text>
          <Text style={styles.credits}>{this.renderUserCredits()}nok</Text>
        </Header>
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
