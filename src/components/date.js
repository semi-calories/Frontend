//
//date 관련
//
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React from 'react';
import { Platform, StyleSheet, Pressable, Text } from 'react-native';

import { rWidth, rHeight, rFont } from '~/constants/globalSizes';
import { colors, fonts } from '~/constants/globalStyles';

const moment = extendMoment(Moment);

//기록 - 날짜 더하고 빼고 계산
export const CalculateRecordDate = (calculation, date) => {
  const clone = new Date(date);

  if (calculation === 'add') clone.setDate(date.getDate() + 1);
  if (calculation === 'sub') clone.setDate(date.getDate() - 1);

  return clone;
};

//통계 - 날짜 더하고 뺴고 계산
export const CalculateStatisticDate = (type, calculation, date) => {
  const clone = new Date(date);

  if (type === '주간') {
    const adjustDate = date.getMonth();
    clone.setMonth(calculation === 'add' ? adjustDate + 1 : adjustDate - 1);
  } else if (type === '월간') {
    const adjustDate = date.getFullYear();
    clone.setFullYear(calculation === 'add' ? adjustDate + 1 : adjustDate - 1);
  }

  return clone;
};

//매월 주차 구하기
export const CalculateWeek = (year, month) => {
  //console.log('CalculateWeek year, month', year, month)
  const startDate = moment.utc([year, month - 1]);

  const firstDay = moment(startDate).startOf('month');
  const endDay = moment(startDate).endOf('month');

  const monthRange = moment.range(firstDay, endDay);

  const weeks = [];

  for (const mday of monthRange.by('days')) {
    if (weeks.indexOf(mday.week()) === -1) {
      weeks.push(mday.week());
    }
  }

  const calendar = [];

  for (let index = 0; index < weeks.length; index++) {
    const weeknumber = weeks[index];
    let firstWeekDay = moment(firstDay).week(weeknumber).day(0);
    if (firstWeekDay.isBefore(firstDay)) {
      firstWeekDay = firstDay;
    }
    let lastWeekDay = moment(endDay).week(weeknumber).day(6);
    if (lastWeekDay.isAfter(endDay)) {
      lastWeekDay = endDay;
    }

    const weekRange = moment.range(firstWeekDay, lastWeekDay);
    calendar.push(weekRange);
  }

  return calendar;
};

export const FormatWeekData = (rawWeekData) => {
  //console.log('FormatWeekData', rawWeekData)

  const weekData = [];

  for (const week of rawWeekData) {
    const formatStartDate = moment(week.start).format('YYYY-MM-DD');
    const formatEndDate = moment(week.end).format('YYYY-MM-DD');

    weekData.push({ start: formatStartDate, end: formatEndDate });
  }

  return weekData;
};

//시간 포맷 - 8:30 PM 형태
export const FormatTime = (date) => {
  return moment(date).format('LT');
};

//날짜 포맷 - 09/04/1986 형태
export const FormatDate = (date) => {
  return moment(date).format('L');
};

//날짜, 시간 선택하는 picker - android, ios 둘 다 사용
export const DateTimePickerSelect = ({ mode, value, onChange }) => {
  return Platform.OS === 'android' ? (
    <Pressable
      style={styles.pickerView}
      onPress={() =>
        DateTimePickerAndroid.open({
          mode,
          value,
          onChange,
        })
      }
    >
      <Text style={styles.pickerText}>
        {mode === 'time' ? FormatTime(value) : FormatDate(value)}
      </Text>
    </Pressable>
  ) : (
    <DateTimePicker mode={mode} value={value} onChange={onChange} />
  );
};

export const getFoodTimes = (type) => {
  let time = '';

  switch (type) {
    case 1:
      time = '아침';
      break;
    case 2:
      time = '점심';
      break;
    case 3:
      time = '저녁';
      break;
    default:
      break;
  }

  return time;
};

const styles = StyleSheet.create({
  pickerView: {
    paddingVertical: rHeight(4),
    paddingHorizontal: rWidth(15),
    backgroundColor: colors.btnBackground,
    borderRadius: 10,
  },

  pickerText: {
    fontFamily: fonts.medium,
    fontSize: rFont(16),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
