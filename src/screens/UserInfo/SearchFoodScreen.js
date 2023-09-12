//
// 선호, 비선호 음식 선택할 수 있는 Screen
//

import React, { useEffect, useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Alert } from "react-native";
import { Chip } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

import { SearchHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { PrimaryButton } from "~/components/button";

import { RecordType, SearchFoodType } from "~/constants/type";
import { FoodTemp } from "~/constants/test";

import { colors, fonts } from "~/constants/globalStyles";
import { dWidth, scale, verticalScale } from "~/constants/globalSizes";

import { foodSearch } from "~/apis/api/diet";

const SearchFoodScreen = ({ navigation, route }) => {
    const { type, userInfo } = route.params;
    console.log('SearchFoodScreen route.params', route.params)

    const [text, setText] = useState('')

    const [foodList, setFoodList] = useState([])
    //console.log('SearchFoodScreen foodList', foodList)
    const [selectFood, setSelectFood] = useState([])
    console.log('SearchFoodScreen selectFood', selectFood)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <SearchHeader backPress={() => navigation.goBack()} text={text} onChangeText={setText} clearText={() => setText('')} />
        });
    }, [navigation, text]);

    useEffect(() => {
        foodSearchFunc()
    }, [text])

    const foodSearchFunc = async () => {
        try {
            const { foodList } = await foodSearch({ foodName: text })
            //console.log('foodSearchFunc foodList', foodList)

            setFoodList([...foodList])
        } catch (err) {
            console.log(err)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <Pressable style={styles.foodView} onPress={() => handleSelect(item)}>
                <Text style={styles.text}>{item.foodName}</Text>
                <AntDesign name={selectFood.includes(item) ? "checkcircle" : 'checkcircleo'} size={scale(20)} color={colors.borderGrey} />
            </Pressable>
        );
    };

    const handleSelect = item => {
        if (selectFood.includes(item)) {
            const rest = selectFood.filter(food => food !== item)
            setSelectFood([...rest])
        } else {
            setSelectFood(prev => [...prev, item])
        }
    }

    const handleComplete = () => {
        if (selectFood.length) {
            if (type == SearchFoodType.add) {
                navigation.navigate('MealtimeScreen', { foodParam: selectFood, userInfo, type: RecordType.init})
            } else {
                // 이전 화면에 선택한 food 업데이트 해줘야함
                navigation.navigate('SetFoodScreen', { type: type, foodParam: selectFood, userInfo })
            }
        } else {
            Alert.alert('항목을 하나이상 선택해주세요')
        }
    }


    return (
        <RootView>
            <FlatList
                data={foodList}
                renderItem={renderItem}
                keyExtractor={(item, idx) => item + idx}
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: scale(30) }}
            />
            <View style={styles.selectBtnView}>
                <ScrollView horizontal style={styles.chipView}>
                    {selectFood && [...selectFood].map((food, idx) => <Chip key={food + idx} mode="outlined" onClose={() => setSelectFood([...selectFood.filter(fd => fd !== food)])} style={styles.chip}>{food.foodName}</Chip>)}
                </ScrollView>
                <PrimaryButton text={`${selectFood.length}개 선택`} btnStyle={{ width: scale(345), backgroundColor: type == SearchFoodType.dislike ? colors.pink : colors.primary }} onPress={handleComplete} />
            </View>
        </RootView>
    );
}

export default SearchFoodScreen;

const styles = StyleSheet.create({
    foodView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(24),

        borderBottomWidth: scale(1),
        borderBottomColor: colors.textGrey,
    },

    text: {
        fontFamily: fonts.medium,
        fontSize: scale(18),
        color: colors.black,
    },

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
        borderRadius: 20
    },
});