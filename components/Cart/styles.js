import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = {
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
  clearBasket: {
    marginRight: 15,
    marginTop: 15,
    width: 280,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listStyle: {
    marginTop: 2.5,
    marginBottom: 2,
    marginHorizontal: 5,
    flex: 1,
    backgroundColor: '#fff'
  },
  avatarStyle: {
    height: 60,
    width: 60
  },
  productTypeRow: {
    margin: 10,
    marginVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6'
    
  },
  basketModal: {
    height: height * 0.8,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  basketContentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: '#dcd5d9',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5
  },
  orderTitel: {
    fontFamily: 'raleway-semibold',
    fontSize: 20,
    margin: 15,
  },
  container: {
    flex: 1
  },
  driver: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6'
  },
  avatarBox: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 10,
    position: 'relative',
    zIndex: 10,
    top: 3,
  },
  avatar: {
    position: 'relative',
    top: 0,
    right: 0,
    zIndex: 2,
    width: 35,
    height: 35
  },
  info: {
    marginTop: 5,
    flex: 1,
  },
  size: {
    fontFamily: 'raleway-light',
    fontSize: 16,
    lineHeight: 20,
    color: '#444',
    margin: 5,
  },
  name: {
    fontFamily: 'raleway-semibold',
    fontSize: 16,
    lineHeight: 20,
    color: '#444444',
    padding: 5
  },
  drinkName: {
    fontFamily: 'raleway-medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#444444'
  },
  drinkPrice: {
    fontFamily: 'raleway-semibold',
    fontSize: 16,
    lineHeight: 20,
    color: '#3c3c3c'
  },
  pointsBox: {
    alignItems: 'center',
    width: 10,
  },
  points: {
    color: '#3c3c3c',
    fontFamily: 'raleway-semibold',
    textAlign: 'right',
    fontSize: 16,
    lineHeight: 20
  },
  basketSummaryContainer: {
    margin: 10,
    bottom: 20,
    flexDirection: 'column',
    width: width * 0.9
  },
  basketSummary: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6'
  },
  totalNumberItemsBasket: {
      fontFamily: 'raleway-medium',
      fontSize: 16,
      lineHeight: 20,
      color: '#444'
  }
};

export default styles;