import React, { Component } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  Text
} from "react-native";
import { connect } from 'react-redux';
import { Tile, List, ListItem, Icon, Button } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modalbox';

import { addDrink, removeItemFromCart } from '../actions'
import styles from './styles/details';

const { width, height } = Dimensions.get('window');

class Details extends Component {
  
  state = {
    cart: [
      {
        name: 'Empty',
        price: 0,
        count: 0
      }
    ]
  };
  
  componentWillUpdate(nextProps) {
    console.log("nextProps from the store ------", nextProps.cart)
    if (nextProps.cart !== this.props.cart) {
      this.setState({
        cart: nextProps.cart,
      });
    }
  }
  
  componentWillReceiveProps (nextProps) {
    this.setState({ cart: nextProps })
  }
  
  renderHeader = (coffee) => {
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
  
  renderContent ({ price, size, name }) {
    const priceMedium = price.medium;
    const sizeMedium = size.medium;
    
    const priceSmall = price.small;
    const sizeSmall = size.small;
    
    return (
      <ScrollView>
        <View>
          <View
            style={{
              margin: 10,
              marginVertical: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <Text>{priceMedium}</Text>
            <Text>{sizeMedium}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                size={25}
                name='add-circle-outline'
                color='green'
                onPress={() => {
                  this.props.addDrink(name, priceMedium, 1)
                }}
              />
              {this.props.cart.map(i => <Text key={i.count}>{i.count}</Text>)}
              <Icon
                size={25}
                name='remove-circle-outline'
                color='red'
                onPress={() => this.props.removeItemFromCart(name)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
  
  renderBasket = () => {
    return (
      <Modal style={{ height: 400, width: 300, justifyContent: 'center', alignItems: 'center' }}
             position={"center"}
             ref={"cartModal"}
             swipeArea={500}
      >
        <Text>Check the order!</Text>
        {this.props.cart.map((item) => {
          return <View key={Math.random()} style={{ flex: 1 }}>
            <Text>{item.name}</Text>
            <Text>{item.count}</Text>
          </View>
        })}
        <Button
          buttonStyle={{ justifyContent: 'center', }}
          raised
          icon={{ name: 'cached' }}
          title='Confirm Order'/>
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
            onPress={() => this.refs.cartModal.open()}
          />
        </View>
        <ScrollView>
          <Accordion
            sections={this.props.data.menu}
            renderHeader={this.renderHeader.bind(this)}
            renderContent={this.renderContent.bind(this)}
          />
        </ScrollView>
        
        <View style={{ position: 'absolute', top: 0, marginBottom: 150 }}>
          {this.renderBasket()}
        </View>
      </View>
    );
  }
}

Details.propTypes = {
  cart: React.PropTypes.array
};

Details.defaultProps = {
  cart: [
    {
      name: 'Empty',
      price: 0,
      count: 0
    }
  ]
};

function mapStateToProps ({ cart }) {
  return {
    cart: cart.cartItems
  }
}
export default connect(mapStateToProps, { addDrink, removeItemFromCart })(Details);


