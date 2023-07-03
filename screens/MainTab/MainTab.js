import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Button, View } from "react-native";

import HomeScreen from "./HomeScreen";
import DietRecordScreen from "./DietRecordScreen";
import RecommendScreen from "./RecommendScreen";
import { HeaderButtons } from "react-navigation-header-buttons";

const Tab = createBottomTabNavigator();

const MainTab = ({ navigation }) => {
    return (
        <Tab.Navigator screenOptions={{
            headerRight: () => <TabHeader navigation={navigation} />
        }}>
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="DietRecordScreen" component={DietRecordScreen} />
            <Tab.Screen name="RecommendScreen" component={RecommendScreen} />
        </Tab.Navigator>
    );
}

// header shown: false로 하고 custom으로 생성하기
const TabHeader = ({ navigation }) => {
    return (
        <HeaderButtons>
            <Button
                onPress={() => navigation.navigate('NotificationScreen')}
                title="알림"
            />
            <Button
                onPress={() => navigation.navigate('UserInfoMainScreen')}
                title="사용자 정보"
            />
        </HeaderButtons>
    );
}

export default MainTab;

const styles = StyleSheet.create({});