import React, { Component, PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import { Spinner } from '../common/Spinner';
import CustomButton from '../common/CustomButton'
import CustomTextInput from '../common/CustomTextInput'
import metrics from '../../config/metrics'
import { registerUser } from '../../actions';

class SignupForm extends Component {

  state = {
    email: '',
    password: '',
  }

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ])
    }
  }

  renderButton () {
    if (this.props.isLoading) {
      return <Spinner size="large"/>;
    }

    return <Button
      onPress={() => this.onHandleRegister()}
      buttonStyle={styles.loginButton}
      textStyle={styles.loginButtonText}
      title="Create Account"
    />
  }

  goToMapView = () => {
    return this.props.navigate();
  }

  onHandleRegister = () => {
    const { email, password } = this.state;
    this.props.registerUser(email, password, this.goToMapView)
  }

  render () {
    const { email, password } = this.state
    const { isLoading, onLoginLinkPress, onSignupPress } = this.props
    const isValid = email !== '' && password !== ''
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={(ref) => this.formRef = ref}>
          <CustomTextInput
            ref={(ref) => this.emailInputRef = ref}
            placeholder={'Email'}
            keyboardType={'email-address'}
            editable={!isLoading}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.passwordInputRef.focus()}
            onChangeText={(value) => this.setState({ email: value })}
            isEnabled={!isLoading}
          />
          <CustomTextInput
            ref={(ref) => this.passwordInputRef = ref}
            placeholder={'Password'}
            editable={!isLoading}
            returnKeyType={'done'}
            secureTextEntry={true}
            withRef={true}
            onChangeText={(value) => this.setState({ password: value })}
            isEnabled={!isLoading}
          />
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            {this.renderButton()}
          </View>
          <Text
            ref={(ref) => this.linkRef = ref}
            style={styles.loginLink}
            onPress={onLoginLinkPress}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Already have an account?'}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: 'center'
  },
  createAccountButton: {
    backgroundColor: 'white'
  },
  createAccountButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  loginLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 20
  },
  loginButton: {
    backgroundColor: '#fff'
  },
  loginButtonText: {
    color: '#4c565f',
    fontWeight: 'bold'
  }
})

const mapStateToProps = ({ auth }) => {
  const { error, isLoading } = auth;

  return { error, isLoading };
};

export default connect(mapStateToProps, { registerUser })(SignupForm);