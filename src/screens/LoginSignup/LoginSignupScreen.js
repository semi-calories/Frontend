import React from "react";

import { Text, StyleSheet, Button } from "react-native";

import { RootView } from "@components/rootView";

const LoginSignupScreen = ({navigation}) => {
    return (
        <RootView>
            <Text>로그인, 회원가입 화면</Text>
            <Button title = "로그인" onPress={() => navigation.navigate('LoginScreen')}/>
            <Button title = "회원가입" onPress={() => navigation.navigate('SignupScreen')}/>
        </RootView>
    );
}

export default LoginSignupScreen;

const styles = StyleSheet.create({});