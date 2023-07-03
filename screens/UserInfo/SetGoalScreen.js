import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const SetGoalScreen = ({navigation}) => {
    return (
        <View>
            <Text>목표 설정 화면</Text>
            <Button title="목표 계산" onPress={()=>navigation.navigate('CalculateGoalScreen')}/>
        </View>
    );
}

export default SetGoalScreen;

const styles = StyleSheet.create({});