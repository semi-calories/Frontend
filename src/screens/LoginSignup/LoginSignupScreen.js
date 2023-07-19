//
// 로그인/회원가입 화면
//

import React from "react";

import { Image, StyleSheet, View } from "react-native";

import { RootView } from "~/components/rootView";
import { PrimaryButton } from "~/components/button";

import { scale, verticalScale } from "~/constants/globalSizes"; 

const LOGO = require('@assets/Logo.png');

const LoginSignupScreen = ({ navigation }) => {
    return (
        <RootView viewStyle={styles.container}>
            <View style={styles.imageView}>
            <Image source={LOGO} style={styles.image}/>
            </View>
            <View style={styles.btnView}>
                <PrimaryButton text='로그인' onPress={() => navigation.navigate('LoginScreen')} btnStyle={styles.btn}/>
                <PrimaryButton text='회원가입' onPress={() => navigation.navigate('SignupScreen')} btnStyle={styles.btn}/>
            </View>

        </RootView>
    );
}

export default LoginSignupScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },

    imageView:{
        paddingTop:verticalScale(310),
    },

    image:{
        width:scale(120),
        height:verticalScale(120),
    },

    btnView:{
        padding:verticalScale(100),
    },

    btn:{
        margin:scale(10),
    }
});