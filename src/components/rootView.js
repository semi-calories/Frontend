import React from "react";

import { View, StyleSheet} from "react-native";

export function RootView({children}) {
    return(
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#ffffff',
    }
});