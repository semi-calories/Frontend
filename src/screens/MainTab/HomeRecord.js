//
// 홈화면 - 기록 상태 보는 화면
//

import React, { useState, useRef, useMemo } from "react";

import { View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { Entypo, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";

import { DonutChart } from "~/components/chart";

import { Nutrition, Nutrition_ko } from "~/constants/food";
import { SpentAmount, TargetAmount, SpentNutri, TargetNutri } from "~/constants/test";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";


const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const HomeRecord = () => {

    const refRBSheet = useRef();
    const [selectDate, setSelectDate] = useState(new Date())

    //요일 계산
    let day = useMemo(() => DAYS[selectDate.getDay()], [selectDate]);
    //날짜 포맷; YYYY-MM-DD 형식
    let formatDate = useMemo(() => moment(selectDate).format('YYYY-MM-DD'), [selectDate]);

    const CalculateDate = (calculation, date) => {
        const clone = new Date(date);

        if (calculation == 'add')
            clone.setDate(date.getDate() + 1)
        if (calculation == 'sub')
            clone.setDate(date.getDate() - 1)

        return clone;
    }

    const NutritionFunc = ({ name }) => {
        const spent = SpentNutri[Nutrition[name]];
        const target = TargetNutri[Nutrition[name]];
        const ratio = Math.round(spent / target * 100);

        return (
            <View style={[styles.flexRow, { marginVertical: verticalScale(17), justifyContent: 'space-between' }]}>
                <Text style={[styles.text, { width: scale(67) }]}>{Nutrition_ko[name]}</Text>
                <View style={[styles.flexRow, { width: scale(72) }]}>
                    <Text style={[styles.text, { fontFamily: fonts.bold }]}>{spent}</Text>
                    <Text style={styles.greyText}> / {target} g</Text>
                </View>
                <View style={[styles.flexRow, { width: scale(38) }]}>
                    <Text style={[styles.text, { fontFamily: fonts.bold }]}>{ratio}</Text>
                    <Text style={styles.greyText}> %</Text>
                </View>
            </View>
        )
    }

    return (
        <View>
            {/* 날짜 선택하는 뷰 */}
            <View style={styles.dayView}>
                <Pressable onPress={() => setSelectDate(CalculateDate('sub', selectDate))}>
                    <Entypo name="chevron-left" size={35} color="black" />
                </Pressable>
                <Pressable onPress={() => refRBSheet.current.open()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.text}>{moment(selectDate).format(`MM월 DD일 (${day})`)}</Text>
                    <Ionicons name="md-caret-down-outline" size={16} color="black" style={{ marginLeft: scale(5) }} />
                </Pressable>
                <Pressable onPress={() => setSelectDate(CalculateDate('add', selectDate))}>
                    <Entypo name="chevron-right" size={35} color="black" />
                </Pressable>
            </View>

            {/* 차트 및 기록 뷰 */}
            <View style={styles.graphWrapper}>
                <DonutChart spentAmount={SpentAmount} targetAmount={TargetAmount} />
            </View>

            {/* 탄단지 영양성분 뷰 */}
            <View style={styles.nutritionView}>
                <NutritionFunc name={Nutrition.carbo} />
                <NutritionFunc name={Nutrition.protein} />
                <NutritionFunc name={Nutrition.fat} />
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

    text: {
        fontFamily: fonts.medium,
        fontSize: scale(18),
        color: colors.black,
    },

    calendarText: {
        textAlign: 'center',
        fontSize: scale(15)
    },

    graphWrapper: {
        paddingTop: verticalScale(60),
        paddingBottom: verticalScale(35),
    },

    nutritionView: {
        width: scale(280),
        height: verticalScale(202),
        borderWidth: scale(2),
        borderRadius: 10,
        borderColor: colors.textGrey,
        marginHorizontal: scale(55),

        paddingHorizontal: scale(22),
        paddingVertical: verticalScale(10),
    },

    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: scale(16),
        color: colors.borderGrey,
    },
})


