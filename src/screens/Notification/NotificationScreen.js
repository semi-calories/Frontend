//
// 알림 보여주는 화면
//

import React, { useLayoutEffect } from "react";

import { View, Text, StyleSheet, FlatList } from "react-native";

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";

import { HeaderType } from "~/constants/type";
import { NotiData } from "~/constants/test";

import { scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const NotificationScreen = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="알림" backPress={() => navigation.goBack()} rightType={HeaderType.setting} rightPress={() => navigation.navigate('NotificationSettingScreen')} />
        });
    }, [navigation]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.foodView}>
                <View style={[styles.flexRow, styles.spaceBet, { marginBottom: verticalScale(10) }]}>
                    <View style={styles.flexRow}>
                        <Text style={styles.boldText}>{item.date}</Text>
                        <Text style={styles.boldText}> {item.eatTime} 식단 추천</Text>
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
                showsVerticalScrollIndicator="false"
            />
        </RootView>
    );
}

export default NotificationScreen;

const styles = StyleSheet.create({
    foodView: {
        paddingHorizontal: scale(30),
        paddingVertical: verticalScale(25),

        borderBottomWidth: scale(1),
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
        fontSize: scale(15),
        color: colors.black
    },

    boldText: {
        fontFamily: fonts.bold,
        fontSize: scale(18),
        color: colors.black
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: scale(13),
        color: colors.textGrey
    },
});