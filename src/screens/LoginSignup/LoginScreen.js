import React from "react";

import { View, Text, StyleSheet ,Button} from "react-native";

const LoginScreen = ({navigation}) => {
    return (
        <View>
            <Text>로그인 화면</Text>
            <Button title="로그인" onPress={()=>navigation.navigate('MainTab')}/>
        </View>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({});