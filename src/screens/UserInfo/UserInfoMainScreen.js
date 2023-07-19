//
//사용자 정보 메인 화면 - 사용자 정보 편집, 목표 설정, 선호/비선호 음식 설정 화면으로 이동 가능
//

import React, { useLayoutEffect } from "react";

import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { RootView } from "~/components/rootView";
import { BackHeader } from "~/components/header";

import { scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";
import { UserInfoType } from "~/constants/type";
import { Null_img, UserName } from "~/constants/test";

const UserInfoMainScreen = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    return (
        <RootView viewStyle={styles.container}>
            {/* 사용자 사진, 이름 나타내는 부분 */}
            <View style={styles.profile}>
                <Image source={Null_img} style={styles.img} />
                <Text style={styles.boldText}>{UserName}</Text>
            </View>

            {/* 화면이동 */}
            <Pressable style={styles.flexRow} onPress={() => navigation.navigate('UserInfoEditScreen', { userName: UserName, infoType: UserInfoType.edit })}>
                <Text style={[styles.boldText, { fontSize: scale(18) }]}>사용자 정보</Text>
                <MaterialIcons name="chevron-right" size={35} color={colors.borderGrey} />
            </Pressable>
            <Pressable style={styles.flexRow} onPress={() => navigation.navigate('SetGoalScreen', {infoType : UserInfoType.edit})}>
                <Text style={[styles.boldText, { fontSize: scale(18) }]}>목표 설정</Text>
                <MaterialIcons name="chevron-right" size={35} color={colors.borderGrey} />
            </Pressable>
            <Pressable style={styles.flexRow} onPress={() => navigation.navigate('SetFoodScreen')}>
                <Text style={[styles.boldText, { fontSize: scale(18) }]}>선호 / 비선호 음식 설정</Text>
                <MaterialIcons name="chevron-right" size={35} color={colors.borderGrey} />
            </Pressable>
        </RootView>
    );
}

export default UserInfoMainScreen;

const styles = StyleSheet.create({
    container: {
        paddingVertical: verticalScale(17),
        paddingHorizontal: scale(24),
    },

    profile: {
        paddingHorizontal: scale(107),
        alignItems: 'center',

        marginBottom: verticalScale(15)
    },

    img: {
        width: scale(120),
        height: verticalScale(125),
        resizeMode: 'contain',
        marginBottom: verticalScale(8),
    },

    boldText: {
        fontFamily: fonts.bold,
        fontSize: scale(30),
        color: colors.black,
        textAlign: 'center'
    },

    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderBottomWidth: scale(1),
        borderColor: colors.textGrey,

        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(22),
    }
});