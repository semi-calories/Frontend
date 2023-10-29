//
//목표 설정하는 Screen
//

import React, { useLayoutEffect, useEffect, useState } from "react";

import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { MoveButton } from "~/components/button";
import { StoreUserData } from "~/components/asyncStorageData";
import { periodRegex } from "~/components/regex";
import { BasicTextInput } from "~/components/textInput";

import { HeaderType } from "~/constants/type";
import { Goal, Goal_explain, Goal_icon, Goal_ko } from "~/constants/userInfo";
import { UserInfoType } from "~/constants/type";

import { scale, verticalScale } from "~/constants/globalSizes";
import { fonts, colors } from "~/constants/globalStyles";

import { updateInfo, getInfo } from "~/apis/api/user";

const GoalFunc = ({ label, onPress, goal }) => {
    return (
        <Pressable style={[styles.content, label == goal ? styles.selectedView : styles.noSelectedView]} onPress={onPress}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: scale(180), height: verticalScale(70) }}>
                    <Text style={[styles.contentTitle, { color: label == goal ? colors.white : colors.black }]}>{Goal_ko[label]}</Text>
                    <Text style={[styles.labelTitle, { color: label == goal ? colors.white : colors.black }]}>{Goal_explain[label]}</Text>
                </View>
                <MaterialCommunityIcons name={Goal_icon[label]} size={45} color="black" style={styles.icon} />
            </View>
        </Pressable>
    )
}

const SetGoalScreen = ({ navigation, route }) => {
    const { infoType, userInfo } = route.params;
    console.log('SetGoalScreen userInfo', userInfo)

    const [userGoal, setGoal] = useState(Goal.health);
    const [period, setPeriod] = useState('')

    useLayoutEffect(() => {
        if (infoType == UserInfoType.init) {
            navigation.setOptions({
                header: () => <BackHeader back backPress={() => navigation.goBack()} />
            });
        } else if (infoType == UserInfoType.edit) {
            navigation.setOptions({
                header: () => <BackHeader back title="목표 설정" backPress={() => navigation.goBack()} />
            });
        }
    }, [navigation, infoType]);

    useEffect(() => {
        if (userInfo.userGoal) {
            setGoal(userInfo.userGoal)
        }
    }, [route.params])

    const handleMove = async () => {
        if (!periodRegex.test(period)) {
            Alert.alert('올바른 형식인지 확인하세요')
            return;
        }

        const user = {
            userCode: userInfo.userCode,
            email: userInfo.email,
            image: userInfo.image,
            name: userInfo.name,
            gender: userInfo.gender,
            age: userInfo.age,
            height: userInfo.height,
            weight: userInfo.weight,
            userActivity: userInfo.userActivity,
            goalWeight: userInfo.goalWeight,
            userGoal: userGoal
        }

        try {
            const response = await updateInfo(user)
            const userData = await getUserInfo()

            navigation.navigate('CalculateGoalScreen', { userInfo: userData, infoType });
        } catch (err) {
            console.log(err)
        }
    }

    const getUserInfo = async () => {
        try {
            const user = await getInfo({ userCode: userInfo.userCode })
            await StoreUserData({ ...user, userCode: userInfo.userCode })

            return { ...user, userCode: userInfo.userCode }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <RootView viewStyle={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>목표가 무엇인가요?</Text>
                <GoalFunc label={Goal.health} onPress={() => setGoal(Goal.health)} goal={userGoal} />
                <GoalFunc label={Goal.lose} onPress={() => setGoal(Goal.lose)} goal={userGoal} />
                <GoalFunc label={Goal.gain} onPress={() => setGoal(Goal.gain)} goal={userGoal} />
                {userGoal !== Goal.health &&
                    <View style={[styles.box, styles.flexRow]}>
                        <View style={{ justifyContent: 'center', height: verticalScale(60) }}>
                            <Text style={styles.labelText}>기간</Text>
                        </View>
                        <BasicTextInput value={period.toString()} onChangeText={setPeriod} unit="일" width={scale(170)} keyboardType="numeric" validType="기간" valid={periodRegex.test(period)} />
                    </View>
                }

            </View>
            <MoveButton text="다음" onPress={handleMove}/>
        </RootView>
    );
}

export default SetGoalScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(30),
    },

    text: {
        fontFamily: fonts.medium,
        fontSize: scale(25),
        color: colors.black,

        marginVertical: verticalScale(30)
    },

    labelText: {
        fontFamily: fonts.bold,
        fontSize: scale(20),
        color: colors.borderGrey,
    },

    content: {
        width: scale(320),
        height: verticalScale(90),
        borderRadius: 10,

        marginVertical: verticalScale(5),
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(6),
    },

    selectedView: {
        backgroundColor: colors.primary,
    },

    noSelectedView: {
        backgroundColor: colors.white,
        borderWidth: scale(2),
        borderColor: colors.textGrey,
    },

    contentTitle: {
        fontFamily: fonts.bold,
        fontSize: scale(19),
        marginVertical: verticalScale(3),
    },

    contentLabel: {
        fontFamily: fonts.regular,
        fontSize: scale(14),
    },

    icon: {
        alignSelf: 'center',
        marginLeft: scale(50)
    },

    box: {
        flexDirection: 'row',
        //alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(20)
    },

    flexRow: {
        flexDirection: 'row'
    },

});