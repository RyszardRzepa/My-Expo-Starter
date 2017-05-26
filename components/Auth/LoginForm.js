import React, { Component, PropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import { Spinner } from '../common/Spinner'
import CustomTextInput from '../common/CustomTextInput'
import metrics from '../../config/metrics'
import { loginUser } from '../../actions';

class LoginForm extends Component {
  static propTypes = {}

  state = {
    email: '',
    password: '',
  };

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ])
    }
  };

  goToMapView = () => {
    return this.props.navigate();
  }

  onButtonPress () {
    const { email, password } = this.state;

    this.props.loginUser(email, password, this.goToMapView);
  }

  renderError () {
    if (this.props.error) {
      return <Text style={{ color: 'red', fontSize: 18 }}>
        {this.props.error}
      </Text>
    }
  }

  renderButton () {
    if (this.props.isLoading) {
      return <Spinner size="large"/>;
    }

    return <Button
      onPress={() => this.onButtonPress()}
      buttonStyle={styles.loginButton}
      textStyle={styles.loginButtonText}
      title="Login"
    />
  }

  render () {
    const { email, password } = this.state
    const { isLoading, onSignupLinkPress } = this.props
    const isValid = email !== '' && password !== ''
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={(ref) => {
          this.formRef = ref
        }}>
          <CustomTextInput
            name={'email'}
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
            name={'password'}
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
          {this.renderError()}
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            {this.renderButton()}
          </View>
          <Text
            ref={(ref) => this.linkRef = ref}
            style={styles.signupLink}
            onPress={onSignupLinkPress}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Not registered yet?'}
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
  loginButton: {
    backgroundColor: '#fff'
  },
  loginButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  signupLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 20
  }
})

const mapStateToProps = ({ auth }) => {
  const { error, isLoading } = auth;

  return { error, isLoading };
};

export default connect(mapStateToProps, { loginUser })(LoginForm);