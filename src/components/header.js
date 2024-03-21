//
// header 컴포넌트 모아놓은 파일
//

import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
  Animated,
} from 'react-native';

import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Image } from 'expo-image';

import { HeaderType } from '~/constants/type';

import { dWidth, rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { useTabMenu } from '~/context/TabContext';

const LogoTitle = require('~/assets/LogoTitle.webp');

const RightTypefunc = ({ type, rightPress }) => {
  switch (type) {
    case HeaderType.skip:
      return (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={rightPress}>
            <Text style={styles.skip}>건너뛰기</Text>
          </TouchableOpacity>
        </View>
      );
    case HeaderType.setting:
      return (
        <TouchableOpacity onPress={rightPress}>
          <Ionicons
            name="settings-outline"
            size={rHeight(40)}
            color={colors.textGrey}
          />
        </TouchableOpacity>
      );
    case HeaderType.save:
      return (
        <TouchableOpacity onPress={rightPress}>
          <Text style={styles.save}>저장</Text>
        </TouchableOpacity>
      );
    default:
      return null;
  }
};

export function BackHeader({ back, title, rightType, backPress, rightPress }) {
  return (
    <View style={[styles.container, styles.paddingBack]}>
      {back && (
        <TouchableOpacity onPress={backPress}>
          <MaterialIcons
            name="arrow-back-ios"
            size={rHeight(26)}
            color={colors.textGrey}
          />
        </TouchableOpacity>
      )}
      {title && (
        <View style={styles.titleView}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      {rightType ? (
        <RightTypefunc type={rightType} rightPress={rightPress} />
      ) : (
        <View style={{ width: rWidth(26.3) }} />
      )}
    </View>
  );
}

export function SearchHeader({ backPress, text, onChangeText, clearText }) {
  return (
    <View style={[styles.container, styles.paddingBack]}>
      <TouchableOpacity onPress={backPress}>
        <MaterialIcons
          name="arrow-back-ios"
          size={rHeight(26)}
          color={colors.textGrey}
        />
      </TouchableOpacity>
      <View style={styles.searchView}>
        <MaterialIcons
          name="search"
          size={rHeight(24)}
          color={colors.borderGrey}
          style={{ alignSelf: 'center' }}
        />
        <TextInput
          style={[styles.searchInput, styles.textStyle]}
          //value={text}
          onChangeText={onChangeText}
        />
        {/* <Pressable onPress={clearText}>
                    <Ionicons name="close-circle" size={24} color={colors.borderGrey} />
                </Pressable> */}
      </View>
    </View>
  );
}

export function MainHeader({ notiPress, userInfoPress }) {
  const { opened, toggleOpened } = useTabMenu();

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: opened ? 1 : 0,
      duration: 300,
      friction: 2,
      useNativeDriver: true,
    }).start();
  }, [opened, animation]);

  return (
    <Pressable
      style={[styles.container, styles.paddingLogo]}
      onPress={toggleOpened}
    >
      {opened && (
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['transparent', colors.black],
              }),
            },
          ]}
        />
      )}
      <Image source={LogoTitle} style={styles.logoTitle} contentFit="contain" />

      <View style={styles.logoRight}>
        {notiPress && (
          <Pressable onPress={notiPress}>
            <MaterialIcons
              name="notifications-none"
              size={rHeight(35)}
              color="black"
            />
          </Pressable>
        )}
        <Pressable onPress={userInfoPress}>
          <MaterialCommunityIcons
            name="account-outline"
            size={rHeight(38)}
            color="black"
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: dWidth,
    height: rHeight(60),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  paddingBack: {
    paddingHorizontal: rWidth(26),
  },

  paddingLogo: {
    paddingHorizontal: rWidth(14),
    justifyContent: 'space-between',
  },

  titleView: {},

  title: {
    color: colors.black,
    fontSize: rFont(23),
    fontFamily: fonts.bold,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  skip: {
    color: colors.textGrey,
    fontSize: rFont(18),
    fontFamily: fonts.regular,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  save: {
    color: colors.black,
    fontSize: rFont(18),
    fontFamily: fonts.medium,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  searchView: {
    width: rWidth(300),
    //height: rHeight(40),
    flexDirection: 'row',

    borderWidth: rHeight(2),
    borderColor: colors.textGrey,
    borderRadius: rHeight(10),

    marginLeft: rWidth(10),
    paddingHorizontal: rWidth(12),
    paddingVertical: rHeight(6),
  },

  searchInput: {
    flex: 1,
    marginLeft: rWidth(10),
  },

  logoTitle: {
    width: rHeight(218),
    height: rHeight(43),
  },

  logoRight: {
    flexDirection: 'row',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.3,
  },

  textStyle: {
    fontFamily: fonts.regular,
    fontSize: rFont(14),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
