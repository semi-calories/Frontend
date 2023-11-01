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

import { rWidth, rHeight } from "~/constants/globalSizes";

import { login } from "~/apis/api/loginSignup";
import { getLoginInfo } from "~/apis/services/loginSignup";
import { getInfo } from "~/apis/api/user";

const LoginScreen = ({ navigation }) => {
    const [email, onChangeEmail] = useState();
    const [password, onChangePassword] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    const handleLogin = async () => {
        if (!(email && password)) {
            Alert.alert('항목들을 모두 입력해주세요.')
            return;
        }

        const userInfo = {
            userEmail: email,
            userPassword: password
        }

        try {
            const rawResponse = await login(userInfo)
            const { user, error } = getLoginInfo(rawResponse)

            if (user) {
                const userData = await getInfo({ userCode: user.userCode })
                StoreUserData({ ...userData, userCode: user.userCode })

                navigation.navigate('MainTab')
            } else {
                Alert.alert(error)
            }
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput value={email} onChangeText={onChangeEmail} placeholder="이메일" width={rWidth(298)} valid/>
            <BasicTextInput value={password} onChangeText={onChangePassword} placeholder="비밀번호" width={rWidth(298)} password valid/>
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
        marginTop: rHeight(20)
    },
});