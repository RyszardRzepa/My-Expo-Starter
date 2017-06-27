import React, { Component, PropTypes } from 'react';
import { View, Text, ScrollView, Dimensions, Image } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import moment from 'moment';

import colors from '../../theme/colors';
import styles from './styles';

const iconSize = 35;
const iconColorMinus = colors.lightGrey;
const iconColorPlus = colors.lightGrey;
const { width, height } = Dimensions.get('window');

class OrderView extends Component {
  
  showReceiptTitle = (props) => {
    if (!this.props.date) {
      return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {props.cashierReceiptView ? <View /> : <View style={{ flex: 1 }}/> }
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 2,
        }}>
          <Text style={[styles.orderTitel, this.props.titleStyle]}>{props.title}</Text>
        </View>
        {props.icon}
      </View>
    } else {
      return <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}/>
        <Image source={require('../../assets/icons/ccLogo.png')}/>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View>
            <Text style={{ fontSize: 18 }}>Coffee Cloud</Text>
            <Text style={{ fontSize: 14 }}>Org.nr: 9821234</Text>
            <Text style={{ fontSize: 14 }}>Date: {moment(props.date).format('MMM Do YY')}</Text>
          </View>
        </View>
      </View>
    }
  };
  
  renderIconsAddToCart = (item) => {
    const { addDrinkToCart, removeItemFromCart } = this.props;
    if (addDrinkToCart && removeItemFromCart) {
      return (
        <View style={styles.iconPlusMinusContainer}>
          <Icon
            size={iconSize}
            name='add-circle'
            color={iconColorPlus}
            onPress={() => this.props.addDrinkToCart(item.name, item.price, 1, item.size)}
          />
          <View style={styles.pointsBox}>
            <Text style={styles.points}>{item.count}</Text>
          </View>
          <View>
            <Icon
              size={iconSize}
              name='remove-circle'
              color={iconColorMinus}
              onPress={() => this.props.removeItemFromCart(item.name, item.size)}
            />
          </View>
        </View>
      )
    }
  };
  
  countItem = (item) => {
    if (!this.props.addDrinkToCart)
      return (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.name}>{item.count}</Text>
        </View>
      )
  };
  
  render () {
    return (
      <View style={[styles.basketContentContainer]}>
        {this.showReceiptTitle(this.props)}
        {this.props.children}
        <Divider style={{ marginHorizontal: 10, width }}/>
        
        <ScrollView style={[{ width }, this.props.style]}>
          {this.props.cart.map((item, i) => {
            if (item.count)
              return <View key={i} style={styles.productTypeRow}>
                <View style={styles.avatarBox}>
                  <Image style={styles.avatar} source={{ uri: item.image }}/>
                </View>
                <View style={styles.info}>
                  <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                </View>
                <View style={[styles.info, { flexDirection: 'row' }]}>
                  <Text style={styles.size}>{item.size}</Text>
                  {this.countItem(item)}
                </View>
                {this.renderIconsAddToCart(item)}
              </View>
          })}
        </ScrollView>
      </View>
    )
  }
}
OrderView.defaultProps = {
  cart: []
};

OrderViewPropTypes = {
  cart: PropTypes.array,
  addDrinkToCart: PropTypes.num,
  removeItemFromCart: PropTypes.num
  
};

export default OrderView;