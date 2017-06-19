import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import store from '../../store';
import { Icon } from 'react-native-elements';
import { fetchUserData } from '../../actions'
import Cart from '../../components/Cart';
import Header from '../../components/common/Header';
import styles from './styles';

class DetailsScreen extends Component {
  static navigationOptions = {
    header: false,
    gesturesEnabled: false
  };
  
  componentWillMount () {
    this.props.fetchUserData();
    store.dispatch({ type: 'ADD_DETAILS_SCREEN_ITEM', payload: this.props.navigation.state.params });
  }
  
  componentWillReceiveProps (nextProps) {
    this.renderUserCredits(nextProps.userData.credits);
  }
  
  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop);
  };
  
  renderUserCredits = (credits) => {
    return credits ? credits : this.props.userData.credits;
  };
  
  render () {
    console.log("Detail Screen navigation params", this.props.navigation.state.params)
    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Icon
            underlayColor='transparent'
            name="keyboard-arrow-left"
            size={35}
            color="#fff"
            onPress={() => this.props.navigation.navigate('map')}
          />
          <Text style={styles.headerTitle}>Details Screen</Text>
          <Text style={styles.credits}>{this.renderUserCredits()} NOK</Text>
        </Header>
        <Cart
          data={this.props.navigation.state.params.item}
          navigation={this.navigateCallback}
        />
      </View>
    )
  }
}

DetailsScreenPropTypes = {
  userData: PropTypes.object
};

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
