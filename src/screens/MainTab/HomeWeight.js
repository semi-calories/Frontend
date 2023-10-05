//
// 홈화면 - 몸무게 상태 보는 화면
//
import React, { useState, useRef, useMemo, useEffect } from "react";

import { View, Text, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from "react-native-raw-bottom-sheet";
import { LineChart } from "react-native-gifted-charts"
import { Chip } from 'react-native-paper';

import { MoveButton, PrimaryButton } from "~/components/button";
import { BasicTextInput } from "~/components/textInput";
import { StoreUserData } from "~/components/asyncStorageData";
import { weightRegex } from "~/components/regex";

import { LineData } from "~/constants/test";

import { dWidth, scale, verticalScale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { getInfo, getWeight, saveWeight, deleteWeight, getMonthRangeWeight } from "~/apis/api/user";
import { getStructedRangeWeight } from "~/apis/services/user";

const FILTERPERIOD = ['최근 1개월', '3개월', '6개월', '1년'];

const HomeWeight = ({ userInfo }) => {
    //상단 필터 관련
    const refRBSheetFilter = useRef();

    const before1Month = new Date(new Date().setMonth(new Date().getMonth() - 1))
    const [startDate, setStartDate] = useState(before1Month)
    const [endDate, setEndDate] = useState(new Date())

    const [modal, setModal] = useState(false)

    const [period, setPeriod] = useState('최근 1개월')


    //차트 몸무게
    const refRBSheetWeight = useRef();

    const [lineData, setLineData] = useState([])
    console.log('HomeWeight lineData', lineData)

    const [date, setDate] = useState(new Date())
    const [weight, setWeight] = useState('0')

    //chart에러 나는거 막기 위함
    const [isLoaded, setLoaded] = useState(false)

    useEffect(() => {
        if (userInfo.userCode) {
            getRangeWeight()
            setLoaded(true)
        }
    }, [modal])

    const handlePressChart = item => {
        console.log(item)
        // item.label로 setDate
        getDayWeight()

        refRBSheetWeight.current.open()
    }

    //lineDataMaxValue 최대 몸무게 10자리 반올림 + 20
    const lineDataMaxValue = useMemo(() => Math.ceil(Math.max(...lineData.map(v => v.value)) / 10) * 10 + 20, [lineData])


    //몸무게 저장
    const handleSave = async () => {
        const dateString = date.toISOString().substring(0, 19)

        const weightInfo = {
            userCode: userInfo.userCode,
            userWeight: weight,
            timestamp: dateString
        }

        try {
            await saveWeight(weightInfo)

            const userData = await getInfo({ userCode: userInfo.userCode })
            StoreUserData({ ...userData, userCode: userInfo.userCode, weight: userData.weight })

            Alert.alert('몸무게가 저장되었습니다.')
            refRBSheetWeight.current.close()
        } catch (e) {
            console.error(e)
        }

    }

    //몸무게 삭제
    const handleDelete = async () => {
        if (!weight) {
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

            const userData = await getInfo({ userCode: userInfo.userCode })
            StoreUserData({ ...userData, userCode: userInfo.userCode, weight: userData.weight })

            Alert.alert('몸무게가 삭제되었습니다.')
            refRBSheetWeight.current.close()
        } catch (e) {
            console.error(e)
        }

    }

    //특정날 몸무게 조회
    const getDayWeight = async () => {
        const dateString = date.toISOString().substring(0, 19)

        const weightInfo = {
            userCode: userInfo.userCode,
            timestamp: dateString
        }

        try {
            const { response } = await getWeight(weightInfo)
            console.log('getWeightFunc response', response)

            if (response) {
                setWeight(response.weight)
            } else {
                setWeight(0)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleRange = () => {
        setModal(!modal)

        refRBSheetFilter.current.close()
    }

    //기간 몸무게 조회
    const getRangeWeight = async () => {
        const weightInfo = {
            userCode: userInfo.userCode,
            startYear: startDate.getFullYear(),
            startMonth: startDate.getMonth() + 1,
            startDay: startDate.getDate(),
            endYear: endDate.getFullYear(),
            endMonth: endDate.getMonth() + 1,
            endDay: endDate.getDate(),
        }

        try {
            const { weightList: rawWeightList } = await getMonthRangeWeight(weightInfo)
            const weightList = getStructedRangeWeight(rawWeightList)
            console.log('getRangeWeight weightList', weightList)

            setLineData([...weightList])

        } catch (e) {
            console.error(e)
        }
    }

    const handlePeriod = per => {
        setPeriod(per)

        let date = ''

        switch (per) {
            case '최근 1개월':
                date = new Date(new Date().setMonth(new Date().getMonth() - 1))
                break;
            case '3개월':
                date = new Date(new Date().setMonth(new Date().getMonth() - 3))
                break;
            case '6개월':
                date = new Date(new Date().setMonth(new Date().getMonth() - 6))
                break;
            case '1년':
                date = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                break;
            default:
                break;
        }
        setStartDate(date)
    }

    return (
        <View>
            <View style={styles.dayView}>
                <Text style={styles.text}>최근 1개월</Text>
                <FontAwesome name="sliders" onPress={() => refRBSheetFilter.current.open()} size={23} color={colors.borderGrey} />
            </View>


            <View style={styles.chartView}>
                {isLoaded &&
                    <LineChart
                        data={lineData}
                        color={colors.primary}
                        onPress={item => handlePressChart(item)}
                        height={verticalScale(310)}
                        dataPointsHeight={10}
                        dataPointsWidth={10}
                        dataPointsColor={colors.linePoint}
                        textFontSize={scale(12)}
                        adjustToWidth
                        scrollToEnd
                        hideYAxisText
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
                    //isAnimated
                    />
                }

            </View>

            <View style={styles.textView}>
                <Text style={styles.greyText}>* 그래프 점을 클릭하면 몸무게를 수정할 수 있습니다 </Text>
            </View>


            {/* 상단 필터 - 기간설정 */}
            <RBSheet
                ref={refRBSheetFilter}
                height={verticalScale(320)}
                closeOnDragDown={true}
                customStyles={{
                    container: {
                        borderRadius: 10,
                        paddingHorizontal: scale(20),
                        paddingBottom: verticalScale(30),
                    },
                    draggableIcon: {
                        backgroundColor: colors.textGrey
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={styles.text}>기간설정</Text>
                    <View style={[styles.rangeView, { marginTop: verticalScale(20) }]}>
                        {FILTERPERIOD.map((per, idx) => (
                            <Chip
                                id={per + idx}
                                mode="outlined"
                                onPress={() => handlePeriod(per)}
                                style={{ backgroundColor: per == period ? colors.btnBackground : colors.white, borderColor: per == period ? colors.white : colors.btnBackground }}
                            >
                                {per}
                            </Chip>
                        ))
                        }
                    </View>
                    <View style={styles.rangeView}>
                        <DateTimePicker mode="date" value={startDate} onChange={(event, selectedDate) => setStartDate(selectedDate)} />
                        <Text style={styles.text}>-</Text>
                        <DateTimePicker mode="date" value={endDate} onChange={(event, selectedDate) => setEndDate(selectedDate)} />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <MoveButton text="조회" onPress={handleRange} />
                </View>
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
                        <BasicTextInput value={weight.toString()} onChangeText={setWeight} unit="kg" width={scale(153)} keyboardType="numeric" validType="몸무게" valid={weightRegex.test(weight)} />
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

    rangeView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: verticalScale(8),
        //paddingHorizontal: scale(20)
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