import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image} from 'react-native';
import { Icon } from 'react-native-elements';

import styles from './styles';

const iconSize = 30;
const iconColorMinus = '#f94057';
const iconColorPlus = '#2cc860';
const { width, height } = Dimensions.get('window');

class OrderView extends Component {
  renderIconsAddToCart = (item) => {
    const { addDrinkToCart, removeItemFromCart } = this.props;
    if (addDrinkToCart && removeItemFromCart) {
      return <View>
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
    }
  };
  
  render () {
    return (
      <View style={styles.basketContentContainer}>
        <Text style={styles.orderTitel}>{this.props.title}</Text>
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
                {this.renderIconsAddToCart(item)}
              </View>
          })}
        </ScrollView>
      </View>
    )
  }
}

export default OrderView;