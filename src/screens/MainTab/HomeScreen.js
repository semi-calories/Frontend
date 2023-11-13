//
//메인 홈화면
//

import React, { useLayoutEffect, useEffect, useState } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import HomeRecord from "~/screens/MainTab/HomeRecord";
import HomeStatistic from "~/screens/MainTab/HomeStatistic";
import HomeWeight from "~/screens/MainTab/HomeWeight";

import { RootView, TabContainer } from "~/components/container";
import { MainHeader } from "~/components/header";
import { GetUserData } from "~/components/asyncStorageData";

import { dWidth, rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const tabs = ['기록', '통계', '몸무게'];

const HomeScreen = ({ navigation }) => {
    const [tabLabel, setTabLabel] = useState(tabs[0])

    const [user, setUser] = useState({})
    console.log('HomeScreen user', user)

    useLayoutEffect(() => {
        navigation.setOptions({
                //  header: () => <MainHeader notiPress={() => navigation.navigate('NotificationScreen')} userInfoPress={() => navigation.navigate('UserInfoMainScreen')} />
            header: () => <MainHeader userInfoPress={() => navigation.navigate('UserInfoMainScreen')} />
        });
    }, [navigation]);

    useEffect(() => {
        const focusSubscription = navigation.addListener('focus', () => {
            console.log('HomeScreen focus')
            getUser()
        });
        getUser()

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return focusSubscription;
    }, [navigation, tabLabel]);

    const getUser = async () => {
        const data = await GetUserData();

        setUser({ ...data })
    }

    return (
        <TabContainer>
            <RootView>
                {/* 상단 탭 */}
                <View style={styles.tab}>
                    {tabs.map(tab => (
                        <Pressable key={tab} onPress={() => setTabLabel(tab)}>
                            <Text key={tab} style={[styles.tabLabel, { color: tab === tabLabel ? colors.black : colors.textGrey }]}>{tab}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* 기록 화면 */}
                {tabLabel == tabs[0] && <HomeRecord navigation={navigation} userInfo={user} />}

                {/* 통계 화면 */}
                {tabLabel == tabs[1] && <HomeStatistic userInfo={user} />}

                {/* 몸무게 화면 */}
                {tabLabel == tabs[2] && <HomeWeight userInfo={user} />}
            </RootView>
        </TabContainer>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    tab: {
        width: dWidth,
        //height: rHeight(40),
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: rWidth(14),
    },

    tabLabel: {
        fontFamily: fonts.bold,
        fontSize: rFont(23),

        marginHorizontal: rWidth(7),

        includeFontPadding: false,
        textAlignVertical: 'center'
    }
});