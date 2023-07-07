//
//회원가입 화면
//

import React, { useLayoutEffect, useState } from "react";

import {StyleSheet} from "react-native";

import { RootView } from "~/components/rootView";
import { BackHeader } from "~/components/header";
import { BasicTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";

import { scale, verticalScale } from "~/constants/globalSizes";

const SignupScreen = ({navigation}) => {
    const [email, onChangeEmail] = useState();
    const [password, onChangePassword] = useState();
    const [nickname, onChangeNickname] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header:  () => <BackHeader back backPress={() => navigation.goBack()}/>
        });
      }, [navigation]);


    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput type="light" text={email} onChangeText={onChangeEmail} placeholder="이메일" width = {scale(298)}/>
            <BasicTextInput type="light" text={password} onChangeText={onChangePassword} placeholder="비밀번호" width = {scale(298)}/>
            <BasicTextInput type="light" text={nickname} onChangeText={onChangeNickname} placeholder="닉네임" width = {scale(298)}/>
            <PrimaryButton text='회원가입' onPress={() => navigation.navigate('UserInfoEditScreen')} btnStyle={styles.btn}/>
        </RootView>
    );
}

export default SignupScreen;

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
    },

    btn:{
        marginTop:verticalScale(20)
    },
});