//
//유저 성별, 나이, 키, 몸무게 등 설정할 수 있는 화면
//

import React, { useLayoutEffect, useState, useEffect } from "react";

import { Text, StyleSheet, ScrollView, View, Pressable, ImageBackground, Image, Alert } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";
import { MoveButton } from "~/components/button";
import { LabelTextInput } from "~/components/textInput";
import { StoreUserData, GetUserData } from "~/components/asyncStorageData";

import { HeaderType, UserInfoType } from "~/constants/type";
import { Gender, Gender_ko, Gender_icon, UserInfo, UserInfo_ko, Activity, Activity_ko, Activity_icon } from "~/constants/userInfo";
import { Null_img } from "~/constants/test";

import { fonts, colors } from "~/constants/globalStyles";
import { scale, verticalScale } from "~/constants/globalSizes";

import { updateInfo } from "~/apis/api/user";

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
    const { userInfo, infoType } = route.params;
    console.log('UserInfoEditScreen user', userInfo)

    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [gender, setGender] = useState();
    const [age, setAge] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [goalWeight, setGoalWeight] = useState();
    const [activity, setActivity] = useState();

    useLayoutEffect(() => {
        if (infoType == UserInfoType.init) {
            navigation.setOptions({
                header: () => <BackHeader />
            });
        } else if (infoType == UserInfoType.edit) {
            navigation.setOptions({
                header: () => <BackHeader back title="사용자 정보" backPress={() => navigation.goBack()} />
            });
        }
    }, [navigation, infoType]);

    useEffect(() => {
        setImage(userInfo.image ? userInfo.image : '')
        setName(userInfo.name ? userInfo.name : '')
        setGender(userInfo.gender ? userInfo.gender : '')
        setAge(userInfo.age ? userInfo.age.toString() : '')
        setHeight(userInfo.height ? userInfo.height.toString() : '')
        setWeight(userInfo.weight ? userInfo.weight.toString() : '')
        setGoalWeight(userInfo.goalWeight ? userInfo.goalWeight.toString() : '')
        setActivity(userInfo.activity ? userInfo.activity : '')
    }, [route.params?.userInfo])

    const getPhotos = async () => {
        const { assets } = await MediaLibrary.getAssetsAsync();

        navigation.navigate('AlbumScreen', {
            nextScreen: 'UserInfoEditScreen',
            photosParam: assets,
            firstPhotoId: assets[0].id
        });
    };

    const onPressCameraMenu = async (index) => {
        switch (index) {
            case 0:  //사진선택
                const { status } = await Camera.requestCameraPermissionsAsync();
                // 권한을 획득하면 status가 granted 상태
                if (status === 'granted') {
                    navigation.navigate('CameraScreen', {
                        nextScreen: 'UserInfoEditScreen'
                    });
                } else {
                    Alert.alert('카메라 접근 허용은 필수입니다.');
                }
                return;

            case 1:  //앨범에서 선택
                const { status: albumStatus } = await MediaLibrary.requestPermissionsAsync()
                if (albumStatus === 'granted') {
                    getPhotos()
                } else {
                    Alert.alert('앨범 접근 허용은 필수입니다.');
                }
                return;

            default:
        }
    }

    const handleComplete = () => {
        const user = {
            userCode: userInfo.userCode,
            email: userInfo.email,
            name,
            image,
            gender,
            age,
            height,
            weight,
            goalWeight,
            userActivity: activity,
        };

        if (name && gender && age && height && weight && goalWeight && activity) {
            handleNext(user)
        } else {
            Alert.alert('항목을 모두 입력해주세요.')
        }

    }

    const handleNext = async (user) => {
        if (infoType == UserInfoType.init) {
            navigation.navigate('SetGoalScreen', { userInfo: user, infoType: UserInfoType.init });

        } else if (infoType == UserInfoType.edit) {
            try {
                const response = await updateInfo(user)
                StoreUserData(user)

                Alert.alert('사용자 정보 수정 완료!')
            } catch (err) {
                console.log(err)
            }
        }
    }


    return (
        <RootView viewStyle={styles.container}>
            {infoType == UserInfoType.init &&
                <>
                    <Text style={styles.boldText}>{userInfo.name}님</Text>
                    <Text style={styles.text}>나만의 식단 관리 설정</Text>
                </>
            }
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {infoType == UserInfoType.edit &&
                    <View>
                        <ImageBackground source={image ? { uri: image } : Null_img} style={styles.imgBackground} imageStyle={{ borderRadius: 100 }} resizeMode="cover">
                            <Pressable onPress={() => this.ActionSheet.show()} style={styles.imgView} >
                                <Image source={EditIcon} style={styles.img} />
                            </Pressable>
                        </ImageBackground>
                        <LabelTextInput type="light" label={UserInfo_ko[UserInfo.name]} text={name} onChangeText={setName} width={scale(320)} defaultValue={name} />
                    </View>
                }
                <View style={styles.flexRow}>
                    <Text style={styles.labelText}>{UserInfo_ko[UserInfo.gender]}</Text>
                </View>
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
                    <LabelTextInput type="light" label={UserInfo_ko[UserInfo.goalWeight]} text={goalWeight} onChangeText={setGoalWeight} unit="kg" width={scale(153)} keyboardType="numeric" />
                </View>

                <Text style={styles.labelText}>{UserInfo_ko[UserInfo.activity]}</Text>
                <View style={styles.contentView}>
                    <ActivityFunc label={Activity.less} onPress={() => setActivity(Activity.less)} activity={activity} />
                    <ActivityFunc label={Activity.normal} onPress={() => setActivity(Activity.normal)} activity={activity} />
                    <ActivityFunc label={Activity.more} onPress={() => setActivity(Activity.more)} activity={activity} />
                </View>
            </ScrollView>
            <MoveButton text={infoType == UserInfoType.init ? '다음' : '완료'} onPress={handleComplete} inActive={!(name && gender && age && height && weight && goalWeight && activity)} />

            <ActionSheet
                ref={o => this.ActionSheet = o}
                options={['사진찍기', '앨범에서 선택', '취소']}
                cancelButtonIndex={2}
                //destructiveButtonIndex={1}
                onPress={(index) => onPressCameraMenu(index)}
            />
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
        marginBottom: verticalScale(25),
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
    },

    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    required: {
        color: 'red',
        fontFamily: fonts.medium,
        fontSize: scale(23),
    }
});