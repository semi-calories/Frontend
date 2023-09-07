import React, { useState } from "react";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Foundation, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import HomeScreen from "~/screens/MainTab/HomeScreen";
import DietRecordScreen from "~/screens/MainTab/DietRecordScreen";
import RecommendScreen from "~/screens/MainTab/RecommendScreen";

import { useTabMenu } from "~/context/TabContext";
import { TabBarButton } from "~/components/button";

import { colors } from "~/constants/globalStyles";
import { scale, verticalScale } from "~/constants/globalSizes";

const Tab = createBottomTabNavigator();

const MainTab = ({ navigation }) => {
    const { opened, toggleOpened } = useTabMenu();

    return (
        <Tab.Navigator
            screenOptions={{
                // tabBarLabelStyle: { fontSize: scale(14) },
                tabBarShowLabel: false,

                tabBarActiveTintColor: colors.black,
                tabBarInactiveTintColor: colors.textGrey,

                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: colors.white,
                    height: scale(78),

                    borderWidth: scale(2),
                    borderColor: colors.textGrey,
                    borderBottomColor: colors.white,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                },
            }}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ color }) => (
                        <Foundation name="home" size={40} color={color} />
                    )
                }}
                listeners={{
                    tabPress: e => opened && e.preventDefault()
                }}
            />
            <Tab.Screen name="DietRecordScreen" component={DietRecordScreen}
                options={{
                    tabBarItemStyle: {
                        height: 0
                    },
                    tabBarButton: () => (
                        <TabBarButton opened={opened} toggleOpened={toggleOpened} navigation={navigation} />
                    )
                }}
            />
            <Tab.Screen name="RecommendScreen" component={RecommendScreen}
                options={{
                    tabBarLabel: '추천',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="thumb-up" size={40} color={color} />
                    )
                }}
                listeners={{
                    tabPress: e => opened && e.preventDefault()
                }}
            />
        </Tab.Navigator>
    );
}

export default MainTab;

const styles = StyleSheet.create({
    btn: {
        top: verticalScale(-30),
        width: scale(80),
        height: verticalScale(80),
        borderRadius: 40,
        backgroundColor: colors.primary,

        justifyContent: 'center',
        alignItem: 'center',
    },

    shadow: {
        shadowColor: colors.textGrey,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
});