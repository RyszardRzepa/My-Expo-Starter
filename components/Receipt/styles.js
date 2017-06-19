import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = {
  cafeName: {
    fontFamily: 'raleway-semibold',
    marginTop: -10,
    fontSize: 20,
  },
  cafeAddress: {
    fontFamily: 'raleway-light',
    fontSize: 14,
    margin: 5,
  },
  name: {
    fontFamily: 'raleway-semibold',
    fontSize: 16,
    lineHeight: 20,
    color: '#444444',
    padding: 5
  },
  size: {
    fontFamily: 'raleway-light',
    fontSize: 16,
    lineHeight: 20,
    color: '#444',
    margin: 5,
  },
  priceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5
  },
  mvaContainer: {
    marginHorizontal: 5,
    justifyContent: 'space-between',
    marginTop: height * 0.15,
    flexDirection: 'row'
  }
};

export default styles;