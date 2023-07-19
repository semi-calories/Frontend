//
//목표 설정하는 Screen
//

import React, { useLayoutEffect, useEffect, useState } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/rootView";
import { MoveButton } from "~/components/button";

import { HeaderType } from "~/constants/type";
import { Goal, Goal_explain, Goal_icon, Goal_ko } from "~/constants/userInfo";
import { UserInfoType } from "~/constants/type";

import { scale, verticalScale } from "~/constants/globalSizes";
import { fonts, colors } from "~/constants/globalStyles";

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
    const { infoType } = route.params;


    const [userGoal, setGoal] = useState(Goal.healthy);

    useLayoutEffect(() => {
        if (infoType == UserInfoType.init) {
            navigation.setOptions({
                header: () => <BackHeader back backPress={() => navigation.goBack()} rightType={HeaderType.skip} rightPress={() => navigation.navigate('MainTab')} />
            });
        } else if (infoType == UserInfoType.edit) {
            navigation.setOptions({
                header: () => <BackHeader back title="목표 설정" backPress={() => navigation.goBack()} />
            });
        }
    }, [navigation, infoType]);

    useEffect(() => {
        // 서버에서 데이터 get해서 변수들 set해주기
    }, [route.params])

    const handleMove = () => {
        // 서버에 저장
        navigation.navigate('CalculateGoalScreen', { infoType: infoType });
    }

    return (
        <RootView viewStyle={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>목표가 무엇인가요?</Text>
                <GoalFunc label={Goal.healthy} onPress={() => setGoal(Goal.healthy)} goal={userGoal} />
                <GoalFunc label={Goal.weightLoss} onPress={() => setGoal(Goal.weightLoss)} goal={userGoal} />
                <GoalFunc label={Goal.weightGain} onPress={() => setGoal(Goal.weightGain)} goal={userGoal} />
            </View>
            <MoveButton text="다음" onPress={handleMove} />
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
    }
});