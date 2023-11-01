//
//사용자 정보 메인 화면 - 사용자 정보 편집, 목표 설정, 선호/비선호 음식 설정 화면으로 이동 가능
//

import React, { useLayoutEffect, useEffect, useState } from "react";

import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { GetUserData } from "~/components/asyncStorageData";

import { rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";
import { UserInfoType } from "~/constants/type";
import { Null_img, UserName } from "~/constants/test";

const UserInfoMainScreen = ({ navigation }) => {
    const [user, setUser] = useState({})
    console.log('UserInfoMainScreen user', user)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    useEffect(() => {
        const focusSubscription = navigation.addListener('focus', () => {
            getUser()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return focusSubscription;
    }, [navigation]);

    const getUser = async () => {
        const data = await GetUserData();

        setUser({ ...data })
    }


    return (
        <RootView viewStyle={styles.container}>
            {/* 사용자 사진, 이름 나타내는 부분 */}
            <View style={styles.profile}>
                <Image source={user.image ? {uri: user.image} : Null_img} style={styles.img} resizeMode="cover"/>
                <Text style={styles.boldText}>{user?.name}</Text>
            </View>

            {/* 화면이동 */}
            <Pressable style={styles.flexRow} onPress={() => navigation.push('UserInfoEditScreen', { userInfo: user, infoType: UserInfoType.edit })}>
                <Text style={styles.menuText}>사용자 정보</Text>
                <MaterialIcons name="chevron-right" size={35} color={colors.borderGrey} />
            </Pressable>
            <Pressable style={styles.flexRow} onPress={() => navigation.push('SetGoalScreen', { userInfo: user, infoType: UserInfoType.edit })}>
                <Text style={styles.menuText}>목표 설정</Text>
                <MaterialIcons name="chevron-right" size={35} color={colors.borderGrey} />
            </Pressable>
            <Pressable style={styles.flexRow} onPress={() => navigation.push('SetFoodScreen', { userInfo: user, infoType: UserInfoType.edit })}>
                <Text style={styles.menuText}>선호 / 비선호 음식 설정</Text>
                <MaterialIcons name="chevron-right" size={35} color={colors.borderGrey} />
            </Pressable>
        </RootView>
    );
}

export default UserInfoMainScreen;

const styles = StyleSheet.create({
    container: {
        paddingVertical: rHeight(17),
        paddingHorizontal: rWidth(24),
    },

    profile: {
        paddingHorizontal: rWidth(107),
        alignItems: 'center',

        marginBottom: rHeight(15)
    },

    img: {
        width: rWidth(120),
        height: rHeight(125),
        resizeMode: 'contain',
        marginBottom: rHeight(8),

        borderRadius:100,
    },

    boldText: {
        fontFamily: fonts.bold,
        fontSize: rFont(30),
        color: colors.black,
        textAlign: 'center',

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    menuText:{
        fontFamily: fonts.bold,
        fontSize: rFont(18),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderBottomWidth: rWidth(1),
        borderColor: colors.textGrey,

        paddingHorizontal: rWidth(10),
        paddingVertical: rHeight(22),
    }
});