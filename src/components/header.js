//
// header 컴포넌트 모아놓은 파일
//

import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { colors, fonts } from "~/constants/globalStyles"
import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { HeaderType } from "~/constants/type";

const RightTypefunc = ({ type, rightPress }) => {
    switch (type) {
        case HeaderType.skip:
            return (
                <TouchableOpacity onPress={rightPress}>
                    <Text style={styles.skip}>건너뛰기</Text>
                </TouchableOpacity>
            )
        case HeaderType.setting:
            return (
            <TouchableOpacity onPress={rightPress}>
                <Ionicons name="settings-outline" size={40} color={colors.textGrey} />
            </TouchableOpacity>
            )
        default:
            return null
    }
}

export function BackHeader({ back, title, rightType, backPress, rightPress }) {
    return (
        <View style={styles.container}>
            {back &&
                <TouchableOpacity onPress={backPress}>
                    <MaterialIcons name="arrow-back-ios" size={26} color={colors.textGrey} />
                </TouchableOpacity>}
            {title &&
                <View style={styles.titleView}>
                    <Text style={styles.title}>{title}</Text>
                </View>}
            {rightType && <RightTypefunc type={rightType} rightPress={rightPress} />}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        width:dWidth,
        height: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(26),
    },

    titleView: {
        flex: 1,
        paddingLeft:scale(120),
    },

    title: {
        color: colors.black,
        fontSize: scale(25),
        fontFamily: fonts.bold,
    },

    skip: {
        color: colors.textGrey,
        fontSize: scale(18),
        fontFamily: fonts.regular,
    }
});