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

import { scale, verticalScale } from "~/constants/globalSizes";
import { fonts, colors } from "~/constants/globalStyles";

// test용 목표 섭취량
const targetIntake = {
    kcal: 1929,
    carb: 198,
    protein: 193,
    fat: 43,
}

const CalculateGoalScreen = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} rightType={HeaderType.skip} rightPress={() => navigation.navigate('MainTab')} />
        });
    }, [navigation]);

    const handleMove = () => {
        // params로 넘겨주기, 혹은 서버에 저장
        navigation.navigate('SetFoodScreen');
    }

    return (
        <RootView viewStyle={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>목표량을 계산했어요</Text>
                <View style={styles.inputViewStyle}>
                    <LabelTextInput type="dark" label='목표 섭취열량' unit="kcal" width={scale(298)} defaultValue={targetIntake.kcal.toString()} inputStyle={styles.inputStyle} />
                    <View style={{ marginTop: verticalScale(40) }}>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.carbo]} unit="g" width={scale(180)} defaultValue={targetIntake.carb.toString()} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{targetIntake.carb * 4} kcal</Text>
                        </View>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.protein]} unit="g" width={scale(180)} defaultValue={targetIntake.protein.toString()} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{targetIntake.protein * 4} kcal</Text>
                        </View>
                        <View style={styles.contentView}>
                            <LabelTextInput type="dark" label={Nutrition_ko[Nutrition.fat]} unit="g" width={scale(180)} defaultValue={targetIntake.fat.toString()} inputStyle={styles.inputStyle} />
                            <Text style={styles.calText}>{targetIntake.fat * 9} kcal</Text>
                        </View>
                    </View>
                </View>
            </View>
            <MoveButton text="다음" onPress={handleMove} />
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

    contentView:{ 
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical:verticalScale(10),
    },

    calText:{
        fontFamily: fonts.bold,
        fontSize: scale(20),
        marginTop:verticalScale(47),
        marginRight:scale(15),
    }
});