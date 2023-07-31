//
// 카메라 스크린 나타나는 화면
//
import React, { useRef, useState, useLayoutEffect } from "react";

import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { Camera, CameraType, AutoFocus } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";

import { UserInfoType } from "~/constants/type";

import { dWidth, verticalScale, scale } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

const CameraScreen = ({ navigation, route }) => {
    const { nextScreen } = route.params

    const cameraRef = useRef(null);
    const [type, setType] = useState(CameraType.back);

    const [capturedImage, setCapturedImage] = useState(null)
    const [previewVisible, setPreviewVisible] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="사진 찍기" backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    const takePictureHandler = async () => {
        // cameraRef가 없으면 해당 함수가 실행되지 않게 가드
        if (!cameraRef.current) return;

        // takePictureAsync를 통해 사진을 찍습니다.
        // 찍은 사진은 base64 형식으로 저장합니다.
        await cameraRef.current
            .takePictureAsync({
                base64: true,
            })
            .then((data) => {
                setPreviewVisible(true);
                setCapturedImage(data);
            });
    };

    const retakePictureHandler = () => {
        setPreviewVisible(false);
        setCapturedImage(null);
    };

    const uploadPictureHandler = () => {
        let params = {}

        if (nextScreen == 'MealtimeScreen') {
            //api호출 후 captureImage 보내고 정보 받아오기
            params = { foodParam: [] }
        } else {
            params = { image: capturedImage.uri, infoType: UserInfoType.edit }
        }

        navigation.navigate(nextScreen, params)
    }


    return previewVisible && capturedImage ? (
        <RootView>
            <Image source={capturedImage} style={styles.camera} />
            <View style={styles.touchView}>
                <TouchableOpacity activeOpacity={0.6} onPress={retakePictureHandler}>
                    <Text style={styles.text}>다시찍기</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={uploadPictureHandler}>
                    <Text style={styles.text}>완료</Text>
                </TouchableOpacity>
            </View>
        </RootView>
    ) : (
        <RootView>
            <Camera
                ref={cameraRef}
                type={type}
                autoFocus={AutoFocus.on}
                style={styles.camera}
            />
            <View style={styles.touchView}>
                <View style={{ width: scale(35) }} />
                <TouchableOpacity style={styles.btnView} activeOpacity={0.8} onPress={takePictureHandler} />
                <TouchableOpacity activeOpacity={0.8} onPress={() => setType(type == CameraType.back ? CameraType.front : CameraType.back)}>
                    <AntDesign name="sync" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </RootView>
    )
}

export default CameraScreen;

const styles = StyleSheet.create({
    camera: {
        width: dWidth,
        height: verticalScale(550)
    },

    touchView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(30)
    },

    btnView: {
        width: scale(80),
        height: verticalScale(80),
        backgroundColor: colors.white,
        borderRadius: 40,
        borderWidth: scale(4),
        borderColor: colors.primary,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        elevation: 2,
    },

    text: {
        fontFamily: fonts.bold,
        fontSize: scale(20),
    }
})