//
// 버튼 컴포넌트 모아놓은 파일
//

import React, { useRef, useEffect } from "react";

import { TouchableOpacity, Text, StyleSheet, View, TouchableWithoutFeedback, Animated, Alert } from "react-native";
import ActionSheet from 'react-native-actionsheet'
import { Camera } from 'expo-camera';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { useRecoilValue } from "recoil";

import { UserState } from "~/atoms/UserAtom";

import { colors, fonts } from "~/constants/globalStyles"
import { rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { SearchFoodType } from "~/constants/type";


export function PrimaryButton({ text, onPress, btnStyle, textStyle }) {
    return (
        <TouchableOpacity style={[styles.primaryBtn, btnStyle]} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
}

export function MoveButton({ text, onPress, btnStyle, inActive, textStyle }) {
    return (
        <TouchableOpacity style={[inActive ? styles.moveBtnInactive : styles.moveBtn, btnStyle]} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
}

export function TabBarButton({ opened, toggleOpened, navigation }) {
    const animation = useRef(new Animated.Value(0)).current

    const user = useRecoilValue(UserState)
    //console.log('TabBarButton user', user)

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);


    const opacity = {
        opacity: animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1]

        })
    }

    useEffect(() => {
        Animated.timing(animation, {
            toValue: opened ? 1 : 0,
            duration: 300,
            friction: 2,
            useNativeDriver: false,
        }).start()
    }, [opened, animation])

    const onPressRecord = () => {
        navigation.navigate('SearchFoodScreen', { type: SearchFoodType.add, userInfo: user });
        toggleOpened()
    }

    const onPressCameraIcon = () => {
        this.ActionSheet.show()
        toggleOpened()
    }

    const onPressCameraMenu = async (index) => {
        switch (index) {
            case 0:  //사진선택
                const { status: cameraStatus } = await Camera.getCameraPermissionsAsync();
                // 권한을 획득하면 status가 granted 상태
                if (cameraStatus === 'granted') {
                    navigation.navigate('CameraScreen', {
                        nextScreen: 'MealtimeScreen',
                        userInfo: user,
                    });
                } else {
                    //await Camera.requestCameraPermissionsAsync();
                    Alert.alert('카메라 권한', '사진으로 식사 기록하는 것은\n카메라 권한이 필요합니다.', [
                        { text: '취소', onPress: () => { } },
                        { text: '확인', onPress: () => Linking.openSettings() },
                    ]);
                }
                return;

            case 1:  //앨범에서 선택
                const { status: albumStatus } = await ImagePicker.getMediaLibraryPermissionsAsync()
                console.log('adad', albumStatus)
                if (albumStatus === 'granted') {
                    navigation.navigate('AlbumScreen_new', {
                        nextScreen: 'MealtimeScreen',
                        userInfo: user,
                    });
                } else {
                    //await ImagePicker.requestMediaLibraryPermissionsAsync()
                    Alert.alert('앨범 권한', '사진으로 식사 기록하는 것은\n앨범 권한이 필요합니다.', [
                        { text: '취소', onPress: () => { } },
                        { text: '확인', onPress: () => Linking.openSettings() },
                    ]);
                }
                return;

            default:
                return;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <TouchableWithoutFeedback>
                    <AnimatedTouchable
                        activeOpacity={0.8}
                        onPress={onPressRecord}
                        style={[styles.item, opacity, {
                            transform: [
                                {
                                    translateX: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, rHeight(-60)]
                                    })
                                },
                                {
                                    translateY: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, rHeight(-70)]
                                    })
                                },
                            ]
                        }]}>
                        <MaterialCommunityIcons name="pencil" size={rHeight(40)} color={colors.white} />
                    </AnimatedTouchable>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <AnimatedTouchable
                        activeOpacity={0.8}
                        onPress={onPressCameraIcon}
                        style={[styles.item, opacity, {
                            transform: [
                                {
                                    translateX: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, rHeight(60)]
                                    })
                                },
                                {
                                    translateY: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, rHeight(-70)]
                                    })
                                },
                            ]
                        }]}>
                        <MaterialIcons name="photo-camera" size={rHeight(40)} color={colors.white} />
                    </AnimatedTouchable>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={toggleOpened} style={styles.shadow}>
                    <Animated.View style={[styles.addBtn, {
                        transform: [{
                            rotate: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "45deg"]
                            })
                        }]
                    }]}>
                        <FontAwesome5 name="plus" size={rHeight(38)} color={colors.white} />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
            <ActionSheet
                ref={o => this.ActionSheet = o}
                options={['사진찍기', '앨범에서 선택', '취소']}
                cancelButtonIndex={2}
                //destructiveButtonIndex={1}
                onPress={(index) => onPressCameraMenu(index)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    primaryBtn: {
        width: rWidth(298),
        //height: rHeight(67),
        borderRadius: rWidth(15),
        backgroundColor: colors.primary,
        paddingVertical: rHeight(10),

        alignItems: "center",
        justifyContent: 'center',
    },

    moveBtn: {
        width: rWidth(320),
        //height: rHeight(50),
        borderRadius: rWidth(20),
        backgroundColor: colors.black,
        paddingVertical: rHeight(10),

        alignItems: "center",
        justifyContent: 'center',
    },

    moveBtnInactive: {
        width: rWidth(320),
        //height: rHeight(50),
        borderRadius: rWidth(20),
        backgroundColor: colors.textGrey,
        paddingVertical: rHeight(10),

        alignItems: "center",
        justifyContent: 'center',
    },

    text: {
        color: colors.white,
        fontSize: rFont(20),
        fontFamily: fonts.bold,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    container: {
        alignItems: 'center',
        flex: 1,
        height: 0,
    },

    box: {
        position: 'relative',
        width: rHeight(80),
        height: rHeight(80),
        marginTop: rHeight(-20)
    },

    shadow: {
        shadowColor: colors.textGrey,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },

    addBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        width: rHeight(80),
        height: rHeight(80),
        borderRadius: rHeight(50)
    },

    item: {
        position: 'absolute',
        top: rHeight(5),
        left: rWidth(5),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.btnBackground,
        width: rHeight(65),
        height: rHeight(65),
        borderRadius: 50,
    },

    itemIcon: {
        width: rHeight(40),
        height: rHeight(40),
        tintColor: colors.white,
    }
});