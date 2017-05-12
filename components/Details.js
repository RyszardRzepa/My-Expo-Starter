import React, { Component } from "react";
import {
  View,
} from "react-native";
import { connect } from 'react-redux';

import Cart from '../components/Cart';

import { addDrink, removeItemFromCart } from '../actions'

class Details extends Component {
  state = {
    cart: []
  };
  
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState !== nextProps) {
      this.setState({ cart: nextProps })
      return true;
    }
  }
  
  render () {
    const { addDrink, removeItemFromCart, cart, data } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Cart
          data={data}
          addDrink={addDrink}
          removeItemFromCart={removeItemFromCart}
        />
      </View>
    );
  }
}

Details.propTypes = {
  cart: React.PropTypes.array
};


function mapStateToProps ({ cart }) {
  return {
    cart: cart.cartItems
  }
}
export default connect(mapStateToProps, { addDrink, removeItemFromCart })(Details);


