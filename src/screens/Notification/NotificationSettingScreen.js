//
// 알림 설정 화면
//

import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { useRecoilValue } from 'recoil';

import { MoveButton } from '~/components/button';
import { RootView } from '~/components/container';
import { DateTimePickerSelect } from '~/components/date';
import { BackHeader } from '~/components/header';
import { getSecureData, storeSecureData } from '~/components/secureStore';

import { EXPO_TOKEN } from '~/constants/secureStoreKey';

import { rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { UserState } from '~/atoms/UserAtom';

import {
  getSetting,
  saveSetting,
  updateSetting,
} from '~/apis/api/pushNotification';

const NotificationSettingScreen = ({ navigation }) => {
  const user = useRecoilValue(UserState);
  //console.log("NotificationSettingScreen user", user)

  const [isEnabled, setIsEnabled] = useState(false);

  const [breakfast, setBreakfast] = useState(new Date(2023, 8, 19, 7));
  const [lunch, setLunch] = useState(new Date(2023, 8, 19, 13));
  const [dinner, setDinner] = useState(new Date(2023, 8, 19, 18, 30));

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          back
          title="알림설정"
          backPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (user.constructor === Object && Object.keys(user).length === 0) {
      return;
    }

    getNotiSetting();
  }, [user]);

  const getNotiSetting = async () => {
    //await SecureStore.deleteItemAsync('ExpoToken')
    const expoToken = await getSecureData(EXPO_TOKEN);

    if (!expoToken) {
      return;
    }

    try {
      const response = await getSetting({ userCode: user.userCode });
      console.log(response);

      if (response) {
        setIsEnabled(response.setting);

        const bf = new Date(breakfast);
        bf.setHours(response.breakfastHour);
        bf.setMinutes(response.breakfastMinute);
        setBreakfast(bf);
        const lun = new Date(lunch);
        lun.setHours(response.lunchHour);
        lun.setMinutes(response.lunchMinute);
        setLunch(lun);
        const din = new Date(dinner);
        din.setHours(response.dinnerHour);
        din.setMinutes(response.dinnerMinute);
        setDinner(din);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSwitch = async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!isEnabled) {
      const { status } = await Notifications.getPermissionsAsync();
      //console.log(status)

      if (status !== 'granted') {
        Alert.alert(
          '알림 권한',
          '식단 알림을 설정하는 것은\n알림 권한이 필요합니다.',
          [
            { text: '취소', onPress: () => {} },
            { text: '확인', onPress: () => Linking.openSettings() },
          ],
        );

        return;
      }

      const expoToken = await getSecureData(EXPO_TOKEN);

      if (expoToken === null) {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        });
        console.log(token);

        await saveSetting({
          userCode: user.userCode,
          userToken: token.data,
          setting: true,
        });

        storeSecureData(EXPO_TOKEN, token.data);
      }
    }

    setIsEnabled(!isEnabled);
  };

  const handleComplete = async () => {
    const expoToken = await getSecureData(EXPO_TOKEN);

    const reqBody = {
      userCode: user.userCode,
      setting: isEnabled,
      userToken: expoToken,
      breakfastHour: breakfast.getHours(),
      breakfastMinute: breakfast.getMinutes(),
      lunchHour: lunch.getHours(),
      lunchMinute: lunch.getMinutes(),
      dinnerHour: dinner.getHours(),
      dinnerMinute: dinner.getMinutes(),
    };
    console.log(reqBody);

    try {
      await updateSetting(reqBody);

      Alert.alert('식단 알림이 설정되었습니다.');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <RootView viewStyle={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.flexRow}>
          <Text style={styles.text}>식단 알림 설정</Text>
          <Switch
            trackColor={{ false: colors.textGrey, true: colors.switch }}
            thumbColor={colors.white}
            onValueChange={handleSwitch}
            value={isEnabled}
          />
        </View>
        <Text style={styles.greyText}>
          정해진 시간에 맞춰 식단 추천 알람을 보내드려요
        </Text>
        {isEnabled && (
          <View
            style={{ paddingTop: rHeight(20), paddingHorizontal: rWidth(40) }}
          >
            <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
              <Text style={styles.boldGreyText}>아침</Text>
              <DateTimePickerSelect
                mode="time"
                value={breakfast}
                onChange={(event, selectedDate) => setBreakfast(selectedDate)}
              />
            </View>
            <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
              <Text style={styles.boldGreyText}>점심</Text>
              <DateTimePickerSelect
                mode="time"
                value={lunch}
                onChange={(event, selectedDate) => setLunch(selectedDate)}
              />
            </View>
            <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
              <Text style={styles.boldGreyText}>저녁</Text>
              <DateTimePickerSelect
                mode="time"
                value={dinner}
                onChange={(event, selectedDate) => setDinner(selectedDate)}
              />
            </View>
          </View>
        )}
      </View>
      <MoveButton text="완료" onPress={handleComplete} />
    </RootView>
  );
};

export default NotificationSettingScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rWidth(37),
    paddingTop: rHeight(25),
  },

  text: {
    fontFamily: fonts.bold,
    fontSize: rFont(18),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greyText: {
    fontFamily: fonts.medium,
    fontSize: rFont(12),
    color: colors.borderGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  boldGreyText: {
    fontFamily: fonts.bold,
    fontSize: rFont(15),
    color: colors.borderGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
