//
// 선호/비선호 음식 선택 Screen
//

import React, { useEffect, useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Chip } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { MoveButton } from "~/components/button";

import { HeaderType } from "~/constants/type";
import { SearchFoodType } from "~/constants/type";
import { UserInfoType } from "~/constants/type";
import { FoodTemp } from "~/constants/test";

import { fonts, colors } from "~/constants/globalStyles";
import { scale, verticalScale } from "~/constants/globalSizes";

import { getPrefer, getDislike, savePrefer, saveDislike } from "~/apis/api/user";
import { getDislikeFood, getPreferFood } from "~/apis/services/user";

const AddFunc = ({ onPress }) => {
    return (
        <Pressable onPress={onPress} style={styles.add}>
            <Feather name="plus" size={24} color={colors.borderGrey} />
        </Pressable>
    )
}

const SetFoodScreen = ({ navigation, route }) => {
    const { userInfo } = route.params
    console.log('SetFoodScreen userInfo', userInfo)

    const [preferFood, setPreferFood] = useState([])
    console.log('SetFoodScreen preferFood', preferFood)
    const [dislikeFood, setDislikeFood] = useState([])
    console.log('SetFoodScreen dislikeFood', dislikeFood)

    useLayoutEffect(() => {
        if (route.params?.infoType == UserInfoType.init) {
            navigation.setOptions({
                header: () => <BackHeader back backPress={() => navigation.goBack()} rightType={HeaderType.skip} rightPress={() => navigation.navigate('MainTab')} />
            });
        } else if (route.params?.infoType == UserInfoType.edit) {
            navigation.setOptions({
                header: () => <BackHeader back title="선호 / 비선호 음식 설정" backPress={() => navigation.goBack()} />
            });
        }

    }, [navigation, route.params?.infoType]);

    useEffect(() => {
        getDislikeFunc()
        getPreferFunc()
    }, [])

    useEffect(() => {
        if (route.params?.foodParam) {
            if (route.params?.type == SearchFoodType.prefer) {
                setPreferFood([...preferFood, ...route.params?.foodParam])
            } else if (route.params?.type == SearchFoodType.dislike) {
                setDislikeFood([...dislikeFood, ...route.params?.foodParam])
            }
        }

    }, [route.params?.type, route.params?.foodParam])

    const getPreferFunc = async () => {
        try {
            const { response } = await getPrefer({ userCode: userInfo.userCode })
            const prefer = getPreferFood(response)

            setPreferFood([...prefer])
        } catch (e) {
            console.log(e)
        }
    }

    const getDislikeFunc = async () => {
        try {
            const { response } = await getDislike({ userCode: userInfo.userCode })
            const dislike = getDislikeFood(response)

            setDislikeFood([...dislike])
        } catch (e) {
            console.log(e)
        }
    }

    const handleComplete = async() => {
        await savePreferFunc()
        await saveDislikeFunc()

        if(route.params?.infoType == UserInfoType.init){
            navigation.navigate('MainTab')
        }else {
            navigation.goBack()
        }
    }

    const savePreferFunc = async()=>{
        const preferFoodCode = preferFood.map(food => food.foodCode)

        const preferInfo ={
            userCode: userInfo.userCode,
            foodList:preferFoodCode
        }

        try {
            const { response } = await savePrefer(preferInfo)
        } catch (e) {
            console.log(e)
        }
    }

    const saveDislikeFunc = async()=>{
        const dislikeFoodCode = dislikeFood.map(food => food.foodCode)

        const dislikeInfo ={
            userCode: userInfo.userCode,
            foodList:dislikeFoodCode
        }

        try {
            const { response } = await saveDislike(dislikeInfo)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <RootView viewStyle={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.titleText}>선호음식</Text>
                <View style={styles.chipView}>
                    {preferFood && [...preferFood].map((food, idx) => <Chip key={food + idx} mode="outlined" onClose={() => setPreferFood([...preferFood.filter(fd => fd !== food)])} style={styles.chip}>{food.foodName}</Chip>)}
                    <AddFunc onPress={() => navigation.navigate('SearchFoodScreen', { type: SearchFoodType.prefer, userInfo })} />
                </View>

                <Text style={styles.titleText}>비선호음식</Text>
                <View style={styles.chipView}>
                    {dislikeFood && [...dislikeFood].map((food, idx) => <Chip key={food + idx} mode="outlined" onClose={() => setDislikeFood([...dislikeFood.filter(fd => fd !== food)])} style={styles.chip}>{food.foodName}</Chip>)}
                    <AddFunc onPress={() => navigation.navigate('SearchFoodScreen', { type: SearchFoodType.dislike, userInfo })} />
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