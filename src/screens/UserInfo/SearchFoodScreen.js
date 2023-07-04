import React from "react";

import { View, Text, StyleSheet, Button } from "react-native";

const SearchFoodScreen = ({navigation}) => {
    return (
        <View>
            <Text>선호/비선호 음식 검색 화면</Text>
            <Button title="선택" onPress={()=>navigation.goBack()}/>
        </View>
    );
}

export default SearchFoodScreen;

const styles = StyleSheet.create({});