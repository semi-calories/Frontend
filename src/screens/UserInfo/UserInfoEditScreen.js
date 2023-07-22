//
//유저 성별, 나이, 키, 몸무게 등 설정할 수 있는 화면
//

import React, { useLayoutEffect, useState, useEffect } from "react";

import { Text, StyleSheet, ScrollView, View, Pressable, ImageBackground, Image, Alert } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { MoveButton } from "~/components/button";
import { LabelTextInput } from "~/components/textInput";

import { HeaderType, UserInfoType } from "~/constants/type";
import { Gender, Gender_ko, Gender_icon, UserInfo, UserInfo_ko, Activity, Activity_ko, Activity_icon } from "~/constants/userInfo";
import { Null_img } from "~/constants/test";

import { fonts, colors } from "~/constants/globalStyles";
import { scale, verticalScale } from "~/constants/globalSizes";

const EditIcon = require('@assets/EditIcon.png')

const GenderFunc = ({ label, onPress, gender }) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Pressable style={styles.genderIconView} onPress={onPress}>
                <MaterialCommunityIcons name={Gender_icon[label]} size={60} color={gender == label ? gender == Gender.female ? colors.pink : colors.blue : colors.textGrey} />
            </Pressable>
            <Text style={[styles.smallLabelText, { color: colors.borderGrey }]}>{Gender_ko[label]}</Text>
        </View>
    );
}

const ActivityFunc = ({ label, onPress, activity }) => {
    return (
        <Pressable onPress={onPress} style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name={Activity_icon[label]} size={scale(50)} color={label == activity ? colors.primary : colors.textGrey} />
            <Text style={[styles.smallLabelText, { color: label == activity ? colors.primary : colors.textGrey }]}>{Activity_ko[label]}</Text>
        </Pressable>
    )
}

const UserInfoEditScreen = ({ navigation, route }) => {
    const { userName, infoType } = route.params;

    const [name, setName] = useState();
    const [gender, setGender] = useState();
    const [age, setAge] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [targetWeight, setTargetWeight] = useState();
    const [activity, setActivity] = useState();

    useLayoutEffect(() => {
        if (infoType == UserInfoType.init) {
            navigation.setOptions({
                header: () => <BackHeader rightType={HeaderType.skip} rightPress={() => navigation.navigate('MainTab')} />
            });
        } else if (infoType == UserInfoType.edit) {
            navigation.setOptions({
                header: () => <BackHeader back title="사용자 정보" backPress={() => navigation.goBack()} />
            });
        }
    }, [navigation, infoType]);

    useEffect(() => {
        // 서버에서 데이터 get해서 변수들 set해주기
        if (userName) {
            setName(userName)
        }
    }, [route.params])

    const handleMove = () => {
        const userInfoInputs = { name, gender, age, height, weight, targetWeight, activity };
        // 서버에 저장
        navigation.navigate('SetGoalScreen', {infoType: UserInfoType.init});
    }

    const handleComplete = () => {
        const userInfoInputs = { name, gender, age, height, weight, targetWeight, activity };
        // 변경 내용 서버에 저장
        navigation.goBack();
    }

    return (
        <RootView viewStyle={styles.container}>
            {infoType == UserInfoType.init &&
                <>
                    <Text style={styles.boldText}>{userName}님</Text>
                    <Text style={styles.text}>나만의 식단 관리 설정</Text>
                </>
            }
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {infoType == UserInfoType.edit &&
                    <View>
                        <ImageBackground source={Null_img} style={styles.imgBackground}>
                            <Pressable onPress={() => Alert.alert('카메라')} style={styles.imgView} >
                                <Image source={EditIcon} style={styles.img} />
                            </Pressable>
                        </ImageBackground>
                        <LabelTextInput type="light" label={UserInfo_ko[UserInfo.name]} text={name} onChangeText={setName} width={scale(320)} defaultValue={name} />
                    </View>
                }
                <Text style={styles.labelText}>{UserInfo_ko[UserInfo.gender]}</Text>
                <View style={styles.contentView}>
                    <GenderFunc label={Gender.female} onPress={() => setGender(Gender.female)} gender={gender} />
                    <GenderFunc label={Gender.male} onPress={() => setGender(Gender.male)} gender={gender} />
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.age]} text={age} onChangeText={setAge} unit="세" width={scale(153)} keyboardType="numeric" inputViewStyle={styles.inputViewStyle} />
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.height]} text={height} onChangeText={setHeight} unit="cm" width={scale(153)} keyboardType="numeric" />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.weight]} text={weight} onChangeText={setWeight} unit="kg" width={scale(153)} keyboardType="numeric" inputViewStyle={styles.inputViewStyle} />
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.targetWeight]} text={targetWeight} onChangeText={setTargetWeight} unit="kg" width={scale(153)} keyboardType="numeric" />
                </View>

                <Text style={styles.labelText}>{UserInfo_ko[UserInfo.activity]}</Text>
                <View style={styles.contentView}>
                    <ActivityFunc label={Activity.less} onPress={() => setActivity(Activity.less)} activity={activity} />
                    <ActivityFunc label={Activity.normal} onPress={() => setActivity(Activity.normal)} activity={activity} />
                    <ActivityFunc label={Activity.much} onPress={() => setActivity(Activity.much)} activity={activity} />
                </View>
            </ScrollView>
            {infoType == UserInfoType.init
                ? <MoveButton text="다음" onPress={handleMove} />
                : <MoveButton text="완료" onPress={handleComplete} />
            }
        </RootView>
    );
}

export default UserInfoEditScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(30),
    },

    boldText: {
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

    inputViewStyle: {
        marginRight: scale(15),
    },

    imgBackground: {
        width: scale(120),
        height: verticalScale(125),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: verticalScale(25)
    },

    imgView: {
        position: 'absolute',
        bottom: scale(-5),
        right: scale(-5),
    },

    img: {
        width: scale(55),
        height: verticalScale(50),
        resizeMode: 'contain',
    }
});