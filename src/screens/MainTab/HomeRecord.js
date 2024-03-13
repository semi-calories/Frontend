//
// 홈화면 - 기록 상태 보는 화면
//

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  FlatList,
  PixelRatio,
} from 'react-native';

import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import RBSheet from 'react-native-raw-bottom-sheet';

import { DonutChart } from '~/components/chart';
import { CalculateRecordDate } from '~/components/date';

import { Nutrition, Nutrition_ko } from '~/constants/food';
import { RecordType } from '~/constants/type';

import { dWidth, rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { getRecord } from '~/apis/api/diet';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const radius = PixelRatio.roundToNearestPixel(rHeight(110));
const STROKE_WIDTH = rHeight(30);

const HomeRecord = ({ navigation, userInfo }) => {
  const refRBSheetCalendar = useRef();
  const refRBSheetRecord = useRef();

  const [selectDate, setSelectDate] = useState(new Date());
  console.log('HomeRecord selectDate', selectDate);

  const [records, setRecords] = useState([]);
  console.log('HomeRecord records', records);

  //DonutChart 에러 나는거 막기 위함
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (userInfo.userCode) {
      getDietRecord();
      setLoaded(true);
    }
  }, [selectDate, userInfo]);

  //요일 계산
  const day = useMemo(() => DAYS[selectDate.getDay()], [selectDate]);
  //날짜 포맷; YYYY-MM-DD 형식
  const formatDate = useMemo(
    () => moment(selectDate).format('YYYY-MM-DD'),
    [selectDate],
  );

  const getDietRecord = async () => {
    const recordInfo = {
      userCode: userInfo.userCode,
      dateTime: moment(selectDate).format('YYYY-MM-DD'),
    };

    try {
      const { userRecordDtos } = await getRecord(recordInfo);

      setRecords([...userRecordDtos]);
    } catch (err) {
      console.log(err);
    }
  };

  const NutritionFunc = ({ name }) => {
    let nutri = '';

    switch (name) {
      case 'foodCarbo':
        nutri = 'carbo';
        break;
      case 'foodProtein':
        nutri = 'protein';
        break;
      case 'foodFat':
        nutri = 'fat';
        break;
      default:
        break;
    }

    const target = Math.round(userInfo[nutri]);
    const spent = Math.round(caculateSpent(Nutrition[name]));
    const ratio = Math.round((spent / target) * 100);

    return (
      <View
        style={[styles.flexRowSpaceBetween, { marginVertical: rHeight(17) }]}
      >
        <Text style={[styles.text, { width: rWidth(67) }]}>
          {Nutrition_ko[name]}
        </Text>
        <View style={[styles.flexRow, { width: rWidth(72) }]}>
          <Text style={[styles.text, { fontFamily: fonts.bold }]}>{spent}</Text>
          <Text style={styles.greyText}> / {target} g</Text>
        </View>
        <View style={[styles.flexRow, { width: rWidth(38) }]}>
          <Text style={[styles.text, { fontFamily: fonts.bold }]}>{ratio}</Text>
          <Text style={styles.greyText}> %</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.container} onPress={() => handleDetail(item)}>
        <View style={styles.flexRowSpaceBetween}>
          <Text style={styles.text}>{item.dietRecordList.foodName}</Text>
          <Text style={styles.greyText}>
            {item.dietRecordList.foodKcal} kcal
          </Text>
        </View>
        <View
          style={[
            styles.flexRowSpaceBetween,
            { marginTop: rHeight(10), paddingHorizontal: rWidth(5) },
          ]}
        >
          <View style={styles.nutri}>
            <Text style={styles.greyText}>
              {Nutrition_ko[Nutrition.foodCarbo]}
            </Text>
            <Text style={styles.greyText}>
              {item.dietRecordList.foodCarbo} g
            </Text>
          </View>
          <View style={styles.verticalBorder} />
          <View style={styles.nutri}>
            <Text style={styles.greyText}>
              {Nutrition_ko[Nutrition.foodProtein]}
            </Text>
            <Text style={styles.greyText}>
              {item.dietRecordList.foodProtein} g
            </Text>
          </View>
          <View style={styles.verticalBorder} />
          <View style={styles.nutri}>
            <Text style={styles.greyText}>
              {Nutrition_ko[Nutrition.foodFat]}
            </Text>
            <Text style={styles.greyText}>{item.dietRecordList.foodFat} g</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const caculateSpent = (nutri) => {
    return records.reduce((acc, cur, idx) => {
      return (acc += cur.dietRecordList[nutri]);
    }, 0);
  };

  const handleDetail = (item) => {
    const detail = {
      foodCode: item.foodCode,
      eatDate: item.dietRecordList.eatDate,
      foodCarbo: item.dietRecordList.foodCarbo,
      foodFat: item.dietRecordList.foodFat,
      foodKcal: item.dietRecordList.foodKcal,
      foodName: item.dietRecordList.foodName,
      foodProtein: item.dietRecordList.foodProtein,
      foodWeight: item.dietRecordList.foodWeight,
      satisfaction: item.userSatisfactionList.satisfaction,
    };
    console.log('handleDetail detail', [detail]);

    refRBSheetRecord.current.close();
    navigation.navigate('MealtimeScreen', {
      foodParam: [detail],
      userInfo,
      type: RecordType.edit,
    });
  };

  return (
    <View>
      {/* 날짜 선택하는 뷰 */}
      <View style={styles.dayView}>
        <Pressable
          onPress={() => setSelectDate(CalculateRecordDate('sub', selectDate))}
        >
          <Entypo name="chevron-left" size={rHeight(35)} color="black" />
        </Pressable>
        <Pressable
          onPress={() => refRBSheetCalendar.current.open()}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={styles.text}>
            {moment(selectDate).format(`MM월 DD일 (${day})`)}
          </Text>
          <Ionicons
            name="caret-down-outline"
            size={rWidth(16)}
            color="black"
            style={{ marginLeft: rWidth(5) }}
          />
        </Pressable>
        <Pressable
          onPress={() => setSelectDate(CalculateRecordDate('add', selectDate))}
        >
          <Entypo name="chevron-right" size={rHeight(35)} color="black" />
        </Pressable>
      </View>

      {/* 차트 및 기록 뷰 */}
      <View style={styles.chartView}>
        <Pressable
          style={styles.chartContainer}
          onPress={() => refRBSheetRecord.current.open()}
        >
          {isLoaded && (
            <DonutChart
              strokeWidth={STROKE_WIDTH}
              radius={radius}
              spentAmount={Math.round(caculateSpent(Nutrition.foodKcal))}
              targetAmount={Math.round(userInfo?.kcal)}
            />
          )}
        </Pressable>
      </View>

      {/* 탄단지 영양성분 뷰 */}
      <View style={styles.nutritionView}>
        <NutritionFunc name={Nutrition.foodCarbo} />
        <NutritionFunc name={Nutrition.foodProtein} />
        <NutritionFunc name={Nutrition.foodFat} />
      </View>

      {/* 캘린더 */}
      <RBSheet
        ref={refRBSheetCalendar}
        height={rHeight(320)}
        closeOnDragDown
        customStyles={{
          container: {
            borderRadius: rHeight(10),
          },
          draggableIcon: {
            backgroundColor: colors.textGrey,
          },
        }}
      >
        <Calendar
          initialDate={formatDate}
          hideExtraDays
          dayComponent={({ date }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectDate(new Date(date.dateString));
                  refRBSheetCalendar.current.close();
                }}
              >
                <Text
                  style={[
                    styles.calendarText,
                    {
                      color:
                        formatDate === date.dateString
                          ? colors.primary
                          : colors.black,
                    },
                  ]}
                >
                  {date.day}
                </Text>
              </TouchableOpacity>
            );
          }}
          theme={{
            arrowColor: colors.black,
          }}
        />
      </RBSheet>

      {/* 식단조회 */}
      <RBSheet
        ref={refRBSheetRecord}
        height={rHeight(500)}
        closeOnDragDown
        customStyles={{
          container: {
            borderRadius: 10,
            paddingHorizontal: rWidth(30),
            paddingBottom: rHeight(30),
          },
          draggableIcon: {
            backgroundColor: colors.textGrey,
          },
        }}
      >
        {records.length ? (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={(item, idx) => item + idx}
            //showsVerticalScrollIndicator="false"
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <AntDesign
              name="exclamationcircleo"
              size={rWidth(60)}
              color={colors.btnBackground}
            />
            <Text style={[styles.text, { marginTop: rHeight(15) }]}>
              식사 기록이 없습니다.
            </Text>
          </View>
        )}
      </RBSheet>
    </View>
  );
};

export default HomeRecord;

const styles = StyleSheet.create({
  dayView: {
    width: dWidth,
    height: rHeight(35),
    marginTop: rHeight(20),
    paddingHorizontal: rWidth(20),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: rFont(18),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  calendarText: {
    textAlign: 'center',
    fontSize: rFont(15),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  chartView: {
    paddingVertical: rHeight(20),
    //flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chartContainer: {
    width: radius * 2,
    height: radius * 2,
  },

  nutritionView: {
    width: rWidth(280),
    // height: rHeight(202),
    borderWidth: rWidth(2),
    borderRadius: rHeight(10),
    borderColor: colors.textGrey,
    marginHorizontal: rWidth(55),

    paddingHorizontal: rWidth(22),
    paddingVertical: rHeight(10),
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flexRowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  greyText: {
    fontFamily: fonts.medium,
    fontSize: rFont(16),
    color: colors.borderGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  container: {
    paddingVertical: rHeight(24),

    borderBottomWidth: rWidth(1),
    borderBottomColor: colors.textGrey,
  },

  nutri: {
    width: rWidth(80),
    alignItems: 'center',
  },

  verticalBorder: {
    width: rWidth(1),
    height: rHeight(24),
    backgroundColor: colors.textGrey,
  },
});
