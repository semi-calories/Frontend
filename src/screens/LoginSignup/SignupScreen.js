//
//회원가입 화면
//

import React, { useLayoutEffect, useState } from "react";

import { StyleSheet, Alert } from "react-native";

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { BasicTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";

import { scale, verticalScale } from "~/constants/globalSizes";
import { UserInfoType } from "~/constants/type";

import { signup, emailDuplicateCheck } from "~/apis/api/loginSignup";

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);


    const handleSignup = async () => {
        const signupInfo = { email, password, name }

        if (email && password && name) {
            try {
                const { duplicateResult } = await emailDuplicateCheck({email : email})

                if (duplicateResult) {
                    Alert.alert('해당 이메일로 가입된 계정이 있습니다.')
                } else {
                    const { response: userCode } = await signup(signupInfo)
                    console.log(userCode)

                    const userInfo = { name, userCode, image: null, email}

                    if (userCode) {
                        Alert.alert('회원가입 완료!')
                        navigation.navigate('UserInfoEditScreen', { userInfo, infoType: UserInfoType.init })
                    } else {
                        Alert.alert('회원가입 불가')
                    }
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            Alert.alert('항목들을 모두 입력해주세요.')
        }
    }


    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput type="light" text={email} onChangeText={setEmail} placeholder="이메일" width={scale(298)} />
            <BasicTextInput type="light" text={password} onChangeText={setPassword} placeholder="비밀번호" width={scale(298)} password/>
            <BasicTextInput type="light" text={name} onChangeText={setName} placeholder="이름" width={scale(298)} />
            <PrimaryButton text='회원가입' onPress={handleSignup} btnStyle={styles.btn} />
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