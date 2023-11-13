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
import { rWidth, rHeight } from "~/constants/globalSizes";

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
                    height: rHeight(78),

                    borderWidth: rWidth(2),
                    borderColor: colors.textGrey,
                    borderBlockEndColor: colors.white,
                    borderBottomColor: colors.white,
                    borderTopLeftRadius: rHeight(10),
                    borderTopRightRadius: rHeight(10),
                },
            }}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ color }) => (
                        <View style={{ width: rHeight(30) }}>
                            <Foundation name="home" size={rHeight(40)} color={color} />
                        </View>
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
                        <View style={{ width: rHeight(40)}}>
                            <MaterialIcons name="thumb-up" size={rHeight(40)} color={color} />
                        </View>
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
        top: rHeight(-30),
        width: rWidth(80),
        height: rHeight(80),
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