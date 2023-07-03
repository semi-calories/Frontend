import React from "react";

import { View, Text, StyleSheet, Button} from "react-native";

const NotificationScreen = ({navigation}) => {
    return (
        <View>
            <Text>알림화면</Text>
            <Button title="알림 설정" onPress={()=>navigation.navigate('NotificationSettingScreen')}/>
        </View>
    );
}

export default NotificationScreen;

const styles = StyleSheet.create({});