//
//회원가입 화면
//

import React, { useLayoutEffect, useState } from "react";

import { StyleSheet,Alert } from "react-native";

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { BasicTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";

import { scale, verticalScale } from "~/constants/globalSizes";
import { UserInfoType } from "~/constants/type";

import { signup } from "~/apis/api/loginSignup";
import { getSignupInfo } from "~/apis/services/loginSignup";

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [userName, setUserName] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    const onPressSignup = () => {
        const { response } = handleSignup()

        if (response) {
            Alert.alert('회원가입 완료!')
            navigation.navigate('UserInfoEditScreen', { userName: userName, infoType: UserInfoType.init })
        } else {
            Alert.alert('회원가입 불가')
        }

        navigation.navigate('UserInfoEditScreen', { userName: userName, infoType: UserInfoType.init })
    }

    const handleSignup = async () => {
        const signupInfo = { email, password, name: userName }

        try {
            const rawResponse = await signup(signupInfo)
            const response = await getSignupInfo(rawResponse)
            return response
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput type="light" text={email} onChangeText={setEmail} placeholder="이메일" width={scale(298)} />
            <BasicTextInput type="light" text={password} onChangeText={setPassword} placeholder="비밀번호" width={scale(298)} />
            <BasicTextInput type="light" text={userName} onChangeText={setUserName} placeholder="이름" width={scale(298)} />
            <PrimaryButton text='회원가입' onPress={onPressSignup} btnStyle={styles.btn} />
        </RootView>
    );
}

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    btn: {
        marginTop: verticalScale(20)
    },
});