//
// header 컴포넌트 모아놓은 파일
//

import React from "react";

import { StyleSheet, Text, TouchableOpacity, View, TextInput, Pressable } from "react-native";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { colors, fonts } from "~/constants/globalStyles"
import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { HeaderType } from "~/constants/type";

const RightTypefunc = ({ type, rightPress }) => {
    switch (type) {
        case HeaderType.skip:
            return (
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={rightPress}>
                        <Text style={styles.skip}>건너뛰기</Text>
                    </TouchableOpacity>
                </View>
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

export function SearchHeader({ backPress, text, onChangeText, clearText}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={backPress}>
                <MaterialIcons name="arrow-back-ios" size={26} color={colors.textGrey} />
            </TouchableOpacity>
            <View style={styles.searchView}>
                <MaterialIcons name="search" size={24} color={colors.borderGrey} />
                <TextInput 
                    style={styles.searchInput}
                    value={text}
                    onChangeText={onChangeText}
                />
                <Pressable onPress={clearText}>
                    <Ionicons name="close-circle" size={24} color={colors.borderGrey}  />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: dWidth,
        height: verticalScale(60),
        color: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(26),
    },

    titleView: {
        flex: 1,
        paddingLeft: scale(120),
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
    },

    searchView:{
        width:scale(300),
        height:verticalScale(40),
        flexDirection:'row',

        borderWidth:scale(2),
        borderColor:colors.textGrey,
        borderRadius:10,

        marginLeft:scale(10),
        paddingHorizontal:scale(12),
        paddingVertical:verticalScale(6),
    },

    searchInput:{
        flex:1,
        marginLeft:scale(10)
    }
});