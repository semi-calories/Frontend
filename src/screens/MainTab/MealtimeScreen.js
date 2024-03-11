//
//식사일시 입력하는 화면
//

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import {
  Pressable,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { registerRecord, updateRecord, deleteRecord } from '~/apis/api/diet';
import { MoveButton, PrimaryButton } from '~/components/button';
import { RootView } from '~/components/container';
import { DateTimePickerSelect } from '~/components/date';
import { BackHeader } from '~/components/header';
import { servingRegex } from '~/components/regex';
import { BasicTextInput } from '~/components/textInput';
import {
  Nutrition,
  Nutrition_ko,
  Satisfaction,
  Satisfaction_icon,
  Satisfaction_ko,
} from '~/constants/food';
import { rWidth, rHeight, rFont } from '~/constants/globalSizes';
import { fonts, colors } from '~/constants/globalStyles';
import { RecordType } from '~/constants/type';

const MealtimeScreen = ({ navigation, route }) => {
  const { userInfo, type } = route.params;
  console.log('MealtimeScreen userInfo', userInfo);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  console.log('date time', date, time);

  const [selectFoods, setSelectFoods] = useState([]);
  console.log('MealtimeScreen selectFoods', selectFoods);
  const [foodDetail, setFoodDetail] = useState();
  console.log('MealtimeScreen foodDetail', foodDetail);

  const [serving, setServing] = useState();
  const [editing, setEditing] = useState(false);

  const refRBSheet = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <BackHeader back backPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  useEffect(() => {
    setSelectFoods([...route.params?.foodParam]);

    if (route.params?.foodParam[0].eatDate) {
      setDate(new Date(route.params?.foodParam[0].eatDate));
      setTime(new Date(route.params?.foodParam[0].eatDate));
    }
  }, [route.params?.foodParam]);

  useEffect(() => {
    if (foodDetail) {
      if (!serving) {
        Alert.alert('섭취량을 입력해주세요.');
        return;
      }

      if (!servingRegex.test(serving)) {
        Alert.alert('올바른 형식인지 확인하세요.');
        return;
      }

      caculateServing();
    }
  }, [editing]);

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={[styles.box, styles.border]}
        onPress={() => handlePressDetail(item)}
      >
        <View>
          <Text style={[styles.boldText, { fontSize: rWidth(20) }]}>
            {item.foodName}
          </Text>
          <View style={styles.foodView}>
            <Text style={styles.greyText}>{item.foodKcal}kcal</Text>
            <Text style={styles.greyText}> ㅣ </Text>
            <Text style={styles.greyText}>{item.foodWeight}g</Text>
          </View>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={35}
          color={colors.borderGrey}
        />
      </Pressable>
    );
  };

  const handlePressDetail = (food) => {
    console.log('##', food);
    setFoodDetail(food);
    setServing(food.foodWeight);

    refRBSheet.current.open();
  };

  const caculateServing = () => {
    const ratio = serving / foodDetail?.foodWeight;

    setFoodDetail((prev) => {
      return {
        ...prev,
        [Nutrition.foodWeight]: serving,
        [Nutrition.foodKcal]: Math.round(prev.foodKcal * ratio * 10) / 10,
        [Nutrition.foodCarbo]: Math.round(prev.foodCarbo * ratio * 10) / 10,
        [Nutrition.foodProtein]: Math.round(prev.foodProtein * ratio * 10) / 10,
        [Nutrition.foodFat]: Math.round(prev.foodFat * ratio * 10) / 10,
      };
    });
  };

  const handleSatisfaction = (satisfaction) => {
    setFoodDetail((prev) => ({
      ...prev,
      satisfaction,
    }));
  };

  const SatisfactionFunc = ({ label, onPress, satisfaction }) => {
    return (
      <Pressable onPress={onPress} style={{ alignItems: 'center' }}>
        <MaterialCommunityIcons
          name={Satisfaction_icon[label]}
          size={rHeight(50)}
          color={label === satisfaction ? colors.primary : colors.textGrey}
        />
        <Text
          style={[
            styles.smallLabelText,
            {
              color: label === satisfaction ? colors.primary : colors.textGrey,
            },
          ]}
        >
          {Satisfaction_ko[label]}
        </Text>
      </Pressable>
    );
  };

  const handleDetailDelete = () => {
    setSelectFoods([
      ...selectFoods.filter((food) => food.foodCode !== foodDetail.foodCode),
    ]);
    setFoodDetail({});

    refRBSheet.current.close();
  };

  const handleDetailSave = () => {
    if (!serving) {
      Alert.alert('섭취량을 입력해주세요.');
      return;
    }

    if (!servingRegex.test(serving)) {
      Alert.alert('섭취량이 올바른 형식인지 확인하세요.');
      return;
    }

    const result = selectFoods.map((food) =>
      food.foodCode === foodDetail.foodCode ? foodDetail : food,
    );
    console.log('handleSave', result);

    setSelectFoods([...result]);
    setFoodDetail({});

    refRBSheet.current.close();
  };

  const handleComplete = async () => {
    if (selectFoods.length === 0) {
      Alert.alert('식사를 하나 이상 기록해주세요.');
      return;
    }

    const dateOnly = moment(date).format('YYYY-MM-DD');
    const timeOnly = moment(time).format(' HH:mm');

    const dateTime = moment(dateOnly + timeOnly).format('YYYY-MM-DDTHH:mm:ss');
    // console.log('dateTime', dateTime)

    try {
      await Promise.all(
        selectFoods.map(async (food) => {
          const recordInfo = {
            userCode: userInfo.userCode,
            eatDate: dateTime,
            foodWeight: food.foodWeight,
            foodCode: food.foodCode,
            foodName: food.foodName,
            foodKcal: food.foodKcal,
            foodCarbo: food.foodCarbo,
            foodProtein: food.foodProtein,
            foodFat: food.foodFat,
            satisfaction: food.satisfaction ? food.satisfaction : null,
          };

          await registerRecord(recordInfo);
        }),
      );

      Alert.alert('식사가 저장되었습니다.');

      navigation.pop(2);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async () => {
    const dateOnly = moment(date).format('YYYY-MM-DD');
    const timeOnly = moment(time).format(' HH:mm');

    const dateTime = moment(dateOnly + timeOnly).format('YYYY-MM-DDTHH:mm:ss');

    const recordInfo = {
      userCode: userInfo.userCode,
      originalEatDate: route.params?.foodParam[0].eatDate,
      originalFoodCode: selectFoods[0].foodCode,

      eatDate: dateTime,
      foodWeight: selectFoods[0].foodWeight,
      foodCode: selectFoods[0].foodCode,
      foodName: selectFoods[0].foodName,
      foodKcal: selectFoods[0].foodKcal,
      foodCarbo: selectFoods[0].foodCarbo,
      foodProtein: selectFoods[0].foodProtein,
      foodFat: selectFoods[0].foodFat,
      satisfaction: selectFoods[0].satisfaction
        ? selectFoods[0].satisfaction
        : null,
    };

    try {
      await updateRecord(recordInfo);

      Alert.alert('식사가 수정되었습니다.');

      navigation.pop();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    const recordInfo = {
      userCode: userInfo.userCode,
      foodCode: selectFoods[0].foodCode,
      eatDate: route.params?.foodParam[0].eatDate,
    };

    try {
      await deleteRecord(recordInfo);

      Alert.alert('식사가 삭제되었습니다.');

      navigation.pop();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <RootView>
      <View style={[styles.container, styles.borderThick]}>
        <Text style={styles.boldText}>식사일시</Text>
        <View style={{ marginTop: rHeight(30) }}>
          <View style={[styles.box, styles.border]}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={rHeight(33)}
              color={colors.black}
            />
            <DateTimePickerSelect
              mode="date"
              value={date}
              onChange={(event, selectedDate) => setDate(selectedDate)}
            />
          </View>
          <View style={styles.box}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={rHeight(33)}
              color={colors.black}
            />
            <DateTimePickerSelect
              mode="time"
              value={time}
              onChange={(event, selectedDate) => setTime(selectedDate)}
            />
          </View>
        </View>
      </View>
      <View style={[styles.container, { flex: 1 }]}>
        <Text style={styles.boldText}>음식</Text>
        <FlatList
          data={selectFoods}
          renderItem={renderItem}
          keyExtractor={(item, idx) => item + idx}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {type === RecordType.init ? (
        <View style={{ paddingHorizontal: rWidth(30) }}>
          <MoveButton
            text="완료"
            onPress={handleComplete}
            inActive={!selectFoods.length}
          />
        </View>
      ) : (
        <View style={styles.btnView}>
          <MoveButton
            text="삭제"
            btnStyle={[
              styles.btnStyle,
              { backgroundColor: colors.white, borderWidth: 2 },
            ]}
            textStyle={{ color: colors.black }}
            onPress={handleDelete}
          />
          <MoveButton
            text="수정"
            btnStyle={styles.btnStyle}
            onPress={handleUpdate}
          />
        </View>
      )}

      {/* 음식상세 */}
      <RBSheet
        ref={refRBSheet}
        height={rHeight(630)}
        closeOnDragDown
        customStyles={{
          container: {
            borderRadius: rWidth(10),
            paddingBottom: rHeight(25),
          },
          draggableIcon: {
            backgroundColor: colors.textGrey,
          },
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={[styles.container, styles.borderThick]}>
            <View
              style={[
                styles.border,
                { alignItems: 'center', paddingBottom: rHeight(15) },
              ]}
            >
              <Text style={styles.boldText}>{foodDetail?.foodName}</Text>
            </View>
            <View style={styles.detailNutriView}>
              <BasicTextInput
                value={serving}
                unit="g"
                onChangeText={setServing}
                width={rWidth(250)}
                defaultValue={foodDetail?.foodWeight?.toString()}
                inputStyle={styles.inputStyle}
                onEndEditing={() => setEditing(!editing)}
                keyboardType="numeric"
                validType="섭취량"
                valid={servingRegex.test(serving)}
              />
              <View style={[styles.flexRow, { marginVertical: rHeight(10) }]}>
                <Text style={styles.mtext}>
                  {Nutrition_ko[Nutrition.foodKcal]}
                </Text>
                <Text style={styles.mtext}>{foodDetail?.foodKcal} kcal</Text>
              </View>
              <View style={styles.flexRow}>
                <View style={styles.nutri}>
                  <Text style={styles.mtext}>
                    {Nutrition_ko[Nutrition.foodCarbo]}
                  </Text>
                  <Text style={styles.mtext}>{foodDetail?.foodCarbo} g</Text>
                </View>
                <View style={styles.verticalBorder} />
                <View style={styles.nutri}>
                  <Text style={styles.mtext}>
                    {Nutrition_ko[Nutrition.foodProtein]}
                  </Text>
                  <Text style={styles.mtext}>{foodDetail?.foodProtein} g</Text>
                </View>
                <View style={styles.verticalBorder} />
                <View style={styles.nutri}>
                  <Text style={styles.mtext}>
                    {Nutrition_ko[Nutrition.foodFat]}
                  </Text>
                  <Text style={styles.mtext}>{foodDetail?.foodFat} g</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <Text style={[styles.boldText, { fontSize: rFont(20) }]}>
              만족도
            </Text>
            <View style={styles.satisView}>
              <SatisfactionFunc
                label={Satisfaction.dislike}
                onPress={() => handleSatisfaction(Satisfaction.dislike)}
                satisfaction={foodDetail?.satisfaction}
              />
              <SatisfactionFunc
                label={Satisfaction.normal}
                onPress={() => handleSatisfaction(Satisfaction.normal)}
                satisfaction={foodDetail?.satisfaction}
              />
              <SatisfactionFunc
                label={Satisfaction.like}
                onPress={() => handleSatisfaction(Satisfaction.like)}
                satisfaction={foodDetail?.satisfaction}
              />
            </View>
          </View>
        </ScrollView>
        {selectFoods.length > 1 ? (
          <View style={styles.btnView}>
            <PrimaryButton
              text="삭제"
              btnStyle={[styles.btnStyle, { backgroundColor: colors.pink }]}
              onPress={handleDetailDelete}
            />
            <PrimaryButton
              text="저장"
              btnStyle={styles.btnStyle}
              onPress={handleDetailSave}
            />
          </View>
        ) : (
          <View style={{ alignSelf: 'center' }}>
            <PrimaryButton
              text="저장"
              btnStyle={{ width: rWidth(340) }}
              onPress={handleDetailSave}
            />
          </View>
        )}
      </RBSheet>
    </RootView>
  );
};

export default MealtimeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rWidth(35),
    paddingVertical: rHeight(10),
  },

  borderThick: {
    borderBottomWidth: rWidth(5),
    borderColor: colors.fat,
  },

  border: {
    borderBottomWidth: rWidth(1),
    borderColor: colors.textGrey,
  },

  boldText: {
    fontFamily: fonts.bold,
    fontSize: rFont(25),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  mtext: {
    fontFamily: fonts.medium,
    fontSize: rFont(18),
    color: colors.black,

    marginVertical: rHeight(10),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  text: {
    fontFamily: fonts.regular,
    fontSize: rFont(20),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  smallLabelText: {
    fontFamily: fonts.medium,
    fontSize: rFont(15),

    marginVertical: rHeight(5),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  greyText: {
    fontFamily: fonts.regular,
    fontSize: rFont(15),
    color: colors.borderGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rWidth(15),
    paddingVertical: rHeight(13),
  },

  foodView: {
    flexDirection: 'row',
    paddingHorizontal: rWidth(10),
    marginVertical: rHeight(7),
  },

  detailNutriView: {
    paddingHorizontal: rWidth(35),
    marginVertical: rHeight(20),
  },

  inputStyle: {
    fontFamily: fonts.regular,
    fontSize: rFont(20),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nutri: {
    width: rWidth(70),
    alignItems: 'center',
  },

  verticalBorder: {
    width: rWidth(1),
    height: rHeight(55),
    backgroundColor: colors.textGrey,
  },

  satisView: {
    flexDirection: 'row',
    paddingHorizontal: rWidth(20),
    justifyContent: 'space-evenly',
    marginVertical: rHeight(15),
  },

  btnView: {
    flexDirection: 'row',
    paddingHorizontal: rWidth(19),
    justifyContent: 'space-between',
  },

  btnStyle: {
    width: rWidth(170),
    //height: rHeight(50)
  },
});
