//
//로그인 화면
//

import React, { useLayoutEffect, useState } from "react";

import { StyleSheet, Alert } from "react-native";

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { BasicTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";
import { StoreUserData } from "~/components/asyncStorageData";

import { scale, verticalScale } from "~/constants/globalSizes";

import { login } from "~/apis/api/loginSignup";
import { getLoginInfo } from "~/apis/services/loginSignup";

const LoginScreen = ({ navigation }) => {
    const [email, onChangeEmail] = useState();
    const [password, onChangePassword] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    const handleLogin = async () => {
        const userInfo = { 
            userEmail: email,
            userPassword: password
        }

        if (email && password) {
            try {
                const rawResponse = await login(userInfo)
                const { user, error } = getLoginInfo(rawResponse)

                if (user) {
                    StoreUserData(user)
        
                    navigation.navigate('MainTab')
                } else {
                    Alert.alert(error)
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            Alert.alert('아이디 또는 비밀번호를 입력해주세요.')
        }
    }


    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput type="light" text={email} onChangeText={onChangeEmail} placeholder="이메일" width={scale(298)} />
            <BasicTextInput type="light" text={password} onChangeText={onChangePassword} placeholder="비밀번호" width={scale(298)} password/>
            <PrimaryButton text='로그인' onPress={handleLogin} btnStyle={styles.btn} />
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