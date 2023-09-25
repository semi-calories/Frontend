//
// 홈화면 - 몸무게 상태 보는 화면
//
import React, { useState, useRef, useMemo, useEffect } from "react";

import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from "react-native-raw-bottom-sheet";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { LineChart } from "react-native-gifted-charts"
import moment from 'moment';

import { CalculateStatisticDate } from "~/components/date";
import { PrimaryButton } from "~/components/button";
import { LabelTextInput } from "~/components/textInput";

import { LineData } from "~/constants/test";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { getWeight, saveWeight, deleteWeight } from "~/apis/api/user";


const HomeWeight = ({ userInfo }) => {
    console.log('HomeWeight userInfo', userInfo)

    //월 선택
    const refRBSheetDate = useRef();
    const [selectDate, setSelectDate] = useState(new Date())
    const [pickerDate, setPickerDate] = useState()

    //차트 몸무게
    const refRBSheetWeight = useRef();
    const [date, setDate] = useState(new Date())
    const [weight, setWeight] = useState('0')

    useEffect(() => {
        //날짜 변경하면 그에 맞는 몸무게 가져와서 세팅
        getWeightFunc()
    }, [date])


    //날짜 포맷
    let formatDate = useMemo(() => moment(selectDate).format('YYYY-MM'), [selectDate]);

    const YearMonthFunc = () => {
        const currentYear = new Date().getFullYear();
        const yearMonthArr = [];

        for (let year = 2010; year <= currentYear; year++) {
            Array.from({ length: 12 }, (v, i) => yearMonthArr.push(`${year}년 ${i + 1}월`));
        }

        return yearMonthArr;
    };
    const yearMonthArray = YearMonthFunc();

    const handleSheet = item => {
        console.log(item)
        // item.label로 setDate
        getWeightFunc()

        refRBSheetWeight.current.open()
    }

    const handlePicker = value => {
        const year = value.substr(0, 4);
        const month = value.slice(6, -1);
        setSelectDate(new Date(`${year}-${month}`))

        refRBSheetDate.current.close();
    }

    //lineDataMaxValue 최대 몸무게 10자리 반올림 + 20
    const lineDataMaxValue = Math.ceil(Math.max(...LineData.map(v => v.value)) / 10) * 10 + 20

    const handleSave = async () => {
        const dateString = date.toISOString().substring(0, 19)

        const weightInfo = {
            userCode: userInfo.userCode,
            userWeight: weight,
            timestamp: dateString
        }

        try {
            await saveWeight(weightInfo)

            Alert.alert('몸무게가 저장되었습니다.')
            refRBSheetWeight.current.close()
        } catch (e) {
            console.error(e)
        }

    }

    const handleDelete = async () => {
        if(!weight) {
            Alert.alert('해당 날짜는 삭제할 몸무게 기록이 없습니다.')
            return;
        }

        const dateString = date.toISOString().substring(0, 19)

        const weightInfo = {
            userCode: userInfo.userCode,
            timestamp: dateString
        }

        try {
            await deleteWeight(weightInfo)

            Alert.alert('몸무게가 삭제되었습니다.')
            refRBSheetWeight.current.close()
        } catch (e) {
            console.error(e)
        }

    }

    const getWeightFunc = async () => {
        const dateString = date.toISOString().substring(0, 19)

        const weightInfo = {
            userCode: userInfo.userCode,
            timestamp: dateString
        }

        try {
            const { response } = await getWeight(weightInfo)
            console.log('getWeightFunc response', response)

            if (response) {
                setWeight(response)
            } else {
                setWeight(0)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <View>
            {/* 날짜 선택하는 뷰 */}
            <View style={styles.dayView}>
                <Pressable onPress={() => setSelectDate(CalculateStatisticDate("주간", 'sub', selectDate))}>
                    <Entypo name="chevron-left" size={35} color="black" />
                </Pressable>
                <Pressable onPress={() => refRBSheetDate.current.open()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.text}>{formatDate}</Text>
                    <Ionicons name="md-caret-down-outline" size={16} color="black" style={{ marginLeft: scale(5) }} />
                </Pressable>
                <Pressable onPress={() => setSelectDate(CalculateStatisticDate("주간", 'add', selectDate))}>
                    <Entypo name="chevron-right" size={35} color="black" />
                </Pressable>
            </View>

            <View style={styles.chartView}>
                <LineChart
                    data={LineData}
                    onPress={item => handleSheet(item)}
                    height={verticalScale(310)}
                    dataPointsHeight={10}
                    dataPointsWidth={10}
                    dataPointsColor={colors.primary}
                    textFontSize={scale(12)}
                    adjustToWidth
                    scrollToEnd
                    //hideYAxisText
                    xAxisType="dashed"
                    xAxisColor={colors.textGrey}
                    dashGap={scale(15)}
                    thickness={3}
                    yAxisThickness={0}
                    //maxValue = noOfSections * stepValue;
                    stepValue={lineDataMaxValue / 5}
                    maxValue={lineDataMaxValue}
                    noOfSections={5}
                    roundToDigits={0.1}
                    isAnimated
                />
            </View>

            <View style={styles.textView}>
                <Text style={styles.greyText}>* 그래프 점을 클릭하면 몸무게를 수정할 수 있습니다 </Text>
            </View>

            {/* 날짜 선택 bottomSheet */}
            <RBSheet
                ref={refRBSheetDate}
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
                <WheelPickerExpo
                    height={verticalScale(260)}
                    width={dWidth}
                    initialSelectedIndex={yearMonthArray.indexOf(moment(selectDate).format('YYYY년 M월'))}
                    items={yearMonthArray.map(name => ({ label: name, value: name }))}
                    onChange={({ item }) => setPickerDate(item.value)}
                />
            </RBSheet>

            {/* 몸무게 추가 bottomSheet */}
            <RBSheet
                ref={refRBSheetWeight}
                height={verticalScale(450)}
                closeOnDragDown={true}
                customStyles={{
                    container: {
                        borderRadius: 10,
                        paddingHorizontal: scale(20),
                        paddingBottom: verticalScale(30)
                    },
                    draggableIcon: {
                        backgroundColor: colors.textGrey
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.box}>
                        <MaterialCommunityIcons name="calendar-blank" size={33} color={colors.black} />
                        <DateTimePicker mode="date" value={date} onChange={(event, selectedDate) => setDate(selectedDate)} />
                    </View>
                    <View style={[styles.box, styles.flexRow]}>
                        <MaterialCommunityIcons name="scale-bathroom" size={33} color={colors.black} />
                        <LabelTextInput type="light" text={weight.toString()} onChangeText={setWeight} unit="kg" width={scale(153)} keyboardType="numeric" />
                    </View>
                </View>
                <View style={styles.btnView}>
                    <PrimaryButton text="삭제" btnStyle={[styles.btnStyle, { backgroundColor: colors.pink }]} onPress={handleDelete} />
                    <PrimaryButton text="저장" btnStyle={styles.btnStyle} onPress={handleSave} />
                </View>
            </RBSheet>
        </View>
    );
}

export default HomeWeight;

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
        marginTop: verticalScale(30),
        //paddingHorizontal: scale(20),
        alignItems: 'center'
    },

    textView: {
        marginTop: verticalScale(30),
        marginHorizontal: scale(15),
        alignItems: 'flex-end'
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: scale(12),
        color: colors.borderGrey,
    },

    box: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(20)
    },

    flexRow: {
        flexDirection: 'row'
    },

    btnView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    btnStyle: {
        width: scale(170),
        height: verticalScale(50)
    }
})