import React, { Component } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  Text,
  LayoutAnimation,
  Alert,
  TouchableOpacity
} from "react-native";
import { Tile, List, ListItem, Icon, Button, CheckBox } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import ElevatedView from 'react-native-elevated-view';
import CheckBoxComponent from '../CheckBox';
import OrderView from '../OrderView';
import {
  addDrinkToCart,
  removeItemFromCart,
  clearCart,
  cartCountTotalItems,
  cartCountTotalPrice
} from '../../actions';

import colors from '../../theme/colors';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const iconSize = 35;
const basketIconSize = 25;
const iconColorMinus = colors.lightGrey;
const iconColorPlus = colors.lightGrey;

const CustomLayoutAnimation = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

class Cart extends Component {
  
  state = {
    checked: true,
    toggleFooter: true,
  };
  
  componentWillUpdate () {
    LayoutAnimation.configureNext(CustomLayoutAnimation);
  }
  
  renderHeaderCafeList = (coffee) => {
    return (
      <View style={{ backgroundColor: '#f1f2f3' }}>
        <List containerStyle={styles.listStyle }>
          <ElevatedView
            elevation={5}
          >
            <ListItem
              containerStyle={{ width: width * 0.9 }}
              roundAvatar={false}
              avatarStyle={styles.avatarStyle}
              avatar={{ uri: coffee.image }}
              key={coffee.name}
              title={coffee.name}
              rightIcon={{ name: 'keyboard-arrow-down' }}
              titleContainerStyle={{ alignItems: 'center' }}
            />
          </ElevatedView>
        </List>
      </View>
    );
  };
  
  checkCredits = (name, price, num, size, image, callback) => {
    const { credits } = this.props.userData;
    const { totalCartPrice } = this.props;
    
    if (credits <= totalCartPrice || (credits - totalCartPrice) < price) {
      Alert.alert(
        'Add Credits',
        `you have only ${credits - totalCartPrice} credits left`,
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
          { text: 'OK', onPress: () => console.log('OK Pressed!') },
        ]
      );
    } else {
      return callback(name, price, num, size, image);
    }
  };
  
  renderMinusButton = (item, name, size) => {
    if (item > 0) {
      return <View>
        <Icon
          size={iconSize}
          name='remove-circle'
          color={iconColorMinus}
          onPress={() => this.props.removeItemFromCart(name, size)}
        />
      </View>
    }
  };
  
  //TODO simplify renderAddToCart function
  renderAddToCart = ({ small, medium }, size, name, image) => {
    if (small && medium) {
      return (
        <View style={{ marginHorizontal: 5, backgroundColor: '#fff' }}>
          <ElevatedView elevation={5}>
            <View style={styles.productTypeRow}>
              <View style={styles.productInfoContainer}>
                <Text style={styles.drinkName}>{size.small}</Text>
                <Text style={styles.drinkPrice}>{small} kr</Text>
              </View>
              <View style={styles.iconPlusMinusContainer}>
                <Icon
                  size={iconSize}
                  name='add-circle'
                  color={iconColorPlus}
                  onPress={
                    () => this.checkCredits
                    (name, small, 1, size.small, image, this.props.addDrinkToCart)
                  }
                />
                <View style={{
                  flexDirection: 'row',
                }}>
                  {this.props.cart.map((item, i) => {
                    if (item.name === name && item.price === small) {
                      return <View key={i} style={{ flexDirection: 'row' }}>
                        <Text style={styles.points}>{item.count}</Text>
                        {this.renderMinusButton(item.count, name, size.small)}
                      </View>
                    }
                  })}
                </View>
              </View>
            </View>
            
            <View style={styles.productTypeRow}>
              <View style={styles.productInfoContainer}
              >
                <Text style={styles.drinkName}>{size.medium}</Text>
                <Text style={styles.drinkPrice}>{medium} kr</Text>
              </View>
              <View style={styles.iconPlusMinusContainer}>
                <Icon
                  size={iconSize}
                  name='add-circle'
                  color={iconColorPlus}
                  onPress={
                    () => this.checkCredits
                    (name, medium, 1, size.medium, image, this.props.addDrinkToCart)
                  }
                />
                <View style={{
                  flexDirection: 'row',
                }}>
                  {this.props.cart.map((item, i) => {
                    if (item.name === name && item.price === medium) {
                      return <View key={i} style={{ flexDirection: 'row' }}>
                        <Text style={styles.points}>{item.count}</Text>
                        {this.renderMinusButton(item.count, name, size.medium)}
                      </View>
                    }
                  })}
                </View>
              </View>
            </View>
          </ElevatedView>
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
      <Modal
        isOpen={this.props.isModalOpen}
        onClosed={() => this.setState({ toggleFooter: true })}
        style={styles.basketModal}
        position={"bottom"}
        ref={"modal"}
        swipeArea={150}>
        
        <OrderView
          icon={<Icon
            containerStyle={{ flex: 1 }}
            size={basketIconSize}
            name='remove-shopping-cart'
            color={iconColorMinus}
            onPress={() => {
              Alert.alert(
                'Empty basket',
                `Are you sure you want to empty your basket?`,
                [
                  { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                  { text: 'Yes', onPress: () => this.props.clearCart(), style: { color: 'red' } },
                ]
              );
            }}
          />}
          cart={this.props.cart}
          title="Your basket"
          addDrinkToCart={this.props.addDrinkToCart}
          removeItemFromCart={this.props.removeItemFromCart}
          totalCartItems={this.props.totalCartItems}
          totalCartPrice={this.props.totalCartPrice}
        />
        <CheckBoxComponent
          checked={this.state.checked}
          onPress={() => this.setState({ checked: !this.state.checked })}
        />
        <View style={styles.basketSummaryContainer}>
          <View style={styles.basketSummary}>
            <Text style={styles.size}> Items
              <Text style={styles.name}> {this.props.totalCartItems || 0}</Text>
            </Text>
            <Text style={styles.size}> Total:
              <Text style={styles.name}> {this.props.totalCartPrice || 0} kr</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.onConfirmOrder()}>
            <View
              style={{ backgroundColor: colors.orange,
                justifyContent: 'center',
                alignItems: 'center',
                height: height * 0.07
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}> Confirm Purchase</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  };
  
  onConfirmOrder = () => {
    const { address, name, pinCode } = this.props.data;
    if (!this.props.totalCartItems) {
      Alert.alert(
        'Empty Cart',
        `Add drink to the cart first`,
        [
          { text: 'OK', onPress: () => this.refs.modal.close() },
        ]
      );
      return;
    }
    this.props.navigation('cashier',
      {
        cart: this.props.cart,
        pinCode, name, address,
        takeAway: this.state.checked,
        total: this.props.totalCartPrice
      }
    )
  };
  
  showFooter = () => {
    if (this.state.toggleFooter) {
      return <TouchableOpacity onPress={() => {
        this.refs.modal.open();
        this.setState({ toggleFooter: false })
      }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: height * 0.07,
            width,
            backgroundColor: colors.darkBrown,
            flexDirection: 'row',
          }}>
          <Icon
            containerStyle={{ padding: 5 }}
            size={24}
            name='shopping-basket'
            color='#fff'
          />
          <View>
            <Text style={{ fontSize: 18, color: '#fff' }}> Total:</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'flex-end', width: 80 }}>
            <Text style={{ fontSize: 18, color: "#fff" }}> {this.props.totalCartPrice || 0} kr </Text>
          </View>
        </View>
      </TouchableOpacity>
    }
  };
  
  render () {
    const { image, address } = this.props.data;
    return (
      <View style={{ flex: 1, backgroundColor: '#f1f2f3' }}>
        <View>
          <Tile
            height={200}
            imageSrc={{ uri: image }}
            title={address}
            featured
            caption="Some Caption Text"
          />
        </View>
        <ScrollView style={{ position: 'relative' }}>
          <Accordion
            sections={this.props.data.menu}
            renderHeader={this.renderHeaderCafeList.bind(this)}
            renderContent={this.renderContentCafeList.bind(this)}
          />
        </ScrollView>
        {this.renderBasket()}
        {this.showFooter()}
      </View>
    );
  }
}

CartPropTypes = {
  cart: React.PropTypes.array,
  userData: React.PropTypes.object,
  totalCartItems: React.PropTypes.number,
  totalCartPrice: React.PropTypes.number,
  data: React.PropTypes.object,
};

Cart.defaultProps = {
  cart: []
};

function mapStateToProps ({ cart, auth }) {
  return {
    cart: cart.cartItems,
    totalCartItems: cart.totalCartItems,
    totalCartPrice: cart.totalCartPrice,
    userData: auth.userData,
    isModalOpen: cart.isModalOpen
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


