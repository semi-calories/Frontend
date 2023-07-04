import React from "react";

import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import RootStack from "@screens/RootStack";

export default function App() {
  return (
    <SafeAreaView style={{ flex:1 }}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaView>
  );
}
