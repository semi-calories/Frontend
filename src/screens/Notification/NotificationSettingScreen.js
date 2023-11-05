//
// 알림 설정 화면
//

import React, { useLayoutEffect, useState } from "react";

import { View, Text, StyleSheet, Switch, Alert} from "react-native";

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { MoveButton } from "~/components/button";
import { DateTimePickerSelect } from "~/components/date";

import { rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const NotificationSettingScreen = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(true);

    const [breakfast, setBreakfast] = useState(new Date(2023, 8, 19, 7));
    const [lunch, setLunch] = useState(new Date(2023, 8, 19, 13));
    const [dinner, setDinner] = useState(new Date(2023, 8, 19, 18, 30))

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="알림설정" backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    const handleComplete = () => {
        //알림 데이터 서버에 저장

        Alert.alert('식단 알림이 설정되었습니다.')
    }

    return (
        <RootView viewStyle={styles.container}>
            <View style={{ flex: 1 }}>
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
                    <View style={{ paddingTop: rHeight(20), paddingHorizontal: rWidth(40) }}>
                        <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
                            <Text style={styles.boldGreyText}>아침</Text>
                            <DateTimePickerSelect mode="time" value={breakfast} onChange={(event, selectedDate) => setBreakfast(selectedDate)} />
                        </View>
                        <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
                            <Text style={styles.boldGreyText}>점심</Text>
                            <DateTimePickerSelect mode="time" value={lunch} onChange={(event, selectedDate) => setLunch(selectedDate)} />
                      </View>
                        <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
                            <Text style={styles.boldGreyText}>저녁</Text>
                            <DateTimePickerSelect mode="time" value={dinner} onChange={(event, selectedDate) => setDinner(selectedDate)} />
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
        paddingHorizontal: rWidth(37),
        paddingTop: rHeight(25),
    },

    text: {
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
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: rFont(12),
        color: colors.borderGrey,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    boldGreyText: {
        fontFamily: fonts.bold,
        fontSize: rFont(15),
        color: colors.borderGrey,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },
});