//
// 앨범 가져오는 스크린 - expo-imagePicker
//
import React, { useState, useEffect, useLayoutEffect } from 'react';

import { Image, View, Platform, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/container";

import { RecordType, UserInfoType } from "~/constants/type";

import { dWidth, rFont, rHeight, rWidth } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { recognizeUpload } from "~/apis/api/diet";


const AlbumScreen_new = ({ navigation, route }) => {
    const { nextScreen, userInfo } = route.params
    console.log('AlbumScreen2 route.params', route.params)

    const [image, setImage] = useState(null);
    //console.log('AlbumScreen2 image', image)
    const [user, setUser] = useState({})
    console.log('AlbumScreen_new user', user)

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="사진 선택" backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    useEffect(() => {
        pickImage()
    }, [])

    useEffect(() => {
        if (image) {
            setUser({ ...userInfo, image })
        }
    }, [image])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
        });
        //console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const uploadPictureHandler = async () => {
        if (nextScreen == 'MealtimeScreen') {
            const dietLists = await recognizeUploadDiet()
            console.log(dietLists)

            if (dietLists.length) {
                params = { foodParam: dietLists, userInfo, type: RecordType.init }

                navigation.navigate(nextScreen, params)
            } else {
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
            file: image.base64,
        }

        try {
            const { dietLists } = await recognizeUpload(uploadInfo)
            //console.log('recognizeUploadDiet dietLists', dietLists)

            return dietLists;
        } catch (e) {
            console.error(e)
        }

    }

    return (
        <RootView>
            {image &&
                <>
                    <Image source={{ uri: image.uri }} style={styles.album} />
                    <View style={styles.touchView}>
                        <TouchableOpacity activeOpacity={0.6} onPress={pickImage}>
                            <Text style={styles.text}>다시선택</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={uploadPictureHandler}>
                            <Text style={styles.text}>완료</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </RootView>
    );
}

export default AlbumScreen_new;

const styles = StyleSheet.create({
    album: {
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

    text: {
        fontFamily: fonts.bold,
        fontSize: rFont(20),

        includeFontPadding: false,
        textAlignVertical: 'center'
    }
})