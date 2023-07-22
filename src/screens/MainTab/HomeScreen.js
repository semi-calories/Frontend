//
//메인 홈화면
//

import React, { useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import HomeRecord from "~/screens/MainTab/HomeRecord";
import HomeStatistic from "~/screens/MainTab/HomeStatistic";

import { RootView } from "~/components/container";
import { MainHeader } from "~/components/header";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const tabs = ['기록', '통계'];

const HomeScreen = ({ navigation }) => {

    const [tabLabel, setTabLabel] = useState(tabs[0])

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <MainHeader notiPress={() => navigation.navigate('NotificationScreen')} userInfoPress={() => navigation.navigate('UserInfoMainScreen')} />
        });
    }, [navigation]);

    return (
        <RootView>
            {/* 상단 탭 */}
            <View style={styles.tab}>
                {tabs.map(tab => (
                    <Pressable key={tab} onPress={() => setTabLabel(tab)}>
                        <Text key={tab} style={[styles.tabLabel, {color : tab===tabLabel ? colors.black : colors.textGrey}]}>{tab}</Text>
                    </Pressable>
                ))}
            </View>

            {/* 기록 화면 */}
            {tabLabel==tabs[0] && <HomeRecord />}

            {/* 통계 화면 */}
            {tabLabel==tabs[1] && <HomeStatistic />}
        </RootView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    tab: {
        width: dWidth,
        height: verticalScale(40),
        flexDirection: 'row',
        alignItems:'center',

        paddingHorizontal: scale(14),
    },

    tabLabel: {
        fontFamily: fonts.bold,
        fontSize: scale(23),

        marginHorizontal: scale(7)
    }
});