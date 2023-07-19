//
// 목표량 계산 Screen
//

import React, { useLayoutEffect } from "react";

import { View, Text, StyleSheet, } from "react-native";

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/rootView";
import { MoveButton } from "~/components/button";
import { LabelTextInput } from "~/components/textInput";

import { HeaderType } from "~/constants/type";
import { Nutrition, Nutrition_ko } from "~/constants/nutrition";
import { UserInfoType } from "~/constants/type";

import { scale, verticalScale } from "~/constants/globalSizes";
import { fonts, colors } from "~/constants/globalStyles";
import { TargetIntake } from "~/constants/test";

const CalculateGoalScreen = ({ navigation, route }) => {
    const { infoType } = route.params;

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

    const handleMove = () => {
        //서버에 저장
        navigation.navigate('SetFoodScreen');
    }

    const handleComplete =() =>{
        //변경된 내용 서버에 저장
        navigation.pop(2);
    }

    return (
        <RootView viewStyle={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>목표량을 계산했어요</Text>
                <View style={styles.inputViewStyle}>
                    <LabelTextInput type="dark" label='목표 섭취열량' unit="kcal" width={scale(298)} defaultValue={TargetIntake.kcal.toString()} inputStyle={styles.inputStyle} />
                    <View style={{ marginTop: verticalScale(40) }}>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.carbo]} unit="g" width={scale(180)} defaultValue={TargetIntake.carb.toString()} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{TargetIntake.carb * 4} kcal</Text>
                        </View>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.protein]} unit="g" width={scale(180)} defaultValue={TargetIntake.protein.toString()} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{TargetIntake.protein * 4} kcal</Text>
                        </View>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.fat]} unit="g" width={scale(180)} defaultValue={TargetIntake.fat.toString()} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{TargetIntake.fat * 9} kcal</Text>
                        </View>
                    </View>
                </View>
            </View>
            {infoType == UserInfoType.init
                ? <MoveButton text="다음" onPress={handleMove} />
                : <MoveButton text="완료" onPress={handleComplete} />
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