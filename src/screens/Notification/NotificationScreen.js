//
// 알림 보여주는 화면
//

import React, { useEffect, useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, FlatList } from "react-native";
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { GetUserData } from "~/components/asyncStorageData";
import { getFoodTimes } from "~/components/date";

import { HeaderType } from "~/constants/type";
import { NotiData } from "~/constants/test";

import { rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { getAlertRecord } from "~/apis/api/pushNotification";

const NotificationScreen = ({ navigation }) => {
    const [user, setUser] = useState({})
    console.log("NotificationScreen user", user)

    const [alertRecord, setAlertRecord] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="알림" backPress={() => navigation.goBack()} rightType={HeaderType.setting} rightPress={() => navigation.navigate('NotificationSettingScreen')} />
        });
    }, [navigation]);

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        if (user.constructor === Object
            && Object.keys(user).length === 0) {
            return;
        }

        getNotiRecord();
    }, [user])

    const getUser = async () => {
        const data = await GetUserData();

        setUser({ ...data })
    }

    const getNotiRecord = async () => {
        const today = new Date();
        let lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7)

        const params = {
            userCode: user.userCode,
            startYear: lastWeek.getFullYear(),
            startMonth: lastWeek.getMonth() + 1,
            startDay: lastWeek.getDate(),
            endYear: today.getFullYear(),
            endMonth: today.getMonth() + 1,
            endDay: today.getDate(),
        }
        //console.log(params)

        try {
            const { alertRecordList } = await getAlertRecord(params)
            //console.log("getNotiRecord", alertRecordList)

            setAlertRecord([...alertRecordList])
        } catch (err) {
            console.log(err)
        }
    }

    const renderItem = ({ item }) => {
        const month = item.alertDate.substr(5, 2)
        const date = item.alertDate.substr(8, 2)
        const hour = item.alertDate.substr(11, 2)
        const min = item.alertDate.substr(14, 2)
        const foodTime = getFoodTimes(item.foodTimes)
        //console.log(month,date, hour, min, foodTime)

        return (
            <View style={styles.foodView}>
                <View style={[styles.flexRow, styles.spaceBet, { marginBottom: rHeight(10) }]}>
                    <View style={styles.flexRow}>
                        <Text style={styles.boldText}>{month}월 {date}일</Text>
                        <Text style={styles.boldText}> {foodTime} 추천</Text>
                    </View>
                    <View style={styles.flexRow}>
                        <Text style={styles.greyText}>{month}월 {date}일</Text>
                        <Text style={styles.greyText}> {hour}시 {min}분</Text>
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
            {alertRecord.length ?
                <FlatList
                    data={alertRecord}
                    renderItem={renderItem}
                    keyExtractor={(item, idx) => item + idx}
                //showsVerticalScrollIndicator="false"
                />
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <AntDesign name="exclamationcircleo" size={rWidth(60)} color={colors.btnBackground} />
                    <Text style={[styles.text, { marginTop: rHeight(15) }]}>알림 기록이 없습니다.</Text>
                </View>
            }
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