//
// 알림 설정 화면
//

import React, { useLayoutEffect, useState, useEffect } from "react";

import { View, Text, StyleSheet, Switch, Alert} from "react-native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { RootView } from "~/components/container";
import { BackHeader } from "~/components/header";
import { MoveButton } from "~/components/button";
import { DateTimePickerSelect } from "~/components/date";
import { GetUserData } from "~/components/asyncStorageData";

import { rWidth, rHeight, rFont } from "~/constants/globalSizes";
import { colors, fonts } from "~/constants/globalStyles";

import { getSetting, saveSetting, updateSetting } from "~/apis/api/pushNotification";

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token.data;
  }

const NotificationSettingScreen = ({ navigation }) => {
    const [user, setUser] = useState({})
    console.log("NotificationSettingScreen user",user)

    const [isEnabled, setIsEnabled] = useState(false);

    const [breakfast, setBreakfast] = useState(new Date(2023, 8, 19, 7));
    const [lunch, setLunch] = useState(new Date(2023, 8, 19, 13));
    const [dinner, setDinner] = useState(new Date(2023, 8, 19, 18, 30))

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="알림설정" backPress={() => navigation.goBack()} />
        });
    }, [navigation]);

    useEffect(()=>{
        getUser()
    },[])

    useEffect(()=>{
        if(user.constructor === Object
            && Object.keys(user).length === 0)  {
           return;
         }

        getNotiSetting();
    },[user])

    const getUser = async () => {
        const data = await GetUserData();

        setUser({ ...data })
    }

    const getNotiSetting =async()=>{
        console.log(typeof user.userCode, user.userCode)
        
        try {
            const { response } = await getSetting(user.userCode)
            console.log(response)
        } catch (err) {
            console.log(err)
        }
    }    

    const handleSwitch =async()=>{
        setIsEnabled(!isEnabled)

        // if(!isEnabled){
        //     registerForPushNotificationsAsync()
        //     .then(token => saveSetting({
        //         userCode: user.userCode,
        //         userToken: token,
        //         setting: true,
        //     }));
        // }
    }

    const handleComplete = async() => {
        const expoToken = await SecureStore.getItemAsync('ExpoToken');

        const reqBody={
            userCode: user.userCode,
            setting: isEnabled,
            userToken:expoToken,
            breakfastHour:breakfast.getHours(),
            breakfastMinute:breakfast.getMinutes(),
            lunchHour: lunch.getHours(),
            lunchMinute:lunch.getMinutes(),
            dinnerHour: dinner.getHours(),
            dinnerMinute:dinner.getMinutes(),
        }
        console.log(reqBody)

        try {
            const { response } = await updateSetting(reqBody)

            Alert.alert('식단 알림이 설정되었습니다.')
        } catch (err) {
            console.log(err)
        } 
    }

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
                <Text style={styles.greyText}>정해진 시간에 맞춰 식단 추천 알람을 보내드려요</Text>
                {isEnabled && (
                    <View style={{ paddingTop: rHeight(20), paddingHorizontal: rWidth(40) }}>
                        <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
                            <Text style={styles.boldGreyText}>아침</Text>
                            <DateTimePickerSelect mode="time" value={breakfast} onChange={(event, selectedDate) => setBreakfast(selectedDate)} />
                        </View>
                        <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
                            <Text style={styles.boldGreyText}>점심</Text>
                            <DateTimePickerSelect mode="time" value={lunch} onChange={(event, selectedDate) => setLunch(selectedDate)} />
                      </View>
                        <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
                            <Text style={styles.boldGreyText}>저녁</Text>
                            <DateTimePickerSelect mode="time" value={dinner} onChange={(event, selectedDate) => setDinner(selectedDate)} />
                        </View>
                    </View>
                )}
            </View>
            <MoveButton text="완료" onPress={handleComplete} />
        </RootView>
    );
}

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
        textAlignVertical: 'center'
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
        textAlignVertical: 'center'
    },

    boldGreyText: {
        fontFamily: fonts.bold,
        fontSize: rFont(15),
        color: colors.borderGrey,

        includeFontPadding: false,
        textAlignVertical: 'center'
    },
});