//
// 알림 보여주는 화면
//

import React, { useEffect, useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, FlatList } from "react-native";

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { GetUserData } from "~/components/asyncStorageData";

import { HeaderType } from "~/constants/type";
import { NotiData } from "~/constants/test";

import { rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const NotificationScreen = ({ navigation }) => {
    const [user, setUser] = useState({})
    console.log("NotificationScreen user",user)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="알림" backPress={() => navigation.goBack()} rightType={HeaderType.setting} rightPress={() => navigation.navigate('NotificationSettingScreen')} />
        });
    }, [navigation]);

    useEffect(()=>{
        getUser()
    },[])

    const getUser = async () => {
        const data = await GetUserData();

        setUser({ ...data })
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.foodView}>
                <View style={[styles.flexRow, styles.spaceBet, { marginBottom: rHeight(10) }]}>
                    <View style={styles.flexRow}>
                        <Text style={styles.boldText}>{item.date}</Text>
                        <Text style={styles.boldText}> {item.eatTime} 추천</Text>
                    </View>
                    <View style={styles.flexRow}>
                        <Text style={styles.greyText}>{item.date}</Text>
                        <Text style={styles.greyText}> {item.time}</Text>
                    </View>
                </View>

                <View style={[styles.flexRow, { alignItems: 'center' }]}>
                    <Text style={styles.text}>{item.foodName}</Text>
                    <Text style={styles.greyText}>      {item.foodKcal} kcal</Text>
                </View>
            </View>
        );
    };

    return (
        <RootView>
            <FlatList
                data={NotiData}
                renderItem={renderItem}
                keyExtractor={(item, idx) => item + idx}
               //showsVerticalScrollIndicator="false"
            />
        </RootView>
    );
}

export default NotificationScreen;

const styles = StyleSheet.create({
    foodView: {
        paddingHorizontal: rWidth(30),
        paddingVertical: rHeight(25),

        borderBottomWidth: rWidth(1),
        borderBottomColor: colors.textGrey,
    },

    flexRow: {
        flexDirection: 'row',
    },

    spaceBet: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    text: {
        fontFamily: fonts.medium,
        fontSize: rFont(15),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    boldText: {
        fontFamily: fonts.bold,
        fontSize: rFont(18),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: rFont(13),
        color: colors.textGrey,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },
});