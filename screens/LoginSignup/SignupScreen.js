import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const SignupScreen = ({navigation}) => {
    return (
        <View>
            <Text>회원가입 화면</Text>
            <Button title="회원가입" onPress={()=>navigation.navigate('UserInfoEditScreen')}/>
        </View>
    );
}

export default SignupScreen;

const styles = StyleSheet.create({});