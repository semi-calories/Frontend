//
//앱 접근 권한 설명
//

import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PrimaryButton } from '~/components/button';
import { RootView } from '~/components/container';
import { rWidth, rHeight, rFont } from '~/constants/globalSizes';
import { fonts, colors } from '~/constants/globalStyles';

const AccessRightScreen = ({ navigation }) => {
  const onPressComfirm = async () => {
    await Camera.requestCameraPermissionsAsync();
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (Device.isDevice) {
      await Notifications.requestPermissionsAsync();
    } else {
      alert('Must use physical device for Push Notifications');
    }

    navigation.navigate('MainTab');
  };

  return (
    <RootView viewStyle={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.boldText}>앱 접근 권한 안내</Text>
          <Text
            style={[
              styles.text,
              { marginTop: rHeight(10), textAlign: 'center' },
            ]}
          >
            Semi-Calories의 다양한 서비스 제공을 위해{'\n'} 다음과 같은 기능이
            필요합니다.
          </Text>
        </View>

        <View style={styles.rightView}>
          <Text style={[styles.semiBoldText]}>선택적 접근 권한</Text>
          <View style={styles.flexRow}>
            <View style={styles.icon}>
              <Feather name="camera" size={rHeight(30)} color={colors.black} />
            </View>
            <View>
              <Text style={[styles.text, { color: colors.black }]}>
                카메라 및 앨범 (선택)
              </Text>
              <Text style={[styles.text, { fontSize: rFont(14) }]}>
                유저 사진 설정, 식단 기록 시 사용
              </Text>
            </View>
          </View>
          <View style={styles.flexRow}>
            <View style={styles.icon}>
              <MaterialIcons
                name="notifications-none"
                size={rHeight(30)}
                color={colors.black}
              />
            </View>
            <View>
              <Text style={[styles.text, { color: colors.black }]}>
                알림(선택)
              </Text>
              <Text style={[styles.text, { fontSize: rFont(14) }]}>
                식단 추천 푸시 알람 시 사용
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.noticeText,
              { marginTop: rHeight(15), color: 'black' },
            ]}
          >
            * 필수적 접근 권한은 사용하지 않습니다.
          </Text>
          <Text style={[styles.noticeText, { marginTop: rHeight(30) }]}>
            * 선택적 접근 권한은 해당 기능을 사용할 때만 허용이 필요합니다.
          </Text>
          <Text style={[styles.noticeText]}>
            * 비허용시에도 해당 기능 외 서비스 이용이 가능합니다. 허용 상태는
            휴대폰 설정 메뉴에서 언제든지 변경할 수 있습니다.
          </Text>
        </View>
      </View>
      <View style={{ alignSelf: 'center' }}>
        <PrimaryButton
          text="확인"
          onPress={onPressComfirm}
          btnStyle={{ width: rWidth(340) }}
        />
      </View>
    </RootView>
  );
};

export default AccessRightScreen;

const styles = StyleSheet.create({
  container: {
    //paddingHorizontal: scale(30),
    paddingTop: rHeight(20),
  },

  boldText: {
    fontFamily: fonts.bold,
    fontSize: rFont(25),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  semiBoldText: {
    fontFamily: fonts.medium,
    fontSize: rFont(18),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',

    marginBottom: rHeight(10),
  },

  text: {
    fontFamily: fonts.regular,
    fontSize: rFont(16),
    color: 'grey',

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  noticeText: {
    fontFamily: fonts.regular,
    fontSize: rFont(13),
    color: 'grey',

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  rightView: {
    marginTop: rHeight(40),
    paddingHorizontal: rWidth(20),
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rWidth(20),
    marginVertical: rHeight(8),
  },

  icon: {
    backgroundColor: colors.btnBackground,
    alignItems: 'center',
    justifyContent: 'center',
    width: rHeight(60),
    height: rHeight(60),
    borderRadius: rWidth(50),

    marginRight: rWidth(20),
  },
});
