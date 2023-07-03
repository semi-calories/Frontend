import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import RootStack from "./screens/RootStack";

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
