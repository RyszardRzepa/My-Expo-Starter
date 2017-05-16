import React, { Component } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  Text,
  Image
} from "react-native";
import { Tile, List, ListItem, Icon, Button } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';

import styles from './styles/cart_styles';

const { width, height } = Dimensions.get('window');
const iconSize = 30;
const iconColorMinus = '#f94057';
const iconColorPlus = '#2cc860';
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
  renderAddToCart = ({ small, medium }, size, name, image) => {
    if (small && medium) {
      return (
        <View style={{ backgroundColor: '#fff' }}>
          <View style={styles.productTypeRow}>
            <Text style={styles.drinkName}>{size.small}</Text>
            <Text style={styles.drinkPrice}>{small} kr</Text>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Icon
                  size={iconSize}
                  name='add-circle-outline'
                  color={iconColorPlus}
                  onPress={
                    () => this.props.addDrinkToCart(name, small, 1, size.small, image)
                  }
                />
              </View>
              <View style={styles.pointsBox}>
                {this.props.cart.map((item, i) => {
                  if (item.name === name && item.price === small) {
                    return <Text style={styles.points} key={i}>{item.count}</Text>
                  }
                })}
              </View>
              <View>
                <Icon
                  size={iconSize}
                  name='remove-circle-outline'
                  color={iconColorMinus}
                  onPress={() => this.props.removeItemFromCart(name, size.small)}
                />
              </View>
            </View>
          </View>
          
          <View style={styles.productTypeRow}>
            <Text style={styles.drinkName}>{size.medium}</Text>
            <Text style={styles.drinkPrice}>{medium} kr</Text>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Icon
                  size={iconSize}
                  name='add-circle-outline'
                  color={iconColorPlus}
                  onPress={
                    () => this.props.addDrinkToCart(name, medium, 1, size.medium, image)
                  }
                />
              </View>
              <View style={styles.pointsBox}>
                {this.props.cart.map((item, i) => {
                  if (item.name === name && item.price === medium) {
                    return <Text style={styles.points} key={i}>{item.count}</Text>
                  }
                })}
              </View>
              <View>
                <Icon
                  size={iconSize}
                  name='remove-circle-outline'
                  color={iconColorMinus}
                  onPress={() => this.props.removeItemFromCart(name, size.medium)}
                />
              </View>
            </View>
          </View>
        </View>
      )
    }
    return <Text> only one size</Text>
  };
  
  renderContentCafeList ({ price, size, name, image }) {
    return (
      <ScrollView>
        {this.renderAddToCart(price, size, name, image)}
      </ScrollView>
    );
  }
  
  renderBasket = () => {
    return (
      <Modal style={styles.basketModal} position={"center"} ref={"cartModal"} swipeArea={150}>
        <View style={{ marginRight: 15, marginTop: 15, width: 280, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View />
          <Icon
            size={iconSize}
            name='remove-shopping-cart'
            color={iconColorMinus}
            onPress={() => this.props.clearCart()}
          />
        </View>
        <View style={styles.basketContentContainer}>
          <Text style={styles.orderTitel}>Check the order!</Text>
          <ScrollView style={{ width: 280 }}>
            {this.props.cart.map((item, i) => {
              if (item.count)
                return <View key={i} style={styles.driver}>
                  <View style={styles.avatarBox}>
                    <Image style={styles.avatar} source={{ uri: item.image }}/>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.size}>{item.size}</Text>
                  </View>
                  <View>
                    <Icon
                      size={iconSize}
                      name='add-circle-outline'
                      color={iconColorPlus}
                      onPress={
                        () => this.props.addDrinkToCart(item.name, item.price, 1, item.size)
                      }
                    />
                  </View>
                  <View style={styles.pointsBox}>
                    <Text style={styles.points}>{item.count}</Text>
                  </View>
                  <View>
                    <Icon
                      size={iconSize}
                      name='remove-circle-outline'
                      color={iconColorMinus}
                      onPress={() => this.props.removeItemFromCart(item.name, item.size)}
                    />
                  </View>
                </View>
            })}
          </ScrollView>
        </View>
        <View style={styles.basketSummaryContainer}>
          <View style={styles.basketSummary}>
            <Text style={styles.size}> Items
              <Text style={styles.name}> {this.props.totalCartItems || 0}</Text>
            </Text>
            <Text style={styles.size}> Total:
              <Text style={styles.name}> {this.props.totalCartPrice || 0} kr</Text>
            </Text>
          </View>
          <Button raised title='Confirm Order'/>
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
            onPress={() => {
              this.refs.cartModal.open()
            }}
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


