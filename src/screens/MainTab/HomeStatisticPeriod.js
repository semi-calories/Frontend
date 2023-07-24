//
//홈화면 - 통계 - 기간별 보는 화면
//

import React, { useState, useMemo, useRef } from "react";

import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Entypo, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { StackedBarChart } from "react-native-chart-kit";

import { WeekData, MonthData } from "~/constants/test";
import { Nutrition, Nutrition_ko} from '~/constants/food'

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";


const ChartWeekData = {
    labels: ["1주차", "2주차", "3주차", "4주차", "5주차"],
    legend: [Nutrition_ko[Nutrition.carbo], Nutrition_ko[Nutrition.protein], Nutrition_ko[Nutrition.fat]],
    data: WeekData,
    barColors: [colors.carbo, colors.protein, colors.fat]
};

export const ChartMonthData = {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    legend: [Nutrition_ko[Nutrition.carbo], Nutrition_ko[Nutrition.protein], Nutrition_ko[Nutrition.fat]],
    data: MonthData,
    barColors: [colors.carbo, colors.protein, colors.fat]
};

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

            {/* 통계 뷰 */}
            <ScrollView horizontal>
                <StackedBarChart
                    style={styles.chartView}
                    data={type == '주간' ? ChartWeekData : ChartMonthData}
                    width={type == '주간' ? scale(350) : scale(600)}
                    height={verticalScale(350)}
                    chartConfig={styles.chartConfig}
                    hideLegend={true}
                />
            </ScrollView>
            <View style={styles.labelView}>
                <View style={[styles.label, { backgroundColor: colors.carbo }]} />
                <Text style={styles.labelText}>탄수화물</Text>
                <View style={[styles.label, { backgroundColor: colors.protein }]} />
                <Text style={styles.labelText}>단백질</Text>
                <View style={[styles.label, { backgroundColor: colors.fat }]} />
                <Text style={styles.labelText}>지방</Text>
            </View>

            {/* 날짜 선택 bottomSheet */}
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

    chartView: {
        marginTop: verticalScale(40),
        paddingHorizontal: scale(20),
        alignItems: 'center'
    },

    chartConfig: {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
    },

    labelView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(95),
    },

    label: {
        width: scale(12),
        height: verticalScale(12),
        borderRadius: 30,
    },

    labelText: {
        fontFamily: fonts.regular,
        fontSize: scale(12),
        color: colors.label,
    }
})