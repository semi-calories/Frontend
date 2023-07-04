import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const CalculateGoalScreen = ({navigation}) => {
    return (
        <View>
            <Text>목표 계산 화면</Text>
            <Button title="선호/비선호 음식 설정" onPress={()=>navigation.navigate('SetFoodScreen')}/>
        </View>
    );
}

export default CalculateGoalScreen;

const styles = StyleSheet.create({});