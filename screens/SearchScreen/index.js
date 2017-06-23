import React, { Component, PropTypes } from 'react';
import  { View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

import CafesList from '../../components/Cafe_List';
import { searchCafes } from '../../actions';
import styles from './styles';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search',
    titleColor: { color: colors.lightBlue },
    tabBarIcon: ({ tintColor }) => <Icon name="search" size={30} color={tintColor}/>,
    header: false,
    tabBarPosition: 'bottom',
    gesturesEnabled: false
  };
  
  state = {
    text: ''
  };
  
  componentWillUpdate (nextProps, nextState) {
    this.props.searchCafes(nextState.text)
  }
  
  navigateCallback = (route, prop) => {
    this.props.navigation.navigate(route, prop)
  };
  
  render () {
    return (
      <View style={{ marginTop: 50, flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 40, backgroundColor: '#dedfe3', flexDirection: 'row' }}>
            <Icon containerStyle={{ marginHorizontal: 20 }} name="email" size={20}/>
            <TextInput
              placeholder='email'
              style={{ height: 40, flex: 1 }}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />
          </View>
        </View>
        {/*<View style={{ flex: 1, width }}>*/}
          {/*<CafesList*/}
            {/*data={this.props.cafesInfo}*/}
            {/*navigation={this.navigateCallback.bind(this)}*/}
            {/*userLocation={this.state.location}*/}
          {/*/>*/}
        {/*</View>*/}
      </View>
    )
  }
}

ReceiptScreenPropTypes = {
  cafeInfo: PropTypes.array,
};

mapStateToProps = ({ search }) => {
  return {
    cafeInfo: search.cafeInfo
  }
};

export default connect(mapStateToProps, { searchCafes })(SearchScreen);