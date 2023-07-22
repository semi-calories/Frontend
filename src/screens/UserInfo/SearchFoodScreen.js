//
// 선호, 비선호 음식 선택할 수 있는 Screen
//

import React, { useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Chip } from 'react-native-paper';

import { SearchHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { PrimaryButton } from "~/components/button";

import { SearchFoodType } from "~/constants/type";

import { colors } from "~/constants/globalStyles";
import { dWidth, scale, verticalScale } from "~/constants/globalSizes";

const SearchFoodScreen = ({ navigation, route }) => {
    const { type } = route.params;

    const [text, setText] = useState('')

    const selectFood = new Set(['계란', '사과']);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <SearchHeader backPress={() => navigation.goBack()} text={text} onChangeText={setText} clearText={() => setText('')} />
        });
    }, [navigation, text]);

    const handleSelect = () =>{
        // 이전 화면에 선택한 food 업데이트 해줘야함
        navigation.navigate('SetFoodScreen',{type:type, selectFood : selectFood})
    }

    return (
        <RootView>
            <ScrollView style={{ flex: 1 }}>
                <Text>검색결과</Text>
            </ScrollView>
            <View style={styles.selectBtnView}>
                <ScrollView horizontal style={styles.chipView}>
                    {selectFood && [...selectFood].map((food,idx) => <Chip key={food+idx} mode="outlined" onClose={() => selectFood.delete(food)} style={styles.chip}>{food}</Chip> )}
                </ScrollView>
                <PrimaryButton text={`${selectFood.size}개 선택`} btnStyle={{ width: scale(345), backgroundColor: type == SearchFoodType.prefer ? colors.primary : colors.pink }} onPress={handleSelect}/>
            </View>
        </RootView>
    );
}

export default SearchFoodScreen;

const styles = StyleSheet.create({
    selectBtnView: {
        width: dWidth,
        height: verticalScale(150),
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(10),

        borderWidth: scale(2),
        borderColor: colors.textGrey,
        borderBottomColor: colors.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },

    chipView: {
        marginVertical: verticalScale(10),
    },

    chip: {
        marginHorizontal: scale(3),
        borderRadius:20
    },
});