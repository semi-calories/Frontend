//
// 홈화면 - 기록 상태 보는 화면
//

import React, { useState, useRef, useMemo } from "react";

import { View, Text, StyleSheet, Pressable, TouchableOpacity, PixelRatio } from "react-native";
import { Calendar } from "react-native-calendars";
import { Entypo, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";


const days = ["일", "월", "화", "수", "목", "금", "토"];



const CalculateDays = (type, date, days) => {
    const clone = new Date(date);

    if (type == 'add')
        clone.setDate(date.getDate() + days)
    if (type == 'sub')
        clone.setDate(date.getDate() - days)

    return clone;
}

const HomeRecord = () => {
    const refRBSheet = useRef();
    const [selectDate, setSelectDate] = useState(new Date())

    let day = useMemo(() => days[selectDate.getDay()], [selectDate]);
    let formatDate = useMemo(() => moment(selectDate).format('YYYY-MM-DD'), [selectDate]);

    return (
        <View>
            {/* 날짜 선택하는 뷰 */}
            <View style={styles.dayView}>
                <Pressable onPress={() => setSelectDate(CalculateDays('sub', selectDate, 1))}>
                    <Entypo name="chevron-left" size={35} color="black" />
                </Pressable>
                <Pressable onPress={() => refRBSheet.current.open()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.dateText}>{moment(selectDate).format(`MM월 DD일 (${day})`)}</Text>
                    <Ionicons name="md-caret-down-outline" size={16} color="black" style={{ marginLeft: scale(5) }} />
                </Pressable>
                <Pressable onPress={() => setSelectDate(CalculateDays('add', selectDate, 1))}>
                    <Entypo name="chevron-right" size={35} color="black" />
                </Pressable>
            </View>

            {/* 차트 및 기록 뷰 */}
            <View style={styles.donutContainer}>
               
            </View>

            {/* 캘린더 */}
            <RBSheet
                ref={refRBSheet}
                height={verticalScale(320)}
                closeOnDragDown={true}
                customStyles={{
                    container: {
                        borderRadius: 10,
                    },
                    draggableIcon: {
                        backgroundColor: colors.textGrey
                    }
                }}
            >
                <Calendar
                    initialDate={formatDate}
                    hideExtraDays={true}
                    dayComponent={({ date }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setSelectDate(new Date(date.dateString))
                                refRBSheet.current.close();
                            }}>
                                <Text style={[styles.calendarText, { color: formatDate == date.dateString ? colors.primary : colors.black }]}>{date.day}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    theme={{
                        arrowColor: colors.black,
                    }}
                />
            </RBSheet>
        </View>
    )
}

export default HomeRecord;

const styles = StyleSheet.create({
    dayView: {
        width: dWidth,
        height: verticalScale(35),
        marginTop: verticalScale(20),
        paddingHorizontal: scale(20),

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dateText: {
        fontFamily: fonts.medium,
        fontSize: scale(18),
        color: colors.black,
    },

    calendarText: {
        textAlign: 'center',
        fontSize: scale(15)
    },

})


