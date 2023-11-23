import React from "react";

import { View, Text, StyleSheet, Platform } from 'react-native'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { PrimaryButton } from '~/components/button';

import { fonts, colors } from "~/constants/globalStyles";
import { rWidth, rHeight, rFont } from "~/constants/globalSizes";

import { saveSetting } from "~/apis/api/pushNotification";

export const AccessRightModal = ({ isVisible, toggleModal, user }) => {
    console.log('AccessRightModal user', user)

    const onPressComfirm = async () => {
        let token;

        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: albumStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status } = await Notifications.requestPermissionsAsync();

            if (status !== 'granted') {
                return;
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig.extra.eas.projectId,
            });
            console.log(token);

            await saveSetting({
                userCode: user.userCode,
                userToken: token.data,
                setting: true,
            })

            await SecureStore.setItemAsync('ExpoToken', JSON.stringify(token.data));
        } else {
            alert('Must use physical device for Push Notifications');
        }

        toggleModal()
    }

    return (
        <Modal isVisible={isVisible} style={styles.container}>
            <View style={styles.modal}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.boldText}>앱 접근 권한 안내</Text>
                    <Text style={[styles.text, { marginTop: rHeight(10), textAlign: 'center' }]}>Semi-Calories의 다양한 서비스 제공을 위해{'\n'} 다음과 같은 기능이 필요합니다.</Text>
                </View>

                <View style={styles.rightView}>
                    <Text style={[styles.semiBoldText]}>선택적 접근 권한</Text>
                    <View style={styles.flexRow}>
                        <View style={styles.icon}>
                            <Feather name="camera" size={rHeight(25)} color={colors.black} />
                        </View>
                        <View>
                            <Text style={[styles.text, { color: colors.black }]}>카메라 및 앨범 (선택)</Text>
                            <Text style={[styles.text, { fontSize: rFont(12) }]}>유저 사진 설정, 식단 기록 시 사용</Text>
                        </View>
                    </View>
                    <View style={styles.flexRow}>
                        <View style={styles.icon}>
                            <MaterialIcons name="notifications-none" size={rHeight(25)} color={colors.black} />
                        </View>
                        <View>
                            <Text style={[styles.text, { color: colors.black }]}>알림(선택)</Text>
                            <Text style={[styles.text, { fontSize: rFont(12) }]}>식단 추천 푸시 알람 시 사용</Text>
                        </View>
                    </View>
                    <Text style={[styles.noticeText, { marginTop: rHeight(15), color: 'black' }]}>* 필수적 접근 권한은 사용하지 않습니다.</Text>
                    <Text style={[styles.noticeText, { marginTop: rHeight(20) }]}>* 선택적 접근 권한은 해당 기능을 사용할 때만 허용이 필요합니다.</Text>
                    <Text style={[styles.noticeText]}>* 비허용시에도 해당 기능 외 서비스 이용이 가능합니다. 허용 상태는 휴대폰 설정 메뉴에서 언제든지 변경할 수 있습니다.</Text>
                </View>
                <View style={{ alignSelf: 'center', marginBottom: rHeight(10), marginTop: rHeight(25) }}>
                    <PrimaryButton text="확인" onPress={onPressComfirm} btnStyle={{ width: rWidth(260) }} />
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    modal: {
        width: rWidth(300),
        //height: rHeight(550),
        backgroundColor: colors.white,
        paddingTop: rHeight(30),
        borderRadius: rHeight(15),
    },

    boldText: {
        fontFamily: fonts.bold,
        fontSize: rFont(20),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    semiBoldText: {
        fontFamily: fonts.medium,
        fontSize: rFont(16),
        color: colors.black,

        includeFontPadding: false,
        textAlignVertical: 'center',

        marginBottom: rHeight(10)
    },

    text: {
        fontFamily: fonts.regular,
        fontSize: rFont(14),
        color: 'grey',

        includeFontPadding: false,
        textAlignVertical: 'center'
    },

    noticeText: {
        fontFamily: fonts.regular,
        fontSize: rFont(12),
        color: 'grey',

        includeFontPadding: false,
        textAlignVertical: 'center',
    },

    rightView: {
        marginTop: rHeight(30),
        paddingHorizontal: rWidth(20)
    },

    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: rWidth(20),
        marginVertical: rHeight(8)
    },

    icon: {
        backgroundColor: colors.btnBackground,
        alignItems: 'center',
        justifyContent: 'center',
        width: rHeight(50),
        height: rHeight(50),
        borderRadius: rWidth(50),

        marginRight: rWidth(20)
    }

})