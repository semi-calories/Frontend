// 전체 화면에 기본적으로 쓰는 View

import React from "react";

import { View, StyleSheet} from "react-native";

import { colors } from "~/constants/globalStyles";

export function RootView({children, viewStyle}) {
    return(
        <View style={[styles.container, viewStyle]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor : colors.white,
    }
});