import React, { useEffect, useState, useRef } from 'react';

//import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaView, StyleSheet, Platform, LogBox } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';

import RootStack from "~/screens/RootStack";
import { TabContextProvider } from '~/context/TabContext';

import { rHeight } from "~/constants/globalSizes";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  let [fontsLoaded] = useFonts({
    'NotoSans_100Thin': require('~/assets/fonts/NotoSansKR-Thin.otf'),
    'NotoSans_300Light': require('~/assets/fonts/NotoSansKR-Light.otf'),
    'NotoSans_400Regular': require('~/assets/fonts/NotoSansKR-Regular.otf'),
    'NotoSans_500Medium': require('~/assets/fonts/NotoSansKR-Medium.otf'),
    'NotoSans_700Bold': require('~/assets/fonts/NotoSansKR-Bold.otf'),
    'NotoSans_900Black': require('~/assets/fonts/NotoSansKR-Black.otf'),
  });

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();

  useEffect(()=>{
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
  },[])

  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.hideAsync(); //splash screen 닫기
    }
    if (fontsLoaded) { //font 로드완료
      hideSplashScreen();
    }
  }, [fontsLoaded]); //fontsLoaded 상태 변경 마다 실행

  LogBox.ignoreAllLogs();


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <TabContextProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </TabContextProvider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? rHeight(45) : 0,
    paddingBottom: Platform.OS == "android" ? rHeight(15) : 0
  }
})
