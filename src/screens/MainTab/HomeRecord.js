//
// 홈화면 - 기록 상태 보는 화면
//

import React, { useState, useRef, useMemo, useEffect } from "react";

import { View, Text, StyleSheet, Pressable, TouchableOpacity, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { Entypo, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";

import { DonutChart } from "~/components/chart";
import { CalculateRecordDate } from "~/components/date";

import { Nutrition, Nutrition_ko } from "~/constants/food";
import { RecordType } from "~/constants/type";
import { SpentAmount, TargetAmount, SpentNutri, TargetNutri, FoodRecord } from "~/constants/test";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { getRecord } from "~/apis/api/diet";


const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const HomeRecord = ({ navigation, userInfo }) => {

    const refRBSheetCalendar = useRef();
    const refRBSheetRecord = useRef();

    const [selectDate, setSelectDate] = useState(new Date())
    console.log('HomeRecord selectDate', selectDate)

    const [records, setRecords] = useState([])
    console.log('HomeRecord records', records)

    useEffect(() => {
        if (userInfo.userCode) {
            getDietRecord()
        }
    }, [selectDate, userInfo])

    //요일 계산
    let day = useMemo(() => DAYS[selectDate.getDay()], [selectDate]);
    //날짜 포맷; YYYY-MM-DD 형식
    let formatDate = useMemo(() => moment(selectDate).format('YYYY-MM-DD'), [selectDate]);

    const getDietRecord = async () => {
        const recordInfo = {
            userCode: userInfo.userCode,
            dateTime: moment(selectDate).format('YYYY-MM-DD')
        }

        try {
            const { userRecordDtos } = await getRecord(recordInfo)

            setRecords([...userRecordDtos])
        } catch (err) {
            console.log(err)
        }
    }

    const NutritionFunc = ({ name }) => {
        let nutri = '';

        switch (name) {
            case 'foodCarbo':
                nutri = 'carbo';
                break
            case 'foodProtein':
                nutri = 'protein';
                break
            case 'foodFat':
                nutri = 'fat';
                break
            default:
                break;
        }

        const target = Math.round(userInfo[nutri])
        const spent = Math.round(caculateSpent(Nutrition[name]));
        const ratio = Math.round(spent / target * 100);

        return (
            <View style={[styles.flexRowSpaceBetween, { marginVertical: verticalScale(17) }]}>
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

    const renderItem = ({ item }) => {
        return (
            <Pressable style={styles.container} onPress={() => handleDetail(item)}>
                <View style={styles.flexRowSpaceBetween}>
                    <Text style={styles.text}>{item.dietRecordList.foodName}</Text>
                    <Text style={styles.greyText}>{item.dietRecordList.foodKcal} kcal</Text>
                </View>
                <View style={[styles.flexRowSpaceBetween, { marginTop: verticalScale(10), paddingHorizontal: scale(5) }]}>
                    <View style={styles.nutri}>
                        <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodCarbo]}</Text>
                        <Text style={styles.greyText}>{item.dietRecordList.foodCarbo} g</Text>
                    </View>
                    <View style={styles.verticalBorder} />
                    <View style={styles.nutri}>
                        <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodProtein]}</Text>
                        <Text style={styles.greyText}>{item.dietRecordList.foodProtein} g</Text>
                    </View>
                    <View style={styles.verticalBorder} />
                    <View style={styles.nutri}>
                        <Text style={styles.greyText}>{Nutrition_ko[Nutrition.foodFat]}</Text>
                        <Text style={styles.greyText}>{item.dietRecordList.foodFat} g</Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    const caculateSpent = nutri => {
        return records.reduce((acc, cur, idx) => { return acc += cur.dietRecordList[nutri] }, 0)
    }

    const handleDetail = (item) => {
        const detail = {
            foodCode: item.foodCode,
            eatDate: item.dietRecordList.eatDate,
            foodCarbo: item.dietRecordList.foodCarbo,
            foodFat: item.dietRecordList.foodFat,
            foodKcal: item.dietRecordList.foodKcal,
            foodName: item.dietRecordList.foodName,
            foodProtein: item.dietRecordList.foodProtein,
            foodWeight: item.dietRecordList.foodWeight,
            satisfaction: item.userSatisfactionList.satisfaction,
        }
        console.log('handleDetail detail', [detail])

        refRBSheetRecord.current.close()
        navigation.navigate('MealtimeScreen', { foodParam: [detail], userInfo, type: RecordType.edit})
    }

    return (
        <View>
            {/* 날짜 선택하는 뷰 */}
            <View style={styles.dayView}>
                <Pressable onPress={() => setSelectDate(CalculateRecordDate('sub', selectDate))}>
                    <Entypo name="chevron-left" size={35} color="black" />
                </Pressable>
                <Pressable onPress={() => refRBSheetCalendar.current.open()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.text}>{moment(selectDate).format(`MM월 DD일 (${day})`)}</Text>
                    <Ionicons name="md-caret-down-outline" size={16} color="black" style={{ marginLeft: scale(5) }} />
                </Pressable>
                <Pressable onPress={() => setSelectDate(CalculateRecordDate('add', selectDate))}>
                    <Entypo name="chevron-right" size={35} color="black" />
                </Pressable>
            </View>

            {/* 차트 및 기록 뷰 */}
            <View style={styles.graphWrapper}>
                <Pressable onPress={() => refRBSheetRecord.current.open()}>
                    <DonutChart spentAmount={Math.round(caculateSpent(Nutrition.foodKcal))} targetAmount={Math.round(userInfo?.kcal)} />
                </Pressable>
            </View>

            {/* 탄단지 영양성분 뷰 */}
            <View style={styles.nutritionView}>
                <NutritionFunc name={Nutrition.foodCarbo} />
                <NutritionFunc name={Nutrition.foodProtein} />
                <NutritionFunc name={Nutrition.foodFat} />
            </View>

            {/* 캘린더 */}
            <RBSheet
                ref={refRBSheetCalendar}
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
                                refRBSheetCalendar.current.close();
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

            {/* 식단조회 */}
            <RBSheet
                ref={refRBSheetRecord}
                height={verticalScale(500)}
                closeOnDragDown={true}
                customStyles={{
                    container: {
                        borderRadius: 10,
                        paddingHorizontal: scale(30),
                        paddingBottom: verticalScale(30)
                    },
                    draggableIcon: {
                        backgroundColor: colors.textGrey
                    }
                }}
            >
                <FlatList
                    data={records}
                    renderItem={renderItem}
                    keyExtractor={(item, idx) => item + idx}
                    showsVerticalScrollIndicator="false"
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

    flexRowSpaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: scale(16),
        color: colors.borderGrey,
    },

    container: {
        paddingVertical: verticalScale(24),

        borderBottomWidth: scale(1),
        borderBottomColor: colors.textGrey,
    },

    nutri: {
        width: scale(80),
        alignItems: 'center',
    },

    verticalBorder: {
        width: scale(1),
        height: verticalScale(24),
        backgroundColor: colors.textGrey
    },
})


