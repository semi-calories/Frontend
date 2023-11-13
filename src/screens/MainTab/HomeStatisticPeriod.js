//
//홈화면 - 통계 - 기간별 보는 화면
//

import React, { useState, useMemo, useRef, useEffect } from "react";

import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Entypo, Ionicons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { StackedBarChart } from "react-native-chart-kit";
import moment from 'moment';

import { CalculateStatisticDate, CalculateWeek, FormatWeekData } from "~/components/date";

import { WeekData, MonthData } from "~/constants/test";
import { Nutrition, Nutrition_ko } from '~/constants/food'

import { dWidth, rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { getMonthStats, getWeekStats } from "~/apis/api/diet";


const HomeStatisticPeriod = ({ type, userInfo }) => {

    const refRBSheet = useRef();

    const [selectDate, setSelectDate] = useState(new Date())
    console.log("HomeStatisticPeriod selectDate", selectDate)
    const [pickerDate, setPickerDate] = useState()
    console.log("HomeStatisticPeriod pickerDate", pickerDate)

    const [monthData, setMonthData] = useState([])
    console.log('HomeStatisticPeriod monthData', monthData)
    const [weekData, setWeekData] = useState([])
    console.log('HomeStatisticPeriod weekData', weekData)

    useEffect(() => {
        if (type == '주간') {
            getDietWeekStats()
        } else if (type == '월간') {
            getDietMonthStats()
        }
    }, [selectDate, type])

    const getDietMonthStats = async () => {
        const statInfo = {
            userCode: userInfo.userCode,
            year: moment(selectDate).format('YYYY')
        }

        try {
            const { monthList } = await getMonthStats(statInfo)
            console.log('HomeStatisticPeriod monthList', monthList)

            setMonthData([...monthList])
        } catch (err) {
            console.log(err)
        }
    }

    const getDietWeekStats = async () => {
        const rawMonthInfo = CalculateWeek(selectDate.getFullYear(), selectDate.getMonth() + 1)
        const monthInfo = FormatWeekData(rawMonthInfo)

        const userCode = { userCode: userInfo.userCode }
        const month = { calculateWeek: monthInfo }

        try {
            const { weekList } = await getWeekStats(userCode, month)
            console.log('HomeStatisticPeriod weekList', weekList)

            setWeekData([...weekList])
        } catch (err) {
            console.log(err)
        }
    }

    //날짜 포맷
    let formatDate = useMemo(() => moment(selectDate).format(type == '주간' ? 'YYYY-MM' : 'YYYY'), [selectDate, type]);

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

    //차트 관련
    const ChartMonthData = {
        labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        legend: [Nutrition_ko[Nutrition.foodCarbo], Nutrition_ko[Nutrition.foodProtein], Nutrition_ko[Nutrition.foodFat]],
        data: monthData,
        barColors: [colors.carbo, colors.protein, colors.fat]
    };

    const ChartWeekData = {
        labels: ["1주차", "2주차", "3주차", "4주차", "5주차"],
        legend: [Nutrition_ko[Nutrition.foodCarbo], Nutrition_ko[Nutrition.foodProtein], Nutrition_ko[Nutrition.foodFat]],
        data: weekData,
        barColors: [colors.carbo, colors.protein, colors.fat]
    };


    return (
        <View>
            {/* 날짜 선택하는 뷰 */}
            <View style={styles.dayView}>
                <Pressable onPress={() => setSelectDate(CalculateStatisticDate(type, 'sub', selectDate))}>
                    <Entypo name="chevron-left" size={rHeight(35)} color="black" />
                </Pressable>
                <Pressable onPress={() => refRBSheet.current.open()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.text}>{formatDate}</Text>
                    <Ionicons name="md-caret-down-outline" size={rWidth(16)} color="black" style={{ marginLeft: rWidth(5) }} />
                </Pressable>
                <Pressable onPress={() => setSelectDate(CalculateStatisticDate(type, 'add', selectDate))}>
                    <Entypo name="chevron-right" size={rHeight(35)} color="black" />
                </Pressable>
            </View>

            {/* 통계 뷰 */}
            <ScrollView horizontal>
                <StackedBarChart
                    style={styles.chartView}
                    data={type == '주간' ? ChartWeekData : ChartMonthData}
                    width={type == '주간' ? rWidth(350) : rWidth(600)}
                    height={rHeight(350)}
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
                height={rHeight(320)}
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
                        height={rHeight(260)}
                        width={dWidth}
                        initialSelectedIndex={yearMonthArray.indexOf(moment(selectDate).format('YYYY년 M월'))}
                        items={yearMonthArray.map(name => ({ label: name, value: name }))}
                        onChange={({ item }) => setPickerDate(item.value)}
                    />
                    :
                    <WheelPickerExpo
                        height={rHeight(260)}
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
        height: rHeight(35),
        marginTop: rHeight(20),
        paddingHorizontal: rWidth(20),

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    text: {
        fontFamily: fonts.medium,
        fontSize: rFont(18),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    selectView: {
        paddingHorizontal: rWidth(20),
        alignItems: 'flex-end'
    },

    chartView: {
        marginTop: rHeight(40),
        paddingHorizontal: rWidth(20),
        alignItems: 'center',

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
        paddingHorizontal: rWidth(95),
    },

    label: {
        width: rHeight(12),
        height: rHeight(12),
        borderRadius: rHeight(30),
    },

    labelText: {
        fontFamily: fonts.regular,
        fontSize: rFont(12),
        color: colors.label,

        includeFontPadding: false,
        textAlignVertical: 'center'
    }
})