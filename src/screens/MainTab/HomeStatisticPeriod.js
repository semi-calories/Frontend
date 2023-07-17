//
//홈화면 - 통계 - 기간별 보는 화면
//

import React, { useState, useMemo, useRef } from "react";

import { StyleSheet, Text, View, Pressable } from "react-native";
import { Entypo, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";
import WheelPickerExpo from 'react-native-wheel-picker-expo';

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const HomeStatisticPeriod = ({ type }) => {

    const refRBSheet = useRef();

    const [selectDate, setSelectDate] = useState(new Date())
    console.log(selectDate)
    const [pickerDate, setPickerDate] = useState()

    //날짜 포맷
    let formatDate = useMemo(() => moment(selectDate).format(type == '주간' ? 'YYYY-MM' : 'YYYY'), [selectDate, type]);

    const CalculateDate = (type, calculation, date) => {
        const clone = new Date(date);

        if (type == '주간') {
            let adjustDate = date.getMonth();
            clone.setMonth(calculation == 'add' ? adjustDate + 1 : adjustDate - 1)
        } else if (type == '월간') {
            let adjustDate = date.getFullYear();
            clone.setFullYear(calculation == 'add' ? adjustDate + 1 : adjustDate - 1)
        }

        return clone;
    }

    const YearMonthFunc = () => {
        const currentYear = new Date().getFullYear();
        const yearMonthArr = [];

        for (let year = 2010; year <= currentYear; year++) {
            Array.from({ length: 12 }, (v, i) => yearMonthArr.push(`${year}년 ${i + 1}월`));
        }

        return yearMonthArr;
    };
    const yearMonthArray = YearMonthFunc();

    const YearFunc = () => {
        const currentYear = new Date().getFullYear();
        const yearArr = [];

        for (let year = 2010; year <= currentYear; year++) {
            yearArr.push(year.toString());
        }

        return yearArr;
    };
    const yearArray = YearFunc();

    const handlePicker = value => {
        console.log(value)

        if (type == '주간') {
            const year = value.substr(0, 4);
            const month = value.slice(6, -1);
            setSelectDate(new Date(`${year}-${month}`))
        } else if (type == '월간') {
            setSelectDate(new Date(value))
        }

        refRBSheet.current.close();
    }

    return (
        <View>
            {/* 날짜 선택하는 뷰 */}
            <View style={styles.dayView}>
                <Pressable onPress={() => setSelectDate(CalculateDate(type, 'sub', selectDate))}>
                    <Entypo name="chevron-left" size={35} color="black" />
                </Pressable>
                <Pressable onPress={() => refRBSheet.current.open()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.text}>{formatDate}</Text>
                    <Ionicons name="md-caret-down-outline" size={16} color="black" style={{ marginLeft: scale(5) }} />
                </Pressable>
                <Pressable onPress={() => setSelectDate(CalculateDate(type, 'add', selectDate))}>
                    <Entypo name="chevron-right" size={35} color="black" />
                </Pressable>
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
                <Pressable onPress={() => handlePicker(pickerDate)} style={styles.selectView} >
                    <Text style={styles.text}>선택</Text>
                </Pressable>
                {type == '주간' ?
                    <WheelPickerExpo
                        height={verticalScale(260)}
                        width={dWidth}
                        initialSelectedIndex={yearMonthArray.indexOf(moment(selectDate).format('YYYY년 M월'))}
                        items={yearMonthArray.map(name => ({ label: name, value: name }))}
                        onChange={({ item }) => setPickerDate(item.value)}
                    />
                    :
                    <WheelPickerExpo
                        height={verticalScale(260)}
                        width={dWidth}
                        initialSelectedIndex={yearArray.indexOf(selectDate.getFullYear().toString())}
                        items={yearArray.map(name => ({ label: name, value: name }))}
                        onChange={({ item }) => setPickerDate(item.value)}
                    />
                }
            </RBSheet>
        </View>
    );
}

export default HomeStatisticPeriod;

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

    text: {
        fontFamily: fonts.medium,
        fontSize: scale(18),
        color: colors.black,
    },

    selectView: {
        paddingHorizontal: scale(20),
        alignItems: 'flex-end'
    },
})