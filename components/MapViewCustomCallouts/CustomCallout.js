import React, { PropTypes } from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';
import styles from './styles';


class CustomCallout extends React.Component {
  render () {
    return (
      <View style={[styles.containerCustomCallout, this.props.style]}>
        <TouchableOpacity>
          <View style={styles.bubble}>
            <View style={styles.amount}>
              {this.props.children}
            </View>
          </View>
          <View style={styles.arrowBorder}/>
          <View style={styles.arrow}/>
        </TouchableOpacity>
      </View>
    );
  }
}

CustomCalloutPropTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default CustomCallout;