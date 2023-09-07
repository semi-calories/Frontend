//
//식사일시 입력하는 화면
//

import React, { useLayoutEffect, useState, useRef, useEffect } from "react";

import { Pressable, FlatList, StyleSheet, Text, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { MoveButton } from "~/components/button";
import { LabelTextInput } from "~/components/textInput";
import { PrimaryButton } from "~/components/button";

import { Nutrition, Nutrition_ko, Satisfaction, Satisfaction_icon, Satisfaction_ko } from "~/constants/food";

import { fonts, colors } from "~/constants/globalStyles";
import { scale, verticalScale } from "~/constants/globalSizes";

import { updateRecord } from "~/apis/api/diet";

const MealtimeScreen = ({ navigation, route }) => {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    console.log('date time', date, time)

    const [selectFood, setSelectFood] = useState();
    console.log('MealtimeScreen selectFood', selectFood)
    const [foodDetail, setFoodDetail] = useState()
    console.log('MealtimeScreen foodDetail', foodDetail)

    const [serving, setServing] = useState();
    const [editing, setEditing] = useState(false);

    const refRBSheet = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    useEffect(() => {
        setSelectFood([...route.params?.foodParam])
    }, [route.params?.foodParam])

    useEffect(() => {
        if (foodDetail) {
            const ratio = serving / foodDetail?.foodWeight

            setFoodDetail(prev => {return {
                ...prev,
                [Nutrition.foodWeight]: serving,
                [Nutrition.foodKcal]: Math.round(prev.foodKcal * ratio * 10) / 10,
                [Nutrition.foodCarbo]: Math.round(prev.foodCarbo * ratio * 10) / 10,
                [Nutrition.foodProtein]: Math.round(prev.foodProtein * ratio * 10) / 10,
                [Nutrition.foodFat]: Math.round(prev.foodFat * ratio * 10) / 10,
            }})
        }
    }, [editing])

    const renderItem = ({ item }) => {
        return (
            <Pressable style={[styles.box, styles.border]} onPress={() => handlePressDetail(item)}>
                <View>
                    <Text style={[styles.boldText, { fontSize: scale(20) }]}>{item.foodName}</Text>
                    <View style={styles.foodView}>
                        <Text style={styles.greyText}>{item.foodKcal}kcal</Text>
                        <Text style={styles.greyText}>  ㅣ  </Text>
                        <Text style={styles.greyText}>{item.foodWeight}g</Text>
                    </View>
                </View>
                <MaterialIcons name="chevron-right" size={35} color={colors.borderGrey} />
            </Pressable>
        );
    };

    const handlePressDetail = food => {
        setFoodDetail(food);

        refRBSheet.current.open()
    }

    const handleSatisfaction = satisfaction => {

        setFoodDetail(prev => ({
            ...prev,
            satisfaction: satisfaction,
        }))
    }

    const SatisfactionFunc = ({ label, onPress, satisfaction }) => {
        return (
            <Pressable onPress={onPress} style={{ alignItems: 'center' }}>
                <MaterialCommunityIcons name={Satisfaction_icon[label]} size={scale(50)} color={label == satisfaction ? colors.primary : colors.textGrey} />
                <Text style={[styles.smallLabelText, { color: label == satisfaction ? colors.primary : colors.textGrey }]}>{Satisfaction_ko[label]}</Text>
            </Pressable>
        )
    }

    const handleDelete = () => {
        setSelectFood([...selectFood.filter(food => food.foodCode !== foodDetail.foodCode)]);
        refRBSheet.current.close()
    }

    const handleSave = () => {
        const result = selectFood.map(food => food.foodCode == foodDetail.foodCode ? foodDetail : food)
        console.log('handleSave', result)

        setSelectFood([...selectFood.map(food => food.foodCode == foodDetail.foodCode ? foodDetail : food)]);
        refRBSheet.current.close()
    }

    const handleComplete = () => {
        //서버에 저장
        navigation.pop(2);
    }


    return (
        <RootView>
            <View style={[styles.container, styles.borderThick]}>
                <Text style={styles.boldText}>식사일시</Text>
                <View style={{ marginTop: verticalScale(30) }}>
                    <View style={[styles.box, styles.border]}>
                        <MaterialCommunityIcons name="calendar-blank" size={33} color={colors.black} />
                        <DateTimePicker mode="date" value={date} onChange={(event, selectedDate) => setDate(selectedDate)} />
                    </View>
                    <View style={styles.box}>
                        <MaterialCommunityIcons name="clock-outline" size={33} color={colors.black} />
                        <DateTimePicker mode="time" value={time} onChange={(event, selectedDate) => setTime(selectedDate)} />
                    </View>
                </View>
            </View>
            <View style={[styles.container, { flex: 1 }]}>
                <Text style={styles.boldText}>음식</Text>
                <FlatList
                    data={selectFood}
                    renderItem={renderItem}
                    keyExtractor={(item, idx) => item + idx}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={{ paddingHorizontal: scale(30) }}>
                <MoveButton text="완료" onPress={handleComplete} />
            </View>


            {/* 음식상세 */}
            <RBSheet
                ref={refRBSheet}
                height={verticalScale(630)}
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
                <View style={[styles.container, styles.borderThick]}>
                    <View style={[styles.border, { alignItems: 'center', paddingBottom: verticalScale(15) }]}>
                        <Text style={styles.boldText}>{foodDetail?.foodName}</Text>
                    </View>
                    <View style={styles.detailNutriView}>
                        <LabelTextInput type="light" text={serving} unit="g" onChangeText={setServing} width={scale(250)} defaultValue={foodDetail?.foodWeight?.toString()} inputStyle={styles.inputStyle} onEndEditing={() => setEditing(!editing)} />
                        <View style={[styles.flexRow, { marginVertical: verticalScale(10) }]}>
                            <Text style={styles.mtext}>{Nutrition_ko[Nutrition.foodKcal]}</Text>
                            <Text style={styles.mtext}>{foodDetail?.foodKcal} kcal</Text>
                        </View>
                        <View style={styles.flexRow}>
                            <View style={styles.nutri}>
                                <Text style={styles.mtext}>{Nutrition_ko[Nutrition.foodCarbo]}</Text>
                                <Text style={styles.mtext}>{foodDetail?.foodCarbo} g</Text>
                            </View>
                            <View style={styles.verticalBorder} />
                            <View style={styles.nutri}>
                                <Text style={styles.mtext}>{Nutrition_ko[Nutrition.foodProtein]}</Text>
                                <Text style={styles.mtext}>{foodDetail?.foodProtein} g</Text>
                            </View>
                            <View style={styles.verticalBorder} />
                            <View style={styles.nutri}>
                                <Text style={styles.mtext}>{Nutrition_ko[Nutrition.foodFat]}</Text>
                                <Text style={styles.mtext}>{foodDetail?.foodFat} g</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={[styles.boldText, { fontSize: scale(20) }]}>만족도</Text>
                    <View style={styles.satisView}>
                        <SatisfactionFunc label={Satisfaction.dislike} onPress={() => handleSatisfaction(Satisfaction.dislike)} satisfaction={foodDetail?.satisfaction} />
                        <SatisfactionFunc label={Satisfaction.normal} onPress={() => handleSatisfaction(Satisfaction.normal)} satisfaction={foodDetail?.satisfaction} />
                        <SatisfactionFunc label={Satisfaction.like} onPress={() => handleSatisfaction(Satisfaction.like)} satisfaction={foodDetail?.satisfaction} />
                    </View>
                </View>
                <View style={styles.btnView}>
                    <PrimaryButton text="삭제" btnStyle={[styles.btnStyle, { backgroundColor: colors.pink }]} onPress={handleDelete} />
                    <PrimaryButton text="저장" btnStyle={[styles.btnStyle, { backgroundColor: colors.primary }]} onPress={handleSave} />
                </View>
            </RBSheet>
        </RootView>
    );
}

export default MealtimeScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(35),
        paddingVertical: verticalScale(10),
    },

    borderThick: {
        borderBottomWidth: scale(5),
        borderColor: colors.fat,
    },

    border: {
        borderBottomWidth: scale(1),
        borderColor: colors.textGrey,
    },

    boldText: {
        fontFamily: fonts.bold,
        fontSize: scale(25),
        color: colors.black,
    },

    mtext: {
        fontFamily: fonts.medium,
        fontSize: scale(18),
        color: colors.black,
        marginVertical: verticalScale(10)
    },

    text: {
        fontFamily: fonts.regular,
        fontSize: scale(20),
        color: colors.black,
    },

    smallLabelText: {
        fontFamily: fonts.medium,
        fontSize: scale(15),

        marginVertical: verticalScale(5),
    },

    greyText: {
        fontFamily: fonts.regular,
        fontSize: scale(15),
        color: colors.borderGrey,
    },

    box: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(13)
    },

    foodView: {
        flexDirection: 'row',
        paddingHorizontal: scale(10),
        marginVertical: verticalScale(7)
    },

    detailNutriView: {
        paddingHorizontal: scale(35),
        marginVertical: verticalScale(20)
    },

    inputStyle: {
        fontFamily: fonts.regular,
        fontSize: scale(20),
        color: colors.black
    },

    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    nutri: {
        width: scale(70),
        alignItems: 'center',
    },

    verticalBorder: {
        width: scale(1),
        height: verticalScale(55),
        backgroundColor: colors.textGrey
    },

    satisView: {
        flexDirection: 'row',
        paddingHorizontal: scale(20),
        justifyContent: 'space-evenly',
        marginVertical: verticalScale(15),
    },

    btnView: {
        flexDirection: 'row',
        paddingHorizontal: scale(19),
        justifyContent: 'space-between'
    },

    btnStyle: {
        width: scale(170),
        height: verticalScale(50)
    }
})