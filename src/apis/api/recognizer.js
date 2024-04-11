import { fetchDataPost } from '~/apis/utils/instance';

// 음식 인식 요청
export const recognizeUpload = async (uploadInfo) => {
  //console.log('recognizeUpload uploadInfo', uploadInfo)

  try {
    const { data } = await fetchDataPost(
      '/recognizer/recognizerFood',
      uploadInfo,
    );
    //console.log('recognizeUpload data', data)

    return data;
  } catch (err) {
    console.log(err);
  }
};

// 음식 인식 요청 (form Data)
export const recognizeUploadFoodImg = async (uploadInfo) => {
  //console.log('recognizeUploadFormData uploadInfo', uploadInfo)

  try {
    const { data } = await fetchDataPost(
      '/recognizer/recognizerFoodImg',
      uploadInfo,
    );
    //console.log('recognizeUploadFormData data', data)

    return data;
  } catch (err) {
    console.log(err);
  }
};
