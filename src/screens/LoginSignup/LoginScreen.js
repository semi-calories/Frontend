//
//로그인 화면
//

import React, { useLayoutEffect, useState } from "react";

import {StyleSheet} from "react-native";

import { RootView } from "~/components/rootView";
import { BackHeader } from "~/components/header";
import { BasicTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";

import { scale, verticalScale } from "~/constants/globalSizes";

const LoginScreen = ({navigation}) => {
    const [email, onChangeEmail] = useState();
    const [password, onChangePassword] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header:  () => <BackHeader back backPress={() => navigation.goBack()}/>
        });
      }, [navigation]);


    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput type="light" text={email} onChangeText={onChangeEmail} placeholder="이메일" width = {scale(298)}/>
            <BasicTextInput type="light" text={password} onChangeText={onChangePassword} placeholder="비밀번호" width = {scale(298)}/>
            <PrimaryButton text='로그인' onPress={() => navigation.navigate('MainTab')} btnStyle={styles.btn}/>
        </RootView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
    },

    btn:{
        marginTop:verticalScale(20)
    },
});