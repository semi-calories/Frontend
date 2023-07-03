import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginSignupScreen from "./LoginSignup/LoginSignupScreen";
import LoginScreen from "./LoginSignup/LoginScreen";
import SignupScreen from "./LoginSignup/SignupScreen";

import MainTab from "./MainTab/MainTab";

import UserInfoMainScreen from "./UserInfo/UserInfoMainScreen";
import UserInfoEditScreen from "./UserInfo/UserInfoEditScreen";
import SetGoalScreen from "./UserInfo/SetGoalScreen";
import CalculateGoalScreen from "./UserInfo/CaculateGoalScreen";
import SetFoodScreen from "./UserInfo/SetFoodScreen";
import SearchFoodScreen from "./UserInfo/SearchFoodScreen";

import NotificationScreen from "./Notification/NotificationScreen";
import NotificationSettingScreen from "./Notification/NotificationSettingScreen";

const Stack = createNativeStackNavigator();

const RootStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LoginSignupScreen" component={LoginSignupScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />

            <Stack.Screen name="MainTab" component={MainTab} />

            <Stack.Screen name="UserInfoMainScreen" component={UserInfoMainScreen} />
            <Stack.Screen name="UserInfoEditScreen" component={UserInfoEditScreen} />
            <Stack.Screen name="SetGoalScreen" component={SetGoalScreen} />
            <Stack.Screen name="CalculateGoalScreen" component={CalculateGoalScreen} />
            <Stack.Screen name="SetFoodScreen" component={SetFoodScreen} />
            <Stack.Screen name="SearchFoodScreen" component={SearchFoodScreen} />

            <Stack.Screen name="NotificationScreen" component={NotificationScreen}/>
            <Stack.Screen name="NotificationSettingScreen" component={NotificationSettingScreen} />
        </Stack.Navigator>
    );
}

export default RootStack;