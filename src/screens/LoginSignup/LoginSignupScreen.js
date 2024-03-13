//
// 로그인/회원가입 화면
//

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Image } from 'expo-image';

import { PrimaryButton } from '~/components/button';
import { RootView } from '~/components/container';

import { rWidth, rHeight } from '~/styles/globalSizes';

const LOGO = require('~/assets/Logo.png');

const LoginSignupScreen = ({ navigation }) => {
  return (
    <RootView viewStyle={styles.container}>
      <View style={styles.imageView}>
        <Image source={LOGO} style={styles.image} />
      </View>
      <View style={styles.btnView}>
        <PrimaryButton
          text="로그인"
          onPress={() => navigation.navigate('LoginScreen')}
          btnStyle={styles.btn}
        />
        <PrimaryButton
          text="회원가입"
          onPress={() => navigation.navigate('SignupScreen')}
          btnStyle={styles.btn}
        />
      </View>
    </RootView>
  );
};

export default LoginSignupScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  imageView: {
    paddingTop: rHeight(310),
  },

  image: {
    // width:rWidth(120),
    // height:rHeight(120),
    width: rHeight(120),
    height: rHeight(120),
  },

  btnView: {
    padding: rHeight(100),
  },

  btn: {
    margin: rWidth(10),
  },
});
