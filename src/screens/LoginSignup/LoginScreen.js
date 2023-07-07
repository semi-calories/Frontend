//
//로그인 화면
//

import React, { useLayoutEffect } from "react";

import { Text, StyleSheet ,Button} from "react-native";

import { RootView } from "~/components/rootView";
import { BackHeader } from "~/components/header";
import { HeaderType } from "~/constants/type";

const LoginScreen = ({navigation}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            header:  () => <BackHeader back backPress={() => navigation.goBack()}/>
        });
      }, [navigation]);

    return (
        <RootView>
            <Text>로그인 화면</Text>
            <Button title="로그인" onPress={()=>navigation.navigate('MainTab')}/>
        </RootView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({});