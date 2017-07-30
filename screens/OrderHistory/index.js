import React, { Component, PropTypes } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { ListItem, List } from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import colors from '../../theme/colors';

import { fetchUserOrders } from '../../actions';

class OrderHistory extends Component {
  static navigationOptions = {
    title: 'Order History',
  };
  
  componentWillMount () {
    this.props.fetchUserOrders()
  };
  
  renderItem = ({ item }) => {
    
    return (
        <List containerStyle={{ marginTop: 0, borderTopWidth: 0 }}>
          <ListItem
            key={item.date}
            underlayColor="#E9F0F8"
            title={item.order.name}
            subtitle={moment(item.date).format('MMM Do YY')}
            rightTitle={`${item.order.total.toString()} nok`}
            onPress={() => this.props.navigation.navigate('order_history_detail', item)}
          />
        </List>
    )
  };
  
  render () {
    return (
      <View>
        <FlatList
          data={this.props.orders}
          renderItem={(item) => this.renderItem(item)}
          keyExtractor={(item) => item.date}
        />
      </View>
    )
  }
}

OrderHistoryPropTypes = {
  orders: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object
};

mapStateToProps = ({ orders }) => {
  return {
    orders: orders.userOrders,
    isLoading: orders.loading,
    error: orders.error
  }
};

export default connect(mapStateToProps, { fetchUserOrders })(OrderHistory);