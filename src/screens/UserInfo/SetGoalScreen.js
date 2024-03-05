//
//목표 설정하는 Screen
//

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useSetRecoilState } from 'recoil';

import { updateInfo, getInfo } from '~/apis/api/user';
import { UserState } from '~/atoms/UserAtom';
import { MoveButton } from '~/components/button';
import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';
import { periodRegex } from '~/components/regex';
import { BasicTextInput } from '~/components/textInput';
import { rWidth, rHeight, rFont } from '~/constants/globalSizes';
import { fonts, colors } from '~/constants/globalStyles';
import { UserInfoType } from '~/constants/type';
import { Goal, Goal_explain, Goal_icon, Goal_ko } from '~/constants/userInfo';

const GoalFunc = ({ label, onPress, goal }) => {
  return (
    <Pressable
      style={[
        styles.content,
        label === goal ? styles.selectedView : styles.noSelectedView,
      ]}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', alignItem: 'center' }}>
        <View style={{ width: rWidth(180) }}>
          <Text
            style={[
              styles.contentTitle,
              { color: label === goal ? colors.white : colors.black },
            ]}
          >
            {Goal_ko[label]}
          </Text>
          <Text
            style={[
              styles.contentLabel,
              { color: label === goal ? colors.white : colors.black },
            ]}
          >
            {Goal_explain[label]}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={Goal_icon[label]}
          size={rHeight(45)}
          color="black"
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
};

const SetGoalScreen = ({ navigation, route }) => {
  const { infoType, userInfo } = route.params;
  console.log('SetGoalScreen userInfo', userInfo);

  const [userGoal, setGoal] = useState(Goal.health);
  const [period, setPeriod] = useState('');

  const setUserState = useSetRecoilState(UserState);

  useLayoutEffect(() => {
    if (infoType === UserInfoType.init) {
      navigation.setOptions({
        header: () => <BackHeader back backPress={() => navigation.goBack()} />,
      });
    } else if (infoType === UserInfoType.edit) {
      navigation.setOptions({
        header: () => (
          <BackHeader
            back
            title="목표 설정"
            backPress={() => navigation.goBack()}
          />
        ),
      });
    }
  }, [navigation, infoType]);

  useEffect(() => {
    if (userInfo.userGoal) {
      setGoal(userInfo.userGoal);
    }
    if (userInfo.period) {
      setPeriod(userInfo.period);
    }
  }, [route.params]);

  const onPressMove = async () => {
    if (userGoal !== Goal.health && !periodRegex.test(period)) {
      Alert.alert('올바른 형식인지 확인하세요');
      return;
    }

    const user = {
      userCode: userInfo.userCode,
      email: userInfo.email,
      image: userInfo.image,
      name: userInfo.name,
      gender: userInfo.gender,
      age: userInfo.age,
      height: userInfo.height,
      weight: userInfo.weight,
      userActivity: userInfo.userActivity,
      goalWeight: userInfo.goalWeight,
      userGoal,
      period,
    };

    // const userWeight = {
    //   userCode: userInfo.userCode,
    //   goalWeight: userInfo.goalWeight,
    //   period: Number(period),
    // };

    try {
      //await savePredictWeight(userWeight)
      await updateInfo(user);
      const userData = await getUserInfo();

      navigation.push('CalculateGoalScreen', { userInfo: userData, infoType });
    } catch (err) {
      console.log(err);
    }
  };

  const getUserInfo = async () => {
    try {
      const user = await getInfo({ userCode: userInfo.userCode });
      setUserState({ ...user, userCode: userInfo.userCode });

      return { ...user, userCode: userInfo.userCode };
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <RootView viewStyle={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>목표가 무엇인가요?</Text>
        <GoalFunc
          label={Goal.health}
          onPress={() => setGoal(Goal.health)}
          goal={userGoal}
        />
        <GoalFunc
          label={Goal.lose}
          onPress={() => setGoal(Goal.lose)}
          goal={userGoal}
        />
        <GoalFunc
          label={Goal.gain}
          onPress={() => setGoal(Goal.gain)}
          goal={userGoal}
        />
        {userGoal !== Goal.health && (
          <View style={[styles.box, styles.flexRow]}>
            <View style={{ justifyContent: 'center', height: rHeight(60) }}>
              <Text style={styles.labelText}>기간</Text>
            </View>
            <BasicTextInput
              value={period.toString()}
              onChangeText={setPeriod}
              unit="일"
              width={rWidth(170)}
              keyboardType="numeric"
              validType="기간"
              valid={periodRegex.test(period)}
            />
          </View>
        )}
      </View>
      <MoveButton text="다음" onPress={onPressMove} />
    </RootView>
  );
};

export default SetGoalScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rWidth(30),
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: rFont(25),
    color: colors.black,

    marginVertical: rHeight(30),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  labelText: {
    fontFamily: fonts.bold,
    fontSize: rFont(20),
    color: colors.borderGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  content: {
    width: rWidth(320),
    //height: rWidth(90),
    borderRadius: rHeight(10),

    marginVertical: rHeight(5),
    paddingHorizontal: rWidth(20),
    paddingVertical: rHeight(10),
  },

  selectedView: {
    backgroundColor: colors.primary,
  },

  noSelectedView: {
    backgroundColor: colors.white,
    borderWidth: rWidth(2),
    borderColor: colors.textGrey,
  },

  contentTitle: {
    fontFamily: fonts.bold,
    fontSize: rFont(19),
    marginVertical: rHeight(3),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  contentLabel: {
    fontFamily: fonts.regular,
    fontSize: rFont(14),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  icon: {
    alignSelf: 'center',
    marginLeft: rWidth(50),
  },

  box: {
    flexDirection: 'row',
    //alignItems: "center",
    justifyContent: 'space-between',
    paddingHorizontal: rWidth(15),
    paddingVertical: rHeight(20),
  },

  flexRow: {
    flexDirection: 'row',
  },
});
