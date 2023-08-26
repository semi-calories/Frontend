//
//AsyncStorage data 가져오고 저장하는 컴포넌트
//

import AsyncStorage from '@react-native-async-storage/async-storage';

import { USER_INFO } from "~/constants/asyncStoragekey";

export const StoreUserData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(USER_INFO, jsonValue);
    } catch (e) {
        console.log(e)
    }
};

export const GetUserData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(USER_INFO);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e)
    }
};
