//import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Platform, LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { RecoilRoot } from 'recoil';

import RootStack from '~/screens/RootStack';

import { rHeight } from '~/styles/globalSizes';

import { TabContextProvider } from '~/context/TabContext';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  //debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

function App() {
  const [fontsLoaded, fontError] = useFonts({
    NotoSans_100Thin: require('~/assets/fonts/NotoSansKR-Thin.otf'),
    NotoSans_300Light: require('~/assets/fonts/NotoSansKR-Light.otf'),
    NotoSans_400Regular: require('~/assets/fonts/NotoSansKR-Regular.otf'),
    NotoSans_500Medium: require('~/assets/fonts/NotoSansKR-Medium.otf'),
    NotoSans_700Bold: require('~/assets/fonts/NotoSansKR-Bold.otf'),
    NotoSans_900Black: require('~/assets/fonts/NotoSansKR-Black.otf'),
  });

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  LogBox.ignoreAllLogs();

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <RecoilRoot>
        <TabContextProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </TabContextProvider>
      </RecoilRoot>
    </SafeAreaView>
  );
}

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? rHeight(45) : 0,
    // paddingBottom: Platform.OS === 'android' ? rHeight(15) : 0,
  },
});
