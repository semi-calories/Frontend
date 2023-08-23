//
// 버튼 컴포넌트 모아놓은 파일
//

import React, { useRef, useEffect } from "react";

import { TouchableOpacity, Text, StyleSheet, View, TouchableWithoutFeedback, Image, Animated, Alert } from "react-native";
import ActionSheet from 'react-native-actionsheet'
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

import { colors, fonts } from "~/constants/globalStyles"
import { scale, verticalScale } from "~/constants/globalSizes";
import { SearchFoodType } from "~/constants/type";

const addIcon = require("@assets/Add.png");
const pencilIcon = require('@assets/Pencil.png');
const cameraIcon = require('@assets/Camera.png')

export function PrimaryButton({ text, onPress, btnStyle }) {
    return (
        <TouchableOpacity style={[styles.primaryBtn, btnStyle]} onPress={onPress}>
            <Text style={styles.whiteText}>{text}</Text>
        </TouchableOpacity>
    );
}

export function MoveButton({ text, onPress, btnStyle, inActive }) {
    return (
        <TouchableOpacity style={[inActive ? styles.moveBtnInactive :styles.moveBtn , btnStyle]} onPress={onPress}>
            <Text style={styles.whiteText}>{text}</Text>
        </TouchableOpacity>
    );
}

export function TabBarButton({ opened, toggleOpened, navigation }) {
    const animation = useRef(new Animated.Value(0)).current

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
        navigation.navigate('SearchFoodScreen', { type: SearchFoodType.add });
        toggleOpened()
    }

    const onPressCameraIcon = () => {
        this.ActionSheet.show()
        toggleOpened()
    }

    const onPressCameraMenu = async (index) => {
        switch (index) {
            case 0:  //사진선택
                const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
                // 권한을 획득하면 status가 granted 상태
                if (cameraStatus === 'granted') {
                    navigation.navigate('CameraScreen', {
                        nextScreen: 'MealtimeScreen'
                    });
                } else {
                    Alert.alert('카메라 접근 허용은 필수입니다.');
                }
                return;

            case 1:  //앨범에서 선택
                const { status: albumStatus } = await MediaLibrary.requestPermissionsAsync()
                if (albumStatus === 'granted') {
                    navigation.navigate('AlbumScreen', {
                        nextScreen: 'MealtimeScreen',
                    });
                } else {
                    Alert.alert('앨범 접근 허용은 필수입니다.');
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
                                        outputRange: [0, -60]
                                    })
                                },
                                {
                                    translateY: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -70]
                                    })
                                },
                            ]
                        }]}>
                        <Image source={pencilIcon} resizeMode="contain" style={styles.itemIcon} />
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
                                        outputRange: [0, 60]
                                    })
                                },
                                {
                                    translateY: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -70]
                                    })
                                },
                            ]
                        }]}>
                        <Image source={cameraIcon} resizeMode="contain" style={styles.itemIcon} />
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
                        <Image source={addIcon} resizeMode='contain' style={styles.addIcon} />
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
        width: scale(298),
        height: verticalScale(67),
        borderRadius: 15,
        backgroundColor: colors.primary,

        alignItems: "center",
        justifyContent: 'center',
    },

    moveBtn: {
        width: scale(320),
        height: verticalScale(50),
        borderRadius: 20,
        backgroundColor: colors.black,

        alignItems: "center",
        justifyContent: 'center',
    },
    
    moveBtnInactive:{
        width: scale(320),
        height: verticalScale(50),
        borderRadius: 20,
        backgroundColor: colors.textGrey,

        alignItems: "center",
        justifyContent: 'center',
    },

    whiteText: {
        color: colors.white,
        fontSize: scale(20),
        fontFamily: fonts.bold,
    },

    container: {
        alignItems: 'center',
        flex: 1,
        height: 0,
    },

    box: {
        position: 'relative',
        width: scale(80),
        height: verticalScale(80),
        marginTop: verticalScale(-20)
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
        width: scale(80),
        height: verticalScale(80),
        borderRadius: 50
    },

    addIcon: {
        width: scale(45),
        height: verticalScale(45),
        tintColor: colors.white,
    },

    item: {
        position: 'absolute',
        top: verticalScale(5),
        left: scale(5),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.btnBackground,
        width: scale(65),
        height: verticalScale(65),
        borderRadius: 50,
    },

    itemIcon: {
        width: scale(40),
        height: verticalScale(40),
        tintColor: colors.white,
    }
});