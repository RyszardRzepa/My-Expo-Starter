import React, { Component } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  Text,
  Image,
  LayoutAnimation,
  Alert,
  TouchableOpacity
} from "react-native";
import { Tile, List, ListItem, Icon, Button, CheckBox } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import ElevatedView from 'react-native-elevated-view';

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
const iconSize = 30;
const iconColorMinus = '#f94057';
const iconColorPlus = '#2cc860';

const CustomLayoutAnimation = {
  duration: 100,
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
  
  //TODO simplify renderAddToCart function
  renderAddToCart = ({ small, medium }, size, name, image) => {
    if (small && medium) {
      return (
        <View style={{ marginHorizontal: 5, backgroundColor: '#fff' }}>
          <ElevatedView
            elevation={5}
          >
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
                      () => this.checkCredits
                      (name, small, 1, size.small, image, this.props.addDrinkToCart)
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
                      () => this.checkCredits
                      (name, medium, 1, size.medium, image, this.props.addDrinkToCart)
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
        <View
          style={styles.clearBasket}>
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
          <ScrollView style={{ width: width * 0.9 }}>
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
        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              center
              title='Yes'
              checked={this.state.checked}
              onPress={() => this.setState({ checked: !this.state.checked })}
            />
            <Text> Take away? </Text>
            <CheckBox
              center
              title='No'
              checked={!this.state.checked}
              onPress={() => this.setState({ checked: !this.state.checked })}
            />
          </View>
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
          <Button onPress={() => this.onConfirmOrder()} raised title='Confirm Order'/>
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
            justifyContent: 'center',
            height: height * 0.07,
            width,
            backgroundColor: colors.superLightGrey,
            flexDirection: 'row'
          }}>
          <Icon
            containerStyle={{ padding: 5 }}
            size={24}
            name='shopping-basket'
            color={colors.lightBlack}
          />
          <View style={{ justifyContent: 'center', padding: 5 }}>
            <Text style={{ fontSize: 16 }}> Total:</Text>
          </View>
          <View style={{ justifyContent: 'center', padding: 5, width: 80 }}>
            <Text style={{ fontSize: 16 }}> {this.props.totalCartPrice || 0} kr </Text>
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

Cart.propTypes = {
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
    isModalOpen: cart.closeModal
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


