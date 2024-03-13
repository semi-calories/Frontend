//
// 선호, 비선호 음식 선택할 수 있는 Screen
//

import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import { PrimaryButton } from '~/components/button';
import { CloseChip } from '~/components/chip';
import { RootView } from '~/components/container';
import { SearchHeader } from '~/components/header';

import { RecordType, SearchFoodType } from '~/constants/type';

import { dWidth, rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { foodSearch } from '~/apis/api/diet';

const SearchFoodScreen = ({ navigation, route }) => {
  const { type, userInfo } = route.params;
  console.log('SearchFoodScreen route.params', route.params);

  const [text, setText] = useState('');

  const [foodList, setFoodList] = useState([]);
  //console.log('SearchFoodScreen foodList', foodList)
  const [selectFood, setSelectFood] = useState([]);
  console.log('SearchFoodScreen selectFood', selectFood);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SearchHeader
          backPress={() => navigation.goBack()}
          text={text}
          onChangeText={setText}
          clearText={() => setText('')}
        />
      ),
    });
  }, [navigation, text]);

  useEffect(() => {
    foodSearchFunc();
  }, [text]);

  const foodSearchFunc = async () => {
    try {
      const { foodList } = await foodSearch({ foodName: text });
      //console.log('foodSearchFunc foodList', foodList)

      setFoodList([...foodList]);
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.foodView} onPress={() => handleSelect(item)}>
        <Text style={styles.text}>{item.foodName}</Text>
        <AntDesign
          name={selectFood.includes(item) ? 'checkcircle' : 'checkcircleo'}
          size={rWidth(20)}
          color={colors.borderGrey}
        />
      </Pressable>
    );
  };

  const handleSelect = (item) => {
    if (selectFood.includes(item)) {
      const rest = selectFood.filter((food) => food !== item);
      setSelectFood([...rest]);
    } else {
      setSelectFood((prev) => [...prev, item]);
    }
  };

  const handleComplete = () => {
    if (selectFood.length) {
      if (type === SearchFoodType.add) {
        navigation.navigate('MealtimeScreen', {
          foodParam: selectFood,
          userInfo,
          type: RecordType.init,
        });
      } else {
        // 이전 화면에 선택한 food 업데이트 해줘야함
        navigation.navigate('SetFoodScreen', {
          type,
          foodParam: selectFood,
          userInfo,
        });
      }
    } else {
      Alert.alert('항목을 하나이상 선택해주세요');
    }
  };

  return (
    <RootView>
      <View style={{ flex: 1 }}>
        {text && !foodList.length ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <AntDesign
              name="exclamationcircleo"
              size={rWidth(60)}
              color={colors.btnBackground}
            />
            <Text style={[styles.text, { marginTop: rHeight(15) }]}>
              검색 결과가 없습니다.
            </Text>
          </View>
        ) : (
          <FlatList
            data={foodList}
            renderItem={renderItem}
            keyExtractor={(item, idx) => item + idx}
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: rWidth(30) }}
          />
        )}
      </View>
      <View style={styles.selectBtnView}>
        <ScrollView horizontal style={styles.chipView}>
          {selectFood &&
            [...selectFood].map((food, idx) => (
              <CloseChip
                key={food + idx}
                onClose={() =>
                  setSelectFood([...selectFood.filter((fd) => fd !== food)])
                }
                text={food.foodName}
              />
            ))}
        </ScrollView>
        <PrimaryButton
          text={`${selectFood.length}개 선택`}
          btnStyle={{
            width: rWidth(345),
            backgroundColor:
              type === SearchFoodType.dislike ? colors.pink : colors.primary,
          }}
          onPress={handleComplete}
        />
      </View>
    </RootView>
  );
};

export default SearchFoodScreen;

const styles = StyleSheet.create({
  foodView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: rWidth(10),
    paddingVertical: rHeight(24),

    borderBottomWidth: rWidth(1),
    borderBottomColor: colors.textGrey,
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: rFont(18),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  selectBtnView: {
    width: dWidth,
    //height: rHeight(150),
    paddingHorizontal: rWidth(20),
    paddingVertical: rHeight(10),

    borderWidth: rWidth(2),
    borderColor: colors.textGrey,
    borderBlockEndColor: colors.white,
    borderBottomColor: colors.white,
    borderTopLeftRadius: rWidth(10),
    borderTopRightRadius: rWidth(10),
  },

  chipView: {
    marginVertical: rHeight(10),
  },
});
