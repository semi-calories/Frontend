//
//로그인 화면
//

import React, { useLayoutEffect, useState } from "react";

import { StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { BasicTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";

import { USER_INFO } from "~/constants/asyncStoragekey";

import { scale, verticalScale } from "~/constants/globalSizes";

import { login } from "~/apis/api/loginSignup";
import { getUserInfo } from "~/apis/services/user";


const LoginScreen = ({ navigation }) => {
    const [email, onChangeEmail] = useState();
    const [password, onChangePassword] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    const onPressLogin = () => {
        const { user, error } = handleLogin()

        if (user) {
            storeData(user)

            navigation.navigate('MainTab')
        } else {
            Alert.alert(error)
        }

       // navigation.navigate('MainTab')
    }

    const handleLogin = async () => {
        const userInfo = { email, password }

        try {
            const rawResponse = await login(userInfo)
            const response = await getUserInfo(rawResponse)
            return response
        } catch (err) {
            console.log(err)
        }
    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(USER_INFO, jsonValue);
        } catch (e) {
            console.log(e)
        }
    };


    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput type="light" text={email} onChangeText={onChangeEmail} placeholder="이메일" width={scale(298)} />
            <BasicTextInput type="light" text={password} onChangeText={onChangePassword} placeholder="비밀번호" width={scale(298)} />
            <PrimaryButton text='로그인' onPress={onPressLogin} btnStyle={styles.btn} />
        </RootView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    btn: {
        marginTop: verticalScale(20)
    },
});