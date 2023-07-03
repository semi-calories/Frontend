import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const UserInfoMainScreen = ({navigation}) => {
    return (
        <View>
            <Text>사용자 정보 메인 화면</Text>
            <Button title="사용자 정보" onPress={()=>navigation.navigate('UserInfoEditScreen')} />
            <Button title="목표 설정" onPress={()=>navigation.navigate('SetGoalScreen')} />
            <Button title="선호/비선호 음식 설정" onPress={()=>navigation.navigate('SetFoodScreen')} />
        </View>
    );
}

export default UserInfoMainScreen;

const styles = StyleSheet.create({});