// 공통적으로 쓰이는 Container

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