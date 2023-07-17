//
// 홈화면 - 통계 보는 화면
//

import React, { useState } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import HomeStatisticPeriod from "~/screens/MainTab/HomeStatisticPeriod";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";


const tabs = ['주간', '월간'];

const HomeStatistic = () => {
    const [tabLabel, setTabLabel] = useState(tabs[0])

    return (
        <View>
            {/* 상단 탭 */}
            <View style={styles.tabView}>
                {tabs.map(tab => (
                    <Pressable key={tab} onPress={() => setTabLabel(tab)} style={[styles.tab, { backgroundColor: tab == tabLabel ? colors.primary : colors.textGrey }]}>
                        <Text key={tab} style={styles.tabLabel}>{tab}</Text>
                    </Pressable>
                ))}
            </View>

            <HomeStatisticPeriod type={tabLabel} />
        </View>
    )
}

export default HomeStatistic;

const styles = StyleSheet.create({
    tabView: {
        width: dWidth,
        height: verticalScale(50),
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: scale(14),
    },

    tab: {
        width: scale(60),
        height: verticalScale(30),
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: scale(5)
    },

    tabLabel: {
        fontFamily: fonts.bold,
        fontSize: scale(15),
        color: colors.white,
    }

})
