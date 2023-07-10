import React, { useEffect } from 'react';

import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';

import RootStack from "~/screens/RootStack";

export default function App() {
  let [fontsLoaded] = useFonts({
    'NotoSans_100Thin': require('@assets/fonts/NotoSansKR-Thin.otf'),
    'NotoSans_300Light': require('@assets/fonts/NotoSansKR-Light.otf'),
    'NotoSans_400Regular': require('@assets/fonts/NotoSansKR-Regular.otf'),
    'NotoSans_500Medium': require('@assets/fonts/NotoSansKR-Medium.otf'),
    'NotoSans_700Bold': require('@assets/fonts/NotoSansKR-Bold.otf'),
    'NotoSans_900Black': require('@assets/fonts/NotoSansKR-Black.otf'),
  });

  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.hideAsync(); //splash screen 닫기
    }
    if (fontsLoaded) { //font 로드완료
      hideSplashScreen();
    }
  }, [fontsLoaded]); //fontsLoaded 상태 변경 마다 실행


  if (!fontsLoaded) {
    return null;
  } else {
    return (
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </SafeAreaView>
    );
  }
}
