import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const UserInfoEditScreen = ({navigation}) => {
    return (
        <View>
            <Text>사용자 정보 편집 화면</Text>
            <Button title="목표 설정" onPress={()=>navigation.navigate('SetGoalScreen')}/>
        </View>
    );
}

export default UserInfoEditScreen;

const styles = StyleSheet.create({});