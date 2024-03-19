//
//사용자 정보 메인 화면 - 사용자 정보 편집, 목표 설정, 선호/비선호 음식 설정 화면으로 이동 가능
//

import React, { useLayoutEffect, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRecoilValue } from 'recoil';

import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';

import { UserInfoType } from '~/constants/type';

import { rWidth, rHeight, rFont } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { UserState } from '~/atoms/UserAtom';

import { deleteInfo, userLogout } from '~/apis/api/loginSignup';

const UserInfoMainScreen = ({ navigation }) => {
  const user = useRecoilValue(UserState);
  console.log('UserInfoMainScreen user', user);

  const [image, setImage] = useState({});
  console.log('UserInfoMainScreen image', image);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <BackHeader back backPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  useEffect(() => {
    getUser();
    const focusSubscription = navigation.addListener('focus', () => {
      console.log('UserInfoMainScreen focus');
      getUser();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return focusSubscription;
  }, [navigation]);

  const getUser = async () => {
    setImage({
      imageSrc: user.image,
      imageHash: Date.now(),
    });
  };

  const onPressLogout = async () => {
    try {
      await userLogout({ userCode: user.userCode });
      Alert.alert('로그아웃에 성공하였습니다.');

      navigation.navigate('LoginSignupScreen');
    } catch (err) {
      console.log(err);

      Alert.alert('로그아웃에 실패하였습니다.');
    }
  };

  const onPressQuit = async () => {
    try {
      await deleteInfo({ userCode: user.userCode });
      Alert.alert('회원탈퇴에 성공하였습니다.');

      navigation.navigate('LoginSignupScreen');
    } catch (err) {
      console.log(err);

      Alert.alert('회원탈퇴에 실패하였습니다.');
    }
  };

  return (
    <RootView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: rHeight(30) }}
      >
        {/* 사용자 사진, 이름 나타내는 부분 */}
        <View style={styles.profile}>
          {user.image ? (
            <Image
              source={{ uri: `${image.imageSrc}?${image.imageHash}` }}
              style={styles.img}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.nullImg}>
              <FontAwesome5
                name="user"
                size={rHeight(80)}
                color={colors.borderGrey}
              />
            </View>
          )}
          <Text style={styles.boldText}>{user?.name}</Text>
        </View>

        {/* 화면이동 */}
        <Pressable
          style={styles.flexRow}
          onPress={() =>
            navigation.push('UserInfoEditScreen', {
              userInfo: {
                ...user,
                image: {
                  uri: user.image
                    ? `${image.imageSrc}?${image.imageHash}`
                    : null,
                },
              },
              infoType: UserInfoType.edit,
            })
          }
        >
          <Text style={styles.menuText}>사용자 정보</Text>
          <MaterialIcons
            name="chevron-right"
            size={35}
            color={colors.borderGrey}
          />
        </Pressable>
        <Pressable
          style={styles.flexRow}
          onPress={() =>
            navigation.push('SetGoalScreen', {
              userInfo: user,
              infoType: UserInfoType.edit,
            })
          }
        >
          <Text style={styles.menuText}>목표 설정</Text>
          <MaterialIcons
            name="chevron-right"
            size={35}
            color={colors.borderGrey}
          />
        </Pressable>
        <Pressable
          style={styles.flexRow}
          onPress={() =>
            navigation.push('SetFoodScreen', {
              userInfo: user,
              infoType: UserInfoType.edit,
            })
          }
        >
          <Text style={styles.menuText}>선호 / 비선호 음식 설정</Text>
          <MaterialIcons
            name="chevron-right"
            size={35}
            color={colors.borderGrey}
          />
        </Pressable>
        <Pressable
          style={styles.flexRow}
          onPress={() => navigation.push('FAQScreen')}
        >
          <Text style={styles.menuText}>FAQ</Text>
          <MaterialIcons
            name="chevron-right"
            size={35}
            color={colors.borderGrey}
          />
        </Pressable>
        <Pressable
          style={styles.flexRow}
          onPress={() => navigation.push('InquiryScreen')}
        >
          <Text style={styles.menuText}>문의하기</Text>
          <MaterialIcons
            name="chevron-right"
            size={35}
            color={colors.borderGrey}
          />
        </Pressable>
        <Pressable style={styles.flexRow} onPress={onPressLogout}>
          <Text style={styles.menuText}>로그아웃</Text>
          <MaterialIcons name="chevron-right" size={35} color={colors.white} />
        </Pressable>
        <Pressable onPress={onPressQuit}>
          <Text style={styles.quitText}>회원탈퇴</Text>
        </Pressable>
      </ScrollView>
    </RootView>
  );
};

export default UserInfoMainScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: rHeight(17),
    paddingHorizontal: rWidth(24),
  },

  profile: {
    paddingHorizontal: rWidth(107),
    alignItems: 'center',

    marginBottom: rHeight(15),
  },

  nullImg: {
    backgroundColor: colors.placeHolderGrey,
    width: rWidth(120),
    height: rHeight(120),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rHeight(8),

    borderRadius: rWidth(100),
  },

  img: {
    width: rHeight(120),
    height: rHeight(120),
    resizeMode: 'contain',
    marginBottom: rHeight(8),

    borderRadius: rWidth(100),
  },

  boldText: {
    fontFamily: fonts.bold,
    fontSize: rFont(30),
    color: colors.black,
    textAlign: 'center',

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  menuText: {
    fontFamily: fonts.bold,
    fontSize: rFont(18),
    color: colors.black,

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  quitText: {
    fontFamily: fonts.regular,
    fontSize: rFont(15),
    color: colors.borderGrey,

    marginVertical: rHeight(10),
    textDecorationLine: 'underline',

    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomWidth: rWidth(1),
    borderColor: colors.textGrey,

    paddingHorizontal: rWidth(10),
    paddingVertical: rHeight(22),
  },
});
