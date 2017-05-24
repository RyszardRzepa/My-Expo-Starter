import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = {
  orderContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6'
  },
  buttonStyle: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#dcd5d9'
  },
  basketContentContainer: {
    flex: 2,
    width: width * 0.8,
    flexDirection: 'column',
    alignItems: 'center'
  },
  cafeName: {
    fontFamily: 'raleway-semibold',
    fontSize: 20,
    marginTop: 15,
  },
  cafeAddress: {
    fontFamily: 'raleway-light',
    fontSize: 14,
    margin: 5,
  },
  pinCodeInfo: {
    fontFamily: 'raleway-semibold',
    fontSize: 16,
    marginBottom: 10,
    marginHorizontal: 10,
    textAlign: 'center'
  },
  info: {
    marginTop: 5,
    flex: 1,
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
  countContainer: {
    alignItems: 'center',
    width: 10,
  },
  count: {
    marginTop: 5,
    color: '#3c3c3c',
    fontFamily: 'raleway-semibold',
    textAlign: 'right',
    fontSize: 16,
    lineHeight: 20
  },
};

export default styles;