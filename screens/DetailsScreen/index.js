import React, { Component, PropTypes } from 'react';
import { Text, View, TouchableOpacity,Platform, Image } from 'react-native';
import { connect } from 'react-redux';

import store from '../../store';
import { Icon } from 'react-native-elements';
import { fetchUserData } from '../../actions'
import Cart from '../../components/Cart';
import Header from '../../components/common/Header';
import styles from './styles';
import colors from '../../theme/colors';

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
            onPress={() => this.props.navigation.goBack(null)}
          />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('fill_credit_card')}>
            <View style={[{ flexDirection: 'row', marginTop: Platform.OS === 'ios' ? 10 : 0, marginBottom: 15, justifyContent: 'center', alignItems: 'center' }]}>
              <Image
                source={require('../../assets/icons/whiteLogo.png')}
                style={{ height: 35, width: 22 }}
                resizeMode="stretch"
              />
              <Text style={styles.credits}>{this.renderUserCredits()} kr</Text>
            </View>
          </TouchableOpacity>
          <View></View>
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
