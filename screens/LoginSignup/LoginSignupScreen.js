import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const LoginSignupScreen = ({navigation}) => {
    return (
        <View>
            <Text>로그인, 회원가입 화면</Text>
            <Button title = "로그인" onPress={() => navigation.navigate('LoginScreen')}/>
            <Button title = "회원가입" onPress={() => navigation.navigate('SignupScreen')}/>
        </View>
    );
}

export default LoginSignupScreen;

const styles = StyleSheet.create({});