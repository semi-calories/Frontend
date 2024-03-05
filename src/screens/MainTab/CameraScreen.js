//
// 카메라 스크린 나타나는 화면
//
import { AntDesign } from '@expo/vector-icons';
import { Camera, CameraType, AutoFocus } from 'expo-camera';
import { manipulateAsync } from 'expo-image-manipulator';
import React, { useRef, useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  Alert,
} from 'react-native';

import { recognizeUpload } from '~/apis/api/diet';
import { RootView } from '~/components/container';
import { BackHeader } from '~/components/header';
import { dWidth, rFont, rHeight, rWidth } from '~/constants/globalSizes';
import { colors, fonts } from '~/constants/globalStyles';
import { UserInfoType, RecordType } from '~/constants/type';

const CameraScreen = ({ navigation, route }) => {
  const { nextScreen, userInfo } = route.params;

  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);

  const [capturedImage, setCapturedImage] = useState(null);
  console.log('capturedImage', capturedImage);
  const [previewVisible, setPreviewVisible] = useState(false);

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
      quality: 0.5, // 이미지 품질 (0.0에서 1.0 사이의 값, 1.0이 최상의 품질)
      // base64: true, // true로 설정하면 이미지를 base64 문자열로 반환
    };

    const photo = await cameraRef.current.takePictureAsync(options);

    await manipulateAsync(
      photo.uri,
      [{ resize: { width: photo.width / 4, height: photo.height / 4 } }],
      { base64: true, format: 'jpeg', compress: 0.5 }, // 원하는 형식 및 압축률 설정
    ).then((data) => {
      setPreviewVisible(true);
      setCapturedImage(data);
    });
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
    const uploadInfo = {
      userCode: userInfo.userCode,
      file: capturedImage.base64,
    };

    try {
      const { dietLists } = await recognizeUpload(uploadInfo);
      console.log('recognizeUploadDiet dietLists', dietLists);

      return dietLists;
    } catch (error) {
      console.error();
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
          <AntDesign name="sync" size={rHeight(30)} color="black" />
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
});
