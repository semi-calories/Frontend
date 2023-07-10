import React, { useLayoutEffect, useState } from "react";

import { Text, StyleSheet, ScrollView, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/rootView";
import { MoveButton } from "~/components/button";
import { LabelTextInput } from "~/components/textInput";

import { HeaderType } from "~/constants/type";
import { Gender,Gender_ko, UserInfo, UserInfo_ko, Activity, Activity_ko } from "~/constants/UserInfo";

import { fonts, colors } from "~/constants/globalStyles";
import { scale, verticalScale } from "~/constants/globalSizes";

const GenderFunc = ({ label, onPress, gender }) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Pressable style={styles.genderIconView} onPress={onPress}>
                <MaterialCommunityIcons name={label == Gender.female ? 'gender-female' : 'gender-male'} size={60} color={gender == label ? gender == Gender.female ? colors.pink : colors.blue : colors.textGrey} />
            </Pressable>
            <Text style={[styles.smallLabelText, {color: colors.borderGrey}]}>{Gender_ko[label]}</Text>
        </View>
    );
}

const ActivityFunc = ({ label, onPress, activity }) => {
    return (
        <Pressable onPress={onPress} style={{alignItems:'center'}}>
            <MaterialCommunityIcons name={label==Activity.less ? "emoticon-neutral-outline" : label == Activity.normal ? "emoticon-happy-outline" : "emoticon-excited-outline"} size={scale(50)} color={label == activity ? colors.primary : colors.textGrey} />
            <Text style={[styles.smallLabelText,{color: label == activity ? colors.primary : colors.textGrey }]}>{Activity_ko[label]}</Text>
        </Pressable>
    )
}

const UserInfoEditScreen = ({ navigation, route }) => {
    const { nickname } = route.params;

    const [gender, setGender] = useState();
    const [age, setAge] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [targetWeight, setTargetWeight] = useState();
    const [activity, setActivity] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader rightType={HeaderType.skip} rightPress={() => navigation.navigate('MainTab')} />
        });
    }, [navigation]);

    const handleMove = () => {
        const userInfoInputs = { gender, age, height, weight, targetWeight, activity };
        // params로 넘겨주기, 혹은 서버에 저장
        navigation.navigate('SetGoalScreen');
    }

    return (
        <RootView viewStyle={styles.container}>
            <Text style={styles.nickname}>{nickname}님</Text>
            <Text style={styles.text}>나만의 식단 관리 설정</Text>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.labelText}>{UserInfo_ko[UserInfo.gender]}</Text>
                <View style={styles.contentView}>
                    <GenderFunc label={Gender.female} onPress={() => setGender(Gender.female)} gender={gender} />
                    <GenderFunc label={Gender.male} onPress={() => setGender(Gender.male)} gender={gender} />
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.age]} text={age} onChangeText={setAge} unit="세" width={scale(153)} keyboardType="numeric" inputStyle={styles.inputStyle} />
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.height]} text={height} onChangeText={setHeight} unit="cm" width={scale(153)} keyboardType="numeric" />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.weight]} text={weight} onChangeText={setWeight} unit="kg" width={scale(153)} keyboardType="numeric" inputStyle={styles.inputStyle} />
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.targetWeight]} text={targetWeight} onChangeText={setTargetWeight} unit="kg" width={scale(153)} keyboardType="numeric" />
                </View>

                <Text style={styles.labelText}>{UserInfo_ko[UserInfo.activity]}</Text>
                <View style={styles.contentView}>
                    <ActivityFunc label={Activity.less} onPress={()=> setActivity(Activity.less)} activity={activity}/>
                    <ActivityFunc label={Activity.normal} onPress={()=> setActivity(Activity.normal)} activity={activity}/>
                    <ActivityFunc label={Activity.much} onPress={()=> setActivity(Activity.much)} activity={activity}/>
                </View>
            </ScrollView>
            <MoveButton text="다음" onPress={handleMove} />
        </RootView>
    );
}

export default UserInfoEditScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(30),
    },

    nickname: {
        fontFamily: fonts.bold,
        fontSize: scale(30),
        color: colors.black,
    },

    text: {
        fontFamily: fonts.medium,
        fontSize: scale(25),
        color: colors.black,
    },

    scrollView: {
        paddingVertical: verticalScale(20),
    },

    labelText: {
        fontFamily: fonts.bold,
        fontSize: scale(20),
        color: colors.borderGrey,

        marginVertical: verticalScale(15),
    },

    contentView: {
        flexDirection: 'row',
        paddingHorizontal: scale(20),
        justifyContent: 'space-evenly',
        marginBottom: verticalScale(25),
    },

    genderIconView: {
        width: scale(109),
        height: verticalScale(99),
        backgroundColor: colors.white,

        borderWidth: 2,
        borderColor: colors.textGrey,
        borderRadius: 10,

        alignItems: 'center',
        justifyContent: 'center',
    },

    smallLabelText: {
        fontFamily: fonts.medium,
        fontSize: scale(15),

        marginVertical: verticalScale(5),
    },

    inputStyle: {
        marginRight: scale(15),
    },
});