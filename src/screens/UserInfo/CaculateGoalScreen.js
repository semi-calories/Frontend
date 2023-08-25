//
// 목표량 계산 Screen
//

import React, { useLayoutEffect, useEffect, useState } from "react";

import { View, Text, StyleSheet, } from "react-native";

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { MoveButton } from "~/components/button";
import { LabelTextInput } from "~/components/textInput";

import { HeaderType } from "~/constants/type";
import { Nutrition, Nutrition_ko } from "~/constants/food";
import { UserInfoType } from "~/constants/type";

import { scale, verticalScale } from "~/constants/globalSizes";
import { fonts, colors } from "~/constants/globalStyles";
import { TargetIntake } from "~/constants/test";

import { getInfo } from "~/apis/api/user";

const CalculateGoalScreen = ({ navigation, route }) => {
    const { infoType, userInfo } = route.params;

    const [user, setUser] = useState()
    console.log(user)


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
        getUserInfo()
    }, [])

    const getUserInfo = async () => {
        try {
            const user = await getInfo({ userCode: userInfo.userCode })

            setUser({ ...user })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <RootView viewStyle={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>목표량을 계산했어요</Text>
                <View style={styles.inputViewStyle}>
                    <LabelTextInput type="dark" label='목표 섭취열량' unit="kcal" width={scale(298)} defaultValue={user ? Math.round(user?.kcal).toString() : ''} inputStyle={styles.inputStyle} />
                    <View style={{ marginTop: verticalScale(40) }}>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.carbo]} unit="g" width={scale(180)} defaultValue={user ? Math.round(user?.carbo).toString() : ''} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{user ? Math.round(user?.carbo) * 4 : ''} kcal</Text>
                        </View>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.protein]} unit="g" width={scale(180)} defaultValue={user ? Math.round(user?.protein).toString() : ''} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{user ? Math.round(user?.protein) * 4 : ''} kcal</Text>
                        </View>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.fat]} unit="g" width={scale(180)} defaultValue={user ? Math.round(user?.fat).toString() : ''} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{user ? Math.round(user?.fat) * 9 : ''} kcal</Text>
                        </View>
                    </View>
                </View>
            </View>
            {infoType == UserInfoType.init
                ? <MoveButton text="다음" onPress={() => navigation.navigate('SetFoodScreen', { infoType: UserInfoType.init })} />
                : <MoveButton text="완료" onPress={() => navigation.pop(2)} />
            }
        </RootView>
    );
}

export default CalculateGoalScreen;

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

    inputViewStyle: {
        marginHorizontal: scale(10),
    },

    inputStyle: {
        fontFamily: fonts.bold,
        fontSize: scale(20),
    },

    contentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: verticalScale(10),
    },

    calText: {
        fontFamily: fonts.bold,
        fontSize: scale(20),
        marginTop: verticalScale(47),
        marginRight: scale(15),
    }
});