//
// global하게 쓰이는 버튼 모아놓은 파일
//

import React from "react";

import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { colors, fonts } from "~/constants/globalStyles"
import { scale, verticalScale } from "~/constants/globalSizes";

export function PrimaryButton({ text, onPress, btnStyle}) {
    return (
        <TouchableOpacity style={[styles.primaryBtn, btnStyle]} onPress={onPress}>
            <Text style={styles.whiteText}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    primaryBtn: {
        width: scale(298),
        height: verticalScale(67),
        borderRadius: 15,
        backgroundColor: colors.primary,

        alignItems: "center",
        justifyContent: 'center',
    },

    whiteText: {
        color: colors.white,
        fontSize: scale(20),
        fontFamily: fonts.bold,
    }
});