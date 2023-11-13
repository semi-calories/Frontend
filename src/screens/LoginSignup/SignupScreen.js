//
//회원가입 화면
//

import React, { useLayoutEffect, useState } from "react";

import { StyleSheet, Alert } from "react-native";

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { BasicTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";

import { emailRegex, passwordRegex, nameRegex } from "~/components/regex";

import { rWidth, rHeight } from "~/constants/globalSizes";
import { UserInfoType } from "~/constants/type";

import { signup, emailDuplicateCheck } from "~/apis/api/loginSignup";
import { getSignupInfo } from "~/apis/services/loginSignup";

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
        if (!(email && password && name)) {
            Alert.alert('항목들을 모두 입력해주세요.')
            return;
        }

        if (!(emailRegex.test(email) && passwordRegex.test(password) && nameRegex.test(name))) {
            Alert.alert('올바른 형식인지 확인하세요')
            return;
        }

        const signupInfo = { email, password, name }

        try {
            const { duplicateResult } = await emailDuplicateCheck({ email: email })

            if (duplicateResult) {
                Alert.alert('해당 이메일로 가입된 계정이 있습니다.')
            } else {
                const rawResponse = await signup(signupInfo)
                const userCode = getSignupInfo(rawResponse)
                console.log(userCode)

                const userInfo = { name, userCode, image: null, email }

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

    }


    return (
        <RootView viewStyle={styles.container}>
            <BasicTextInput value={email} onChangeText={setEmail} placeholder="이메일" width={rWidth(298)} validType="이메일" valid={emailRegex.test(email)} />
            <BasicTextInput value={password} onChangeText={setPassword} placeholder="비밀번호" width={rWidth(298)} password validType="비밀번호" valid={passwordRegex.test(password)} />
            <BasicTextInput value={name} onChangeText={setName} placeholder="이름" width={rWidth(298)} validType="이름" valid={nameRegex.test(name)} />
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
        marginTop: rHeight(20)
    },
});