//
//문의하기 화면
//
import * as MailComposer from 'expo-mail-composer';
import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { MoveButton } from '~/components/button';
import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';
import { emailRegex } from '~/components/regex';
import { rWidth, rHeight, rFont } from '~/constants/globalSizes';
import { fonts, colors } from '~/constants/globalStyles';
import { ValidFormat } from '~/constants/validFormat';

const InquiryScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const [value, setValue] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          back
          backPress={() => navigation.goBack()}
          title="문의하기"
        />
      ),
    });
  }, [navigation]);

  const onPressSubmit = async () => {
    if (!(email && value && title && content)) {
      Alert.alert('항목들을 모두 작성해주세요.');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('올바른 형식인지 확인하세요');
      return;
    }

    // 이메일 보내기
    try {
      const subject = `[${value}] ${title}`;
      const body = `이메일: ${email}\n\n문의 내용:\n${content}`;

      await MailComposer.composeAsync({
        recipients: ['hesushim@gmail.com'], // 받는 이메일 주소
        subject,
        body,
      });
    } catch (error) {
      console.error('이메일 보내기 오류:', error);
      Alert.alert('이메일 보내기에 실패했습니다.');
    }
  };

  const data = [
    { key: 'email' },
    { key: 'type' },
    { key: 'title' },
    { key: 'content' },
  ];

  const items = [
    { label: '이용 문의', value: '이용 문의' },
    { label: '로그인/회원가입 문의', value: '로그인/회원가입 문의' },
    { label: '서비스 불편/오류 제보', value: '서비스 불편/오류 제보' },
    { label: '서비스 제안', value: '서비스 제안' },
    { label: '기타 문의', value: '기타 문의' },
  ];

  const renderItem = ({ item }) => {
    switch (item.key) {
      case 'email':
        return (
          <View style={styles.inputView}>
            <Text style={styles.text}>답변 받으실 이메일</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="example@email.com"
            />
            {email && !emailRegex.test(email) && (
              <Text style={styles.validateText}>{ValidFormat('이메일')}</Text>
            )}
          </View>
        );
      case 'type':
        return (
          <View style={styles.inputView}>
            <Text style={styles.text}>문의 유형</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={items}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="문의 유형을 선택하세요"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </View>
        );
      case 'title':
        return (
          <View style={styles.inputView}>
            <Text style={styles.text}>문의 제목</Text>
            <TextInput
              style={styles.input}
              onChangeText={setTitle}
              value={title}
              placeholder="50자 미만으로 입력해주세요"
              maxLength={50}
            />
          </View>
        );
      case 'content':
        return (
          <View style={styles.inputView}>
            <Text style={styles.text}>문의 내용</Text>
            <TextInput
              style={styles.content}
              onChangeText={setContent}
              value={content}
              placeholder="문의하고 싶은 내용을 작성해주세요."
              multiline
              maxLength={1000}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <RootView viewStyle={styles.container}>
      <Text style={styles.boldText}>문의하고 싶은 내용이 있으신가요?</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
      <MoveButton
        text="제출하기"
        onPress={onPressSubmit}
        inActive={!(email && value && title && content)}
      />
    </RootView>
  );
};

export default InquiryScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rWidth(30),
    //paddingVertical: rHeight(25),
    // alignItems: 'center'
  },

  boldText: {
    fontFamily: fonts.bold,
    fontSize: rFont(20),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  text: {
    fontFamily: fonts.regular,
    fontSize: rFont(16),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  inputView: {
    marginTop: rHeight(40),
  },

  input: {
    marginTop: rHeight(10),
    paddingVertical: rHeight(8),
    borderBottomColor: colors.textGrey,
    borderBottomWidth: 1,
  },

  validateText: {
    fontFamily: fonts.regular,
    fontSize: rFont(10),
    color: 'red',

    paddingLeft: rWidth(3),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  dropdown: {
    marginTop: rHeight(10),
    height: rHeight(50),
    borderColor: colors.borderGrey,
    borderWidth: rHeight(0.5),
    borderRadius: rHeight(8),
    paddingHorizontal: rWidth(10),
  },

  placeholderStyle: {
    fontFamily: fonts.regular,
    fontSize: rFont(11),
    color: colors.borderGrey,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  selectedTextStyle: {
    fontFamily: fonts.regular,
    fontSize: rFont(14),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  content: {
    height: rHeight(200),
    marginTop: rHeight(10),
    paddingVertical: rHeight(15),
    paddingHorizontal: rWidth(10),
    backgroundColor: colors.placeHolderGrey,
  },
});
