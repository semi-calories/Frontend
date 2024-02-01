//
// 홈화면 - 몸무게 상태 보는 화면
//
import React, { useState, useRef, useMemo, useEffect } from "react";

import { View, Text, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { LineChart } from "react-native-gifted-charts"
import { useSetRecoilState } from "recoil";

import { MoveButton, PrimaryButton } from "~/components/button";
import { BasicTextInput } from "~/components/textInput";
import { weightRegex } from "~/components/regex";
import { DateTimePickerSelect } from "~/components/date";
import { BasicChip } from "~/components/chip";

import { LineData } from "~/constants/test";

import { UserState } from "~/atoms/UserAtom";

import { dWidth, rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { getInfo, getWeight, saveWeight, deleteWeight, getMonthRangeWeight, getPredictWeight } from "~/apis/api/user";
import { getStructedRangeWeight, getStructedPredictWeight } from "~/apis/services/user";

const FILTERPERIOD = ['최근 1개월', '3개월', '6개월', '1년'];

const HomeWeight = ({ userInfo }) => {
    //상단 필터 관련
    const refRBSheetFilter = useRef();

    const before1Month = new Date(new Date().setMonth(new Date().getMonth() - 1))
    const [startDate, setStartDate] = useState(before1Month)
    const [endDate, setEndDate] = useState(new Date())

    const [modal, setModal] = useState(false)

    const [filterPeriod, setFilterPeriod] = useState('최근 1개월')
    const [period, setPeriod] = useState('최근 1개월')

    //차트 몸무게
    const refRBSheetWeight = useRef();

    const [lineData, setLineData] = useState([])
    console.log('HomeWeight lineData', lineData)

    const [predictLine, setPredictLine] = useState([])
    console.log('HomeWeight predictLine', predictLine)
    const [predictStartIndex, setPredictStartIndex] = useState(0)
    const [predictEndIndex, setPredictEndIndex] = useState(0)
    //console.log('predictStartIndex', predictEndIndex)

    const [selectDate, setSelectDate] = useState(new Date())
    console.log('selectDate', selectDate)
    const [weight, setWeight] = useState('0')

    //chart에러 나는거 막기 위함
    const [isLoaded, setLoaded] = useState(false)

    const setUserState = useSetRecoilState(UserState);

    useEffect(() => {
        if (userInfo.userCode) {
            handleRangeWeight()
            setLoaded(true)
        }
    }, [modal])

    useEffect(() => {
        getDayWeight()
    }, [selectDate])

    const handlePressChart = item => {
        console.log('handlePressChart item', item)

        if(!item.dataPointText) return;

        const year = item?.year ? item.year : new Date().getFullYear()
        const month = item.label.substring(0, 2)
        const day = item.label.substring(3, 5)
        // console.log(year, month, day)

        setSelectDate(new Date(year, month - 1, day))

        getDayWeight()

        refRBSheetWeight.current.open()
    }

    //lineDataMaxValue 최대 몸무게 10자리 반올림 + 20
    const lineDataMaxValue = useMemo(() => Math.ceil(Math.max(...lineData.map(v => v.value)) / 10) * 10 + 20, [lineData])


    //몸무게 저장
    const handleSave = async () => {
        if(!weightRegex.test(weight)){
            Alert.alert('올바른 형식인지 확인하세요')
            return;
        }

        const date = new Date(selectDate)
        date.setDate(date.getDate() + 1)

        const dateString = date.toISOString().substring(0, 19)

        const weightInfo = {
            userCode: userInfo.userCode,
            userWeight: weight,
            timestamp: dateString
        }

        try {
            await saveWeight(weightInfo)

            const userData = await getInfo({ userCode: userInfo.userCode })
            setUserState({ ...userData, userCode: userInfo.userCode, weight: userData.weight })

            Alert.alert('몸무게가 저장되었습니다.')
            handleRangeWeight()
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

        const date = new Date(selectDate)
        date.setDate(date.getDate() + 1)

        const dateString = date.toISOString().substring(0, 19)

        const weightInfo = {
            userCode: userInfo.userCode,
            timestamp: dateString
        }

        try {
            await deleteWeight(weightInfo)

            const userData = await getInfo({ userCode: userInfo.userCode })
            setUserState({ ...userData, userCode: userInfo.userCode, weight: userData.weight })

            Alert.alert('몸무게가 삭제되었습니다.')
            handleRangeWeight()
            refRBSheetWeight.current.close()
        } catch (e) {
            console.error(e)
        }

    }

    //특정날 몸무게 조회
    const getDayWeight = async () => {
        const date = new Date(selectDate)
        date.setDate(date.getDate() + 1)

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
        setPeriod(filterPeriod)
        setModal(!modal)

        refRBSheetFilter.current.close()
    }

    //기간 몸무게 조회
    const handleRangeWeight = async () => {
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
            const [i, ...weightList] = getStructedRangeWeight(rawWeightList)
            const [index, ...predictWeightList] = getStructedPredictWeight(rawWeightList)
            console.log('handleRangeWeight weightList', weightList)

            setPredictStartIndex(index)
            setPredictEndIndex(i)

            setLineData([...weightList])
            setPredictLine([...predictWeightList])
        } catch (e) {
            console.error(e)
        }
    }

    const handlePeriod = per => {
        setFilterPeriod(per)

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
                <Text style={styles.text}>{period}</Text>
                <FontAwesome name="sliders" onPress={() => refRBSheetFilter.current.open()} size={rHeight(23)} color={colors.borderGrey} />
            </View>


            <View style={styles.chartView}>
                {isLoaded &&
                    <LineChart
                        data2={predictLine}
                        data={lineData}
                        endIndex={predictEndIndex}
                        startIndex2={predictStartIndex + 1}
                        color1={colors.primary}
                        color2="orange"
                        onPress={item => handlePressChart(item)}
                        height={rHeight(310)}
                        dataPointsHeight={10}
                        dataPointsWidth={10}
                        dataPointsColor1={colors.linePoint}
                        dataPointsColor2="red"
                        textFontSize={rFont(12)}
                        adjustToWidth={lineData.length > 6 ? false : true}
                        scrollToEnd
                        hideYAxisText
                        xAxisType="dashed"
                        xAxisColor={colors.textGrey}
                        dashGap={rWidth(15)}
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

            <View style={styles.labelView}>
                <View style={[styles.label, { backgroundColor: colors.primary }]} />
                <Text style={styles.labelText}>몸무게</Text>
                <View style={[styles.label, { backgroundColor: "orange" }]} />
                <Text style={styles.labelText}>예상 몸무게</Text>
            </View>

            <View style={styles.textView}>
                <Text style={styles.greyText}>* 몸무게 점을 클릭하면 몸무게를 수정할 수 있습니다 </Text>
            </View>


            {/* 상단 필터 - 기간설정 */}
            <RBSheet
                ref={refRBSheetFilter}
                height={rHeight(320)}
                closeOnDragDown={true}
                customStyles={{
                    container: {
                        borderRadius: rHeight(10),
                        paddingHorizontal: rWidth(20),
                        paddingBottom: rHeight(30),
                    },
                    draggableIcon: {
                        backgroundColor: colors.textGrey
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={styles.text}>기간설정</Text>
                    <View style={[styles.rangeView, { marginTop: rHeight(20) }]}>
                        {FILTERPERIOD.map((per, idx) => (
                            <BasicChip
                                id={per + idx}
                                onPress={() => handlePeriod(per)}
                                chipStyle={{ backgroundColor: per == filterPeriod ? colors.btnBackground : colors.white, borderColor: per == filterPeriod ? colors.white : colors.btnBackground }}
                                text={per}
                           />
                        ))
                        }
                    </View>
                    <View style={styles.rangeView}>
                        <DateTimePickerSelect mode="date" value={startDate} onChange={(event, selectedDate) => setStartDate(selectedDate)} />
                        <Text style={styles.text}>-</Text>
                        <DateTimePickerSelect mode="date" value={endDate} onChange={(event, selectedDate) => setEndDate(selectedDate)} />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <MoveButton text="조회" onPress={handleRange} />
                </View>
            </RBSheet>

            {/* 몸무게 추가 bottomSheet */}
            <RBSheet
                ref={refRBSheetWeight}
                height={rHeight(450)}
                closeOnDragDown={true}
                customStyles={{
                    container: {
                        borderRadius: rWidth(10),
                        paddingHorizontal: rWidth(20),
                        paddingBottom: rHeight(30)
                    },
                    draggableIcon: {
                        backgroundColor: colors.textGrey
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.box}>
                        <MaterialCommunityIcons name="calendar-blank" size={rHeight(33)} color={colors.black} />
                        <DateTimePickerSelect mode="date" value={selectDate} onChange={(event, selectedDate) => setSelectDate(selectedDate)} />
                    </View>
                    <View style={[styles.box, styles.flexRow]}>
                        <View style={{ justifyContent: 'center', height: rHeight(60) }}>
                            <MaterialCommunityIcons name="scale-bathroom" size={rHeight(33)} color={colors.black} />
                        </View>
                        <BasicTextInput value={weight.toString()} onChangeText={setWeight} unit="kg" width={rWidth(153)} keyboardType="numeric" validType="몸무게" valid={weightRegex.test(weight)} />
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

    rangeView: {
        flexDirection: 'row',
       justifyContent: 'space-evenly',
        marginVertical: rHeight(8),
        //paddingHorizontal: scale(20)
    },

    selectView: {
        paddingHorizontal: rWidth(20),
        alignItems: 'flex-end'
    },

    chartView: {
        marginTop: rHeight(30),
        //paddingHorizontal: scale(20),
        alignItems: 'center'
    },

    textView: {
        marginTop: rHeight(20),
        marginHorizontal: rWidth(15),
        alignItems: 'flex-end'
    },

    greyText: {
        fontFamily: fonts.medium,
        fontSize: rFont(12),
        color: colors.borderGrey,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    box: {
        flexDirection: 'row',
        //alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: rWidth(15),
        paddingVertical: rHeight(20)
    },

    flexRow: {
        flexDirection: 'row'
    },

    btnView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    btnStyle: {
        width: rWidth(170),
        //height: rHeight(50)
    },

    timeView: {
        paddingVertical: rHeight(4),
        paddingHorizontal: rWidth(15),
        backgroundColor: colors.btnBackground,
        borderRadius: 10,
    },

    timeText: {
        fontFamily: fonts.medium,
        fontSize: rFont(16),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    labelView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: rWidth(115),
        marginTop: rHeight(40)
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