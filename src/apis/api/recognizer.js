import { Platform } from 'react-native';

import { fetchDataPost } from '~/apis/utils/instance';

// 음식 인식 요청 (base64)
export const recognizeUpload = async (uploadInfo) => {
  //console.log('recognizeUpload uploadInfo', uploadInfo)

  try {
    const { data } = await fetchDataPost(
      '/recognizer/recognizerFood',
      uploadInfo,
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

// 음식 인식 요청 (form Data)
export const recognizeUploadFoodImg = async (uploadInfo) => {
  //console.log('recognizeUploadFormData uploadInfo', uploadInfo)

  const formData = new FormData();

  const uri =
    Platform.OS === 'android'
      ? uploadInfo.file
      : uploadInfo.file.replace('file://', '');

  formData.append('userCode', uploadInfo.userCode);
  formData.append('file', {
    uri,
    name: 'foodImage.jpg',
    type: 'image/jpg',
  });

  try {
    const { data } = await fetchDataPost(
      '/recognizer/recognizerFoodImg',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};
