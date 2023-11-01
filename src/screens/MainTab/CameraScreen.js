//
// 카메라 스크린 나타나는 화면
//
import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

import { StyleSheet, TouchableOpacity, View, Image, Text, Alert } from "react-native";
import { Camera, CameraType, AutoFocus } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";

import { UserInfoType, RecordType } from "~/constants/type";

import { dWidth, rFont, rHeight, rWidth } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { recognizeUpload } from "~/apis/api/diet";

const CameraScreen = ({ navigation, route }) => {
    const { nextScreen, userInfo } = route.params

    const [user, setUser] = useState({})
    console.log('CameraScreen user', user)

    const cameraRef = useRef(null);
    const [type, setType] = useState(CameraType.back);

    const [capturedImage, setCapturedImage] = useState(null)
    console.log('capturedImage', capturedImage)
    const [previewVisible, setPreviewVisible] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="사진 찍기" backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    useEffect(() => {
        if (capturedImage) {
            setUser({ ...userInfo, image: capturedImage.uri })
        }
    }, [capturedImage])

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

    const uploadPictureHandler = async() => {
        if (nextScreen == 'MealtimeScreen') {
            const dietLists = await recognizeUploadDiet()

            if(dietLists.length){
                params = { foodParam: dietLists, userInfo, type: RecordType.init }

                navigation.navigate(nextScreen, params)
            }else{
                Alert.alert('사진 인식이 되지 않습니다. 다시 촬영해주세요.')
            }

        } else {
            const params = { 
                userInfo: user,
                infoType: UserInfoType.edit
            }

            navigation.navigate(nextScreen, params)
        }
    }

    const recognizeUploadDiet = async () => {
        const uploadInfo = {
            userCode: userInfo.userCode,
            file:capturedImage.base64,
        }

        try{
            const { dietLists } = await recognizeUpload(uploadInfo)
            console.log('recognizeUploadDiet dietLists', dietLists)

            return dietLists;
        }catch(e){
            console.error()
        }

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
                <View style={{ width: rWidth(35) }} />
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
        height: rHeight(550)
    },

    touchView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: rWidth(30)
    },

    btnView: {
        width: rWidth(80),
        height: rHeight(80),
        backgroundColor: colors.white,
        borderRadius: 40,
        borderWidth: rWidth(4),
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
        fontSize: rFont(20),

        includeFontPadding: false,
        textAlignVertical: 'center'
    }
})