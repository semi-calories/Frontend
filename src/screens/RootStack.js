import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import LoginScreen from '~/screens/LoginSignup/LoginScreen';
import LoginSignupScreen from '~/screens/LoginSignup/LoginSignupScreen';
import SignupScreen from '~/screens/LoginSignup/SignupScreen';
import AccessRightScreen from '~/screens/MainTab/AccessRightScreen';
import AlbumScreen_new from '~/screens/MainTab/AlbumScreen_new';
import CameraScreen from '~/screens/MainTab/CameraScreen';
import MainTab from '~/screens/MainTab/MainTab';
import MealtimeScreen from '~/screens/MainTab/MealtimeScreen';
import NotificationScreen from '~/screens/Notification/NotificationScreen';
import NotificationSettingScreen from '~/screens/Notification/NotificationSettingScreen';
import CalculateGoalScreen from '~/screens/UserInfo/CaculateGoalScreen';
import FAQScreen from '~/screens/UserInfo/FAQScreen';
import InquiryScreen from '~/screens/UserInfo/InquiryScreen';
import SearchFoodScreen from '~/screens/UserInfo/SearchFoodScreen';
import SetFoodScreen from '~/screens/UserInfo/SetFoodScreen';
import SetGoalScreen from '~/screens/UserInfo/SetGoalScreen';
import UserInfoEditScreen from '~/screens/UserInfo/UserInfoEditScreen';
import UserInfoMainScreen from '~/screens/UserInfo/UserInfoMainScreen';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginSignupScreen"
        component={LoginSignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />

      <Stack.Screen
        name="AccessRightScreen"
        component={AccessRightScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="AlbumScreen_new" component={AlbumScreen_new} />
      <Stack.Screen name="MealtimeScreen" component={MealtimeScreen} />

      <Stack.Screen name="UserInfoMainScreen" component={UserInfoMainScreen} />
      <Stack.Screen name="UserInfoEditScreen" component={UserInfoEditScreen} />
      <Stack.Screen name="SetGoalScreen" component={SetGoalScreen} />
      <Stack.Screen
        name="CalculateGoalScreen"
        component={CalculateGoalScreen}
      />
      <Stack.Screen name="SetFoodScreen" component={SetFoodScreen} />
      <Stack.Screen name="SearchFoodScreen" component={SearchFoodScreen} />
      <Stack.Screen name="InquiryScreen" component={InquiryScreen} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />

      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen
        name="NotificationSettingScreen"
        component={NotificationSettingScreen}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
