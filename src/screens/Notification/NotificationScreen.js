//
// 알림 보여주는 화면
//

import React, { useLayoutEffect } from "react";

import { View, Text, StyleSheet } from "react-native";

import { BackHeader } from "~/components/header";
import { RootView } from "~/components/rootView";

import { HeaderType } from "~/constants/type";

const NotificationScreen = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <BackHeader back title="알림" backPress={() => navigation.goBack()} rightType={HeaderType.setting} rightPress={() => navigation.navigate('NotificationSettingScreen')} />
        });
    }, [navigation]);


    return (
        <RootView>
            <Text>알림화면</Text>
        </RootView>
    );
}

export default NotificationScreen;

const styles = StyleSheet.create({});