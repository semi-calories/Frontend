//
// 선호/비선호 음식 선택 Screen
//

import React, { useEffect, useLayoutEffect } from "react";

import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Chip } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/rootView";
import { MoveButton } from "~/components/button";

import { HeaderType } from "~/constants/type";

import { fonts, colors } from "~/constants/globalStyles";
import { scale, verticalScale } from "~/constants/globalSizes";

const AddFunc = ({ onPress }) => {
    return (
        <Pressable onPress={onPress} style={styles.add}>
            <Feather name="plus" size={24} color={colors.borderGrey} />
        </Pressable>
    )
}

const SetFoodScreen = ({ navigation, route }) => {
    let preferFood = new Set(['사과','계란후라이','연어']);
    let nonPreferFood = new Set(['가지','콩','당근']);


    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} rightType={HeaderType.skip} rightPress={() => navigation.navigate('MainTab')} />
        });
    }, [navigation]);

    useEffect(()=>{
        if(route.params?.selectFood) {
            if(route.params?.type=='prefer'){
                console.log(route.params?.selectFood)
                preferFood = new Set([...preferFood, ...route.params?.selectFood])
            }else if(route.params?.type=='nonPrefer'){
                console.log(route.params?.selectFood)
                nonPreferFood = new Set([...nonPreferFood, ...route.params?.selectFood])
            }
        }

    },[route.params?.type, route.params?.selectFood])

    const handleComplete = () => {
        // params로 넘겨주기, 혹은 서버에 저장
        navigation.navigate('MainTab');
    }

    return (
        <RootView viewStyle={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.titleText}>선호음식</Text>
                <View style={styles.chipView}>
                    {preferFood && [...preferFood].map((food, idx) => <Chip key={food+idx} mode="outlined" onClose={() => preferFood.delete(food)} style={styles.chip}>{food}</Chip> )}
                    <AddFunc onPress={() => navigation.navigate('SearchFoodScreen', { type: 'prefer' })} />
                </View>

                <Text style={styles.titleText}>비선호음식</Text>
                <View style={styles.chipView}>
                    {nonPreferFood && [...nonPreferFood].map((food,idx) => <Chip key={food+idx} mode="outlined" onClose={() => nonPreferFood.delete(food)} style={styles.chip}>{food}</Chip> )}
                    <AddFunc onPress={() => navigation.navigate('SearchFoodScreen', { type: 'nonPrefer' })} />
                </View>
            </ScrollView>
            <MoveButton text="완료" onPress={handleComplete} />
        </RootView>
    );
}

export default SetFoodScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(30),
    },

    scrollView: {
        flex: 1,
    },

    titleText: {
        fontFamily: fonts.bold,
        fontSize: scale(25),
        color: colors.black,

        marginTop: verticalScale(40),
    },

    chipView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: verticalScale(15),
    },

    chip: {
        marginHorizontal: scale(3),
    },

    add: {
        width: scale(35),
        height: verticalScale(35),
        borderWidth: scale(1.5),
        borderColor: colors.borderGrey,
        borderRadius: 10,

        alignItems: 'center',
        justifyContent: 'center',
    }
});