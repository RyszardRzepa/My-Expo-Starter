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

import styles from './styles/details';

const { width, height } = Dimensions.get('window');

class Details extends Component {
  
  state = {
    cart: this.props.cart,
    countItem: 0
  };
  
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
        <View>
          <View
            style={{
              margin: 10,
              marginVertical: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text>{size.small}</Text>
            <Text>{small} kr</Text>
            
            <View style={{ flexDirection: 'row' }}>
              <Icon
                size={25}
                name='add-circle-outline'
                color='green'
                onPress={() => {
                  this.props.addDrink(name, small, 1, size.small);
                  this.forceUpdate()
                }}
              />
              
              
              {this.props.cart.map((item, i) => {
                console.log("cart item", item, i);
                if (i === 0 && item.name === name && item.price === small) {
                  return <Text key={Math.random()}>{item.count}</Text>
                }
              })}
              
              <Icon
                size={25}
                name='remove-circle-outline'
                color='red'
                onPress={() => {
                  this.props.removeItemFromCart(name, size.small);
                  this.forceUpdate()
                }}
              />
            </View>
          </View>
          
          <View
            style={{
              margin: 10,
              marginVertical: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text>{size.medium}</Text>
            <Text>{medium} kr</Text>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                size={25}
                name='add-circle-outline'
                color='green'
                onPress={() => {
                  this.props.addDrink(name, medium, 1, size.medium);
                  this.forceUpdate()
                }}
              />
              {this.props.cart.map((item, i) => {
                if (i === 1 && item.name === name && item.price === medium) {
                  return <Text key={Math.random()}>{item.count}</Text>
                }
              })}
              <Icon
                size={25}
                name='remove-circle-outline'
                color='red'
                onPress={() => {
                  this.props.removeItemFromCart(name, size.medium);
                  this.forceUpdate()
                }}
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
      <Modal style={{ height: 400, width: 300, justifyContent: 'center', alignItems: 'center' }}
             position={"center"}
             ref={"cartModal"}
             swipeArea={500}
      >
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          <Text>Check the order!</Text>
          {this.props.cart.map((item) => {
            return <View key={Math.random()} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{item.name}</Text>
              <Text>{item.size}</Text>
              <Text>{item.count}</Text>
            </View>
          })}
          <Button raised icon={{name: 'cached'}} title='BUTTON WITH ICON'/>
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
            onPress={() => this.refs.cartModal.open()}
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

function mapStateToProps ({ cart }, ownProps) {
  return {
    cart: cart.cartItems
  }
}

export default connect(mapStateToProps)(Details);


