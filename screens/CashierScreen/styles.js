import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = {
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center'
  },
  orderContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
  },
  buttonContainer: {
    height: height * 0.08,
    backgroundColor: '#51ade8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStyle: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#dcd5d9',
    backgroundColor: '#3c3c3c'
  },
  basketContentContainer: {
    flex: 2,
    width,
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
    color: '#fff',
    fontFamily: 'raleway-semibold',
    fontSize: 16,
    marginBottom: 15,
    marginTop: 15,
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