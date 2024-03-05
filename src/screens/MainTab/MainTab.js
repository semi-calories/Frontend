import { Foundation, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View } from 'react-native';

import { TabBarButton } from '~/components/button';
import { rWidth, rHeight } from '~/constants/globalSizes';
import { colors } from '~/constants/globalStyles';
import { useTabMenu } from '~/context/TabContext';
import DietRecordScreen from '~/screens/MainTab/DietRecordScreen';
import HomeScreen from '~/screens/MainTab/HomeScreen';
import RecommendScreen from '~/screens/MainTab/RecommendScreen';

const Tab = createBottomTabNavigator();

const MainTab = ({ navigation }) => {
  const { opened, toggleOpened } = useTabMenu();

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
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
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => (
            <View style={{ width: rHeight(30) }}>
              <Foundation name="home" size={rHeight(40)} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="DietRecordScreen"
        component={DietRecordScreen}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          tabBarButton: () => (
            <TabBarButton
              opened={opened}
              toggleOpened={toggleOpened}
              navigation={navigation}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RecommendScreen"
        component={RecommendScreen}
        options={{
          tabBarLabel: '추천',
          tabBarIcon: ({ color }) => (
            <View style={{ width: rHeight(40) }}>
              <MaterialIcons name="thumb-up" size={rHeight(40)} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
