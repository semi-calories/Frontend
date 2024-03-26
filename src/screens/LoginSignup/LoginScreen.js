//
//로그인 화면
//

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Alert, View, Text } from 'react-native';

import { Checkbox } from 'react-native-paper';
import { useSetRecoilState } from 'recoil';

import { storeData, getData, removeData } from '~/components/ayncStorage';
import { PrimaryButton } from '~/components/button';
import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';
import { BasicTextInput } from '~/components/textInput';

import { IS_USER_ID_SAVED, USER_ID } from '~/constants/asyncStoragekey';

import { rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { UserState } from '~/atoms/UserAtom';

import { login } from '~/apis/api/loginSignup';
import { getInfo } from '~/apis/api/user';
import { getLoginInfo } from '~/apis/services/loginSignup';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [checked, setChecked] = useState(false);

  const setUserState = useSetRecoilState(UserState);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <BackHeader back backPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  useEffect(() => {
    (async function () {
      let isUserEmailSaved = await getData(IS_USER_ID_SAVED);
      isUserEmailSaved = JSON.parse(isUserEmailSaved) || false;
      setChecked(isUserEmailSaved);

      if (isUserEmailSaved) {
        const userEmail = await getData(USER_ID);
        setEmail(userEmail);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!(email && password)) {
      Alert.alert('항목들을 모두 입력해주세요.');
      return;
    }

    const userInfo = {
      userEmail: email,
      userPassword: password,
    };

    const rawResponse = await login(userInfo);
    const { user, error } = getLoginInfo(rawResponse);

    if (user) {
      const userData = await getInfo({ userCode: user.userCode });
      setUserState({ ...userData, userCode: user.userCode });

      // 이메일 저장 여부
      if (checked) {
        storeData(USER_ID, email);
      } else {
        removeData(USER_ID);
      }
      storeData(IS_USER_ID_SAVED, JSON.stringify(checked));

      navigation.navigate('MainTab');
    } else {
      Alert.alert(error);
    }
  };

  return (
    <RootView viewStyle={styles.container}>
      <BasicTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="이메일"
        width={rWidth(298)}
        valid
      />
      <BasicTextInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        width={rWidth(298)}
        password
        valid
      />
      <View style={styles.checkboxContainer}>
        <Checkbox.Android
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
          color={colors.primary}
        />
        <Text style={styles.text}>아이디 저장</Text>
      </View>
      <PrimaryButton
        text="로그인"
        onPress={handleLogin}
        btnStyle={styles.btn}
      />
    </RootView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxContainer: {
    flexDirection: 'row',
    width: '78%',
    alignItems: 'center',
    marginTop: rHeight(5),
  },

  text: {
    fontFamily: fonts.regular,
    fontSize: rFont(12),
    color: colors.black,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  btn: {
    marginTop: rHeight(20),
  },
});
