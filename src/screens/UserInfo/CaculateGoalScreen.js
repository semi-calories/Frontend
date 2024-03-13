//
// 목표량 계산 Screen
//

import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { MoveButton } from '~/components/button';
import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';
import { LabelTextInput } from '~/components/textInput';

import { Nutrition, Nutrition_ko } from '~/constants/food';
import { UserInfoType } from '~/constants/type';

import { rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { fonts, colors } from '~/styles/globalStyles';

const CalculateGoalScreen = ({ navigation, route }) => {
  const { infoType, userInfo } = route.params;
  console.log('CalculateGoalScreen', userInfo, infoType);

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

  return (
    <RootView viewStyle={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>목표량을 계산했어요</Text>
        <View style={styles.inputViewStyle}>
          <LabelTextInput
            dark
            label="목표 섭취열량"
            unit="kcal"
            width={rWidth(298)}
            defaultValue={Math.round(userInfo?.kcal).toString()}
            inputStyle={styles.inputStyle}
          />
          <View style={{ marginTop: rHeight(40) }}>
            <View style={styles.contentView}>
              <LabelTextInput
                dark
                label={Nutrition_ko[Nutrition.foodCarbo]}
                unit="g"
                width={rWidth(180)}
                defaultValue={Math.round(userInfo?.carbo).toString()}
                inputStyle={styles.inputStyle}
              />
              <Text style={styles.calText}>
                {Math.round(userInfo?.carbo) * 4} kcal
              </Text>
            </View>
            <View style={styles.contentView}>
              <LabelTextInput
                dark
                label={Nutrition_ko[Nutrition.foodProtein]}
                unit="g"
                width={rWidth(180)}
                defaultValue={Math.round(userInfo?.protein).toString()}
                inputStyle={styles.inputStyle}
              />
              <Text style={styles.calText}>
                {Math.round(userInfo?.protein) * 4} kcal
              </Text>
            </View>
            <View style={styles.contentView}>
              <LabelTextInput
                dark
                label={Nutrition_ko[Nutrition.foodFat]}
                unit="g"
                width={rWidth(180)}
                defaultValue={Math.round(userInfo?.fat).toString()}
                inputStyle={styles.inputStyle}
              />
              <Text style={styles.calText}>
                {Math.round(userInfo?.fat) * 9} kcal
              </Text>
            </View>
          </View>
        </View>
      </View>
      {infoType === UserInfoType.init ? (
        <MoveButton
          text="다음"
          onPress={() =>
            navigation.navigate('SetFoodScreen', {
              userInfo,
              infoType: UserInfoType.init,
            })
          }
        />
      ) : (
        <MoveButton text="완료" onPress={() => navigation.pop(2)} />
      )}
    </RootView>
  );
};

export default CalculateGoalScreen;

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

  inputViewStyle: {
    marginHorizontal: rWidth(10),
  },

  inputStyle: {
    fontFamily: fonts.bold,
    fontSize: rFont(20),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: rHeight(10),
  },

  calText: {
    fontFamily: fonts.bold,
    fontSize: rFont(20),

    marginTop: rHeight(47),
    marginRight: rWidth(15),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
