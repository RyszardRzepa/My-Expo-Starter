import React, { Component, PropTypes } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchUserOrders } from '../../actions';

class OrderHistory extends Component {
  
  componentWillMount () {
    this.props.fetchUserOrders()
  };
  
  renderItem = ({ item }) => {
    console.log("items from rder history list", item,)
    return (
      <ListItem
      key={item.date}
      />
    )
  };
  
  render () {
    console.log("Order History user data", this.props)
    return (
      <FlatList
        data={this.props.orders}
        renderItem={(item) => this.renderItem(item)}
      />
    )
  }
}

OrderHistory.propTypes = {
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