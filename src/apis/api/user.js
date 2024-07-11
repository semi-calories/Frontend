//
//user 관련 api 요청 및 응답
//
import { Platform } from 'react-native';

import { fetchDataGet, fetchDataPost } from '~/apis/utils/instance';

//유저 정보 조회
export const getInfo = async (userCode) => {
  try {
    const { data } = await fetchDataGet(`/user/getInfo`, { params: userCode });
    return data;
  } catch (err) {
    console.error(err);
  }
};

//유저 정보 등록/수정
export const updateInfo = async (userInfo) => {
  console.log('updateInfo userInfo', userInfo);

  const formData = new FormData();

  formData.append('userCode', userInfo.userCode);
  formData.append('email', userInfo.email);
  formData.append('name', userInfo.name);
  formData.append('gender', userInfo.gender);
  formData.append('age', userInfo.age);
  formData.append('height', userInfo.height);
  formData.append('weight', userInfo.weight);
  formData.append('userActivity', userInfo.userActivity);
  formData.append('goalWeight', userInfo.goalWeight);
  formData.append('userGoal', userInfo.userGoal);
  formData.append('period', userInfo.period);

  try {
    const { data } = await fetchDataPost(`/user/updateInfo`, formData);
    return data;
  } catch (err) {
    console.error(err);
  }
};

//회원 이미지 저장
export const saveUserImage = async (userInfo) => {
  console.log('saveUserImage userImage', userInfo);
  const formData = new FormData();

  const uri =
    Platform.OS === 'android'
      ? userInfo.image
      : userInfo.image.replace('file://', '');

  formData.append('userCode', userInfo.userCode);
  formData.append('image', {
    uri,
    name: 'userImage.jpg',
    type: 'image/jpg',
  });

  try {
    const { data } = await fetchDataPost(`/user/saveUserImage`, formData);

    return data;
  } catch (err) {
    console.error(err);
  }
};

//선호 음식 조회
export const getPrefer = async (userCode) => {
  try {
    const { data } = await fetchDataGet(`/user/getPrefer`, {
      params: userCode,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

//비선호 음식 조회
export const getDislike = async (userCode) => {
  try {
    const { data } = await fetchDataGet(`/user/getDislike`, {
      params: userCode,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

//선호 음식 등록/수정
export const savePrefer = async (preferInfo) => {
  console.log('savePrefer preferInfo', preferInfo);

  try {
    const { data } = await fetchDataPost(`/user/savePrefer`, preferInfo);
    return data;
  } catch (err) {
    console.error(err);
  }
};

//비선호 음식 등록/수정
export const saveDislike = async (dislikeInfo) => {
  console.log('saveDislike dislikeInfo', dislikeInfo);

  try {
    const { data } = await fetchDataPost(`/user/saveDislike`, dislikeInfo);
    return data;
  } catch (err) {
    console.error(err);
  }
};
