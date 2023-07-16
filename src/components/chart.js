//
// 차트 관련 컴포넌트들 모음
//

import React from "react";

import { StyleSheet, View, Text } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

import { verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

export function DonutChart({spentAmount ,targetAmount}) {
    const radius = 70;
    const circleCircumference = 2 * Math.PI * radius;

    const percentage = (spentAmount / targetAmount) * 100;
    const strokeDashoffset = circleCircumference - (circleCircumference * percentage) / 100;

    return (
        <View style={styles.container}>
            <Svg height="190" width="190" viewBox="0 0 180 180">
                <G rotation={-90} originX="90" originY="90">
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={colors.textGrey}
                        fill="transparent"
                        strokeWidth="30"
                    />
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={colors.primary}
                        fill="transparent"
                        strokeWidth="30"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View style={styles.textView}>
                <Text style={styles.text}>{spentAmount}</Text>
                <Text style={styles.unitText}> kcal</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },

    textView:{
        flexDirection:'row',
        position: "absolute",
        alignItems:'flex-end',
    },

   text: {
        fontFamily:fonts.medium,
        fontSize: 25,
        color: colors.black,
    },

    unitText:{
        fontFamily:fonts.regular,
        fontSize: 15,
        color: colors.black,
        
        marginBottom:verticalScale(3)
    }

})