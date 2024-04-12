//
// 카메라 스크린 나타나는 화면
//
import React, { useRef, useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { Camera, CameraType, AutoFocus } from 'expo-camera';
import { manipulateAsync } from 'expo-image-manipulator';

import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';

import { UserInfoType, RecordType } from '~/constants/type';

import { dWidth, rFont, rHeight, rWidth } from '~/styles/globalSizes';
import { colors, fonts } from '~/styles/globalStyles';

import { recognizeUploadFoodImg } from '~/apis/api/recognizer';

const CameraScreen = ({ navigation, route }) => {
  const { nextScreen, userInfo } = route.params;

  const cameraRef = useRef(null);

  const [type, setType] = useState(CameraType.back);

  const [capturedImage, setCapturedImage] = useState(null);
  console.log('capturedImage', capturedImage);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeader
          back
          title="사진 찍기"
          backPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  const takePictureHandler = async () => {
    // cameraRef가 없으면 해당 함수가 실행되지 않게 가드
    if (!cameraRef.current) return;

    const options = {
      quality: 0.8,
    };

    const photo = await cameraRef.current.takePictureAsync(options);

    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const retakePictureHandler = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
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
      const userData = { ...userInfo, image: capturedImage };

      const params = {
        userInfo: userData,
        infoType: UserInfoType.edit,
      };

      navigation.navigate(nextScreen, params);
    }
  };

  const recognizeUploadDiet = async () => {
    setLoading(true);

    const uploadInfo = {
      userCode: userInfo.userCode,
      file: capturedImage.uri,
    };

    try {
      const { dietLists } = await recognizeUploadFoodImg(uploadInfo);
      //console.log('recognizeUploadDiet dietLists', dietLists);

      return dietLists;
    } finally {
      setLoading(false);
    }
  };

  return previewVisible && capturedImage ? (
    <RootView>
      <Image source={capturedImage} style={styles.camera} />
      <View style={styles.touchView}>
        <TouchableOpacity activeOpacity={0.6} onPress={retakePictureHandler}>
          <Text style={styles.text}>다시찍기</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={uploadPictureHandler}>
          <Text style={styles.text}>완료</Text>
        </TouchableOpacity>
      </View>

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
  ) : (
    <RootView>
      <Camera
        ref={cameraRef}
        type={type}
        autoFocus={AutoFocus.on}
        style={styles.camera}
      />
      <View style={styles.touchView}>
        <View style={{ width: rWidth(35) }} />
        <TouchableOpacity
          style={styles.btnView}
          activeOpacity={0.8}
          onPress={takePictureHandler}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back,
            )
          }
        >
          <AntDesign name="sync" size={rHeight(30)} color={colors.black} />
        </TouchableOpacity>
      </View>
    </RootView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  camera: {
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

  btnView: {
    width: rHeight(80),
    height: rHeight(80),
    backgroundColor: colors.white,
    borderRadius: rWidth(40),
    borderWidth: rHeight(4),
    borderColor: colors.primary,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    elevation: 2,
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
