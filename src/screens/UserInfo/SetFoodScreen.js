import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const SetFoodScreen = ({navigation}) => {
    return (
        <View>
            <Text>선호/비선호 음식 설정 화면</Text>
            <Button title="선호 음식" onPress={()=>navigation.navigate('SearchFoodScreen')}/>
            <Button title="비선호 음식" onPress={()=>navigation.navigate('SearchFoodScreen')}/>
            <Button title="메인탭 이동" onPress={()=>navigation.navigate('MainTab')}/>
        </View>
    );
}

export default SetFoodScreen;

const styles = StyleSheet.create({});