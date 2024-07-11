//
// 앨범 가져오는 스크린 - expo-imagePicker
//
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';

import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useSetRecoilState } from 'recoil';

import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';

import { RecordType, UserInfoType } from '~/constants/type';

import { dWidth, rFont, rHeight, rWidth } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { UserState } from '~/atoms/UserAtom';

import { recognizeUploadFoodImg } from '~/apis/api/recognizer';
import { saveUserImage, getInfo } from '~/apis/api/user';

const AlbumScreen_new = ({ navigation, route }) => {
  const { nextScreen, userInfo } = route.params;
  console.log('AlbumScreen2 route.params', route.params);

  const setUserState = useSetRecoilState(UserState);

  const [image, setImage] = useState(null);
  // console.log('AlbumScreen2 image', image);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          back
          title="사진 선택"
          backPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    pickImage();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadPictureHandler = async () => {
    if (nextScreen === 'MealtimeScreen') {
      const dietLists = await recognizeUploadDiet();

      if (dietLists.length) {
        const params = {
          foodParam: dietLists,
          userInfo,
          type: RecordType.init,
        };

        navigation.navigate(nextScreen, params);
      } else {
        Alert.alert('사진 인식이 되지 않습니다. 다시 촬영해주세요.');
      }
    } else {
      const user = {
        userCode: userInfo.userCode,
        image: image.uri,
      };

      await saveUserImage(user);
      const userData = await getInfo({ userCode: userInfo.userCode });
      setUserState({
        ...userData,
        userCode: user.userCode,
        image: userData.image,
      });

      const params = {
        userInfo: { ...userInfo, image: userData.image },
        infoType: UserInfoType.edit,
      };

      navigation.navigate(nextScreen, params);
    }
  };

  const recognizeUploadDiet = async () => {
    setLoading(true);

    const uploadInfo = {
      userCode: userInfo.userCode,
      file: image.uri,
    };

    try {
      const { dietLists } = await recognizeUploadFoodImg(uploadInfo);
      console.log('recognizeUploadDiet dietLists', dietLists);

      return dietLists;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootView>
      {image && (
        <>
          <Image source={{ uri: image.uri }} style={styles.album} />
          <View style={styles.touchView}>
            <TouchableOpacity activeOpacity={0.6} onPress={pickImage}>
              <Text style={styles.text}>다시선택</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={uploadPictureHandler}
            >
              <Text style={styles.text}>완료</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* 로딩 인디케이터 모달 */}
      <Modal visible={loading} transparent>
        <View style={styles.modalView}>
          <View style={styles.modal}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={{ marginTop: 10 }}>잠시만 기다려주세요...</Text>
          </View>
        </View>
      </Modal>
    </RootView>
  );
};

export default AlbumScreen_new;

const styles = StyleSheet.create({
  album: {
    width: dWidth,
    height: rHeight(550),
  },

  touchView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rWidth(30),
  },

  text: {
    fontFamily: fonts.bold,
    fontSize: rFont(20),

    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalBackground,
  },
  modal: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',

    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
