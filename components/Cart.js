import React, { Component } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  Text
} from "react-native";
import { Tile, List, ListItem, Icon, Button } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';

import styles from './styles/cart_styles';

const { width, height } = Dimensions.get('window');

import { addDrinkToCart, removeItemFromCart, clearCart, cartCountTotalItems, cartCountTotalPrice } from '../actions'

class Cart extends Component {
  
  renderHeaderCafeList = (coffee) => {
    return (
      <View style={styles.header}>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <List containerStyle={styles.listStyle }>
              <ListItem
                containerStyle={{ width }}
                roundAvatar={false}
                avatarStyle={styles.avatarStyle}
                avatar={{ uri: coffee.image }}
                key={coffee.name}
                title={coffee.name}
              />
            </List>
          </View>
        </View>
      </View>
    );
  };
  
  //TODO simplify renderAddToCart function
  renderAddToCart = ({ small, medium }, size, name) => {
    if (small && medium) {
      return (
        <View style={{ backgroundColor: '#ecf0f1' }}>
          <View style={styles.productTypeRow}>
            <Text style={styles.drinkText}>{size.small}</Text>
            <Text style={styles.drinkPrice}>{small} kr</Text>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Icon
                size={30}
                name='add-circle-outline'
                color='#2ecc71'
                onPress={() => this.props.addDrinkToCart(name, small, 1, size.small)}
              />
              {this.props.cart.map((item, i) => {
                if (item.name === name && item.price === small) {
                  return <Text key={Math.random()}>{item.count}</Text>
                }
              })}
              <Icon
                size={30}
                name='remove-circle-outline'
                color='#e74c3c'
                onPress={() => this.props.removeItemFromCart(name, size.small)}
              />
            </View>
          </View>
          
          <View style={styles.productTypeRow}>
            <Text>{size.medium}</Text>
            <Text>{medium} kr</Text>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                size={30}
                name='add-circle-outline'
                color='#2ecc71'
                onPress={() => this.props.addDrinkToCart(name, medium, 1, size.medium)}
              />
              {this.props.cart.map((item, i) => {
                if (item.name === name && item.price === medium) {
                  return <Text key={Math.random()}>{item.count}</Text>
                }
              })}
              <Icon
                size={30}
                name='remove-circle-outline'
                color='#e74c3c'
                onPress={() => this.props.removeItemFromCart(name, size.medium)}
              />
            </View>
          </View>
        </View>
      )
    }
    return <Text> only one size</Text>
  };
  
  renderContentCafeList ({ price, size, name }) {
    return (
      <ScrollView>
        {this.renderAddToCart(price, size, name)}
      </ScrollView>
    );
  }
  
  renderBasket = () => {
    return (
      <Modal style={styles.basketModal} position={"center"} ref={"cartModal"} swipeArea={500}>
        <Icon
          size={32}
          name='clear'
          color='#e74c3c'
          onPress={() => this.props.clearCart()}
        />
        <View style={styles.basketContentContainer}>
          <Text>Check the order!</Text>
          {this.props.cart.map((item, i) => {
            if (item.count)
              return <View key={i} style={styles.basketContent}>
                <Text>{item.name}</Text>
                <Text>{item.size}</Text>
                <Text>{item.count}</Text>
                <Icon
                  size={32}
                  name='add-circle'
                  color='#2ecc71'
                  onPress={() => this.props.addDrinkToCart(item.name, item.price, 1, item.size)}
                />
                <Icon
                  size={32}
                  name='remove-circle'
                  color='#e74c3c'
                  onPress={() => this.props.removeItemFromCart(item.name, item.size)}
                />
              </View>
          })}
        </View>
        <View style={{ margin: 10, bottom: 0, flexDirection: 'column' }}>
          <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text> {this.props.totalCartItems}</Text>
            <Text>{this.props.totalCartPrice}kr</Text>
          </View>
          <Button buttonStyle={{ width: 150 }} raised title='Pay'/>
        </View>
      </Modal>
    )
  };
  
  render () {
    const { image, address } = this.props.data;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 200 }}>
          <Tile
            imageSrc={{ uri: image }}
            title={address}
            featured
            caption="Some Caption Text"
          />
          <Icon
            containerStyle={{ position: 'absolute', top: 50, right: 20 }}
            raised
            name='shopping-cart'
            color='#f50'
            onPress={() => {this.refs.cartModal.open()}}
          />
        </View>
        <ScrollView>
          <Accordion
            sections={this.props.data.menu}
            renderHeader={this.renderHeaderCafeList.bind(this)}
            renderContent={this.renderContentCafeList.bind(this)}
          />
        </ScrollView>
        
        <View style={{ position: 'absolute', top: 0, marginBottom: 150 }}>
          {this.renderBasket()}
        </View>
      </View>
    );
  }
}

Cart.propTypes = {
  cart: React.PropTypes.array
};

Cart.defaultProps = {
  cart: []
};

function mapStateToProps ({ cart }) {
  return {
    cart: cart.cartItems,
    totalCartItems: cart.totalCartItems,
    totalCartPrice: cart.totalCartPrice
  }
}
export default connect(mapStateToProps, {
  addDrinkToCart,
  removeItemFromCart,
  clearCart,
  cartCountTotalItems,
  cartCountTotalPrice
})
(Cart);


