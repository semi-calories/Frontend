//
// 알림 설정 화면
//

import React, { useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { MoveButton } from "~/components/button";

import { scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const NotificationSettingScreen = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(true);

    const [breakfast, setBreakfast] = useState(new Date(2023,8,19,7));
    const [lunch, setLunch] = useState(new Date(2023,8,19,13));
    const [dinner, setDinner] = useState(new Date(2023,8,19,18,30))

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="알림설정" backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    //날짜 포맷; HH:mm 형식 (0~24시간)
    const FormatDate = date =>{
        return moment(date).format('HH:mm')
    }

    const handleComplete=()=>{
        //알림 데이터 서버에 저장

       Alert.alert('식단 알림이 설정되었습니다.')
    }
   
    return (
        <RootView viewStyle={styles.container}>
            <View style={{flex:1}}>
            <View style={styles.flexRow}>
                <Text style={styles.text}>식단 알림 설정</Text>
                <Switch
                    trackColor={{ false: colors.textGrey, true: colors.switch }}
                    thumbColor={colors.white}
                    onValueChange={() => setIsEnabled(!isEnabled)}
                    value={isEnabled}
                />
            </View>
            <Text style={styles.greyText}>정해진 시간에 맞춰 식단 추천 알람을 보내드려요</Text>
            {isEnabled && (
                <View style={{ paddingTop: verticalScale(20), paddingHorizontal: scale(40) }}>
                    <View style={[styles.flexRow, { marginVertical: verticalScale(10) }]}>
                        <Text style={styles.boldGreyText}>아침</Text>
                        <DateTimePicker mode="time" value={breakfast} onChange={(event, selectedDate) => setBreakfast(selectedDate)} />
                    </View>
                    <View style={[styles.flexRow, { marginVertical: verticalScale(10) }]}>
                        <Text style={styles.boldGreyText}>점심</Text>
                        <DateTimePicker mode="time" value={lunch} onChange={(event, selectedDate) => setLunch(selectedDate)} />
                    </View>
                    <View style={[styles.flexRow, { marginVertical: verticalScale(10) }]}>
                        <Text style={styles.boldGreyText}>저녁</Text>
                        <DateTimePicker mode="time" value={dinner} onChange={(event, selectedDate) => setDinner(selectedDate)} />
                    </View>
                </View>
            )}
            </View>
            <MoveButton text="완료" onPress={handleComplete} />
        </RootView>
    );
}

export default NotificationSettingScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(37),
        paddingTop: verticalScale(25)
    },

    text: {
        fontFamily: fonts.bold,
        fontSize: scale(18),
        color: colors.black
    },

    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: scale(12),
        color: colors.borderGrey,
    },

    boldGreyText: {
        fontFamily: fonts.bold,
        fontSize: scale(15),
        color: colors.borderGrey
    }
});