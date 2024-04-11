//
//user 관련 api 요청 및 응답
//
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

  try {
    const { data } = await fetchDataPost(`/user/updateInfo`, userInfo);
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
