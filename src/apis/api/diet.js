//
// diet 관련 api 요청 및 응답
//
import { fetchDataGet, fetchDataPost } from '~/apis/utils/instance';

// 날짜별 식단 기록 조회
export const getRecord = async (recordInfo) => {
  console.log('getRecord recordInfo', recordInfo);

  try {
    const { data } = await fetchDataGet(`/record/getRecord`, {
      params: recordInfo,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

// 음식 검색
export const foodSearch = async (foodName) => {
  console.log('foodSearch foodname', foodName);
  try {
    const { data } = await fetchDataGet(`/record/foodSearch`, {
      params: foodName,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

// 식단 기록 등록
export const registerRecord = async (recordInfo) => {
  console.log('registerRecord recordInfo', recordInfo);

  try {
    const { data } = await fetchDataPost(`/record/text`, recordInfo);
    return data;
  } catch (err) {
    console.error(err);
  }
};

//식단 기록 수정
export const updateRecord = async (recordInfo) => {
  console.log('updateRecord recordInfo', recordInfo);

  try {
    const { data } = await fetchDataPost(`/record/updateRecord`, recordInfo);
    return data;
  } catch (err) {
    console.error(err);
  }
};

//식단 기록 삭제
export const deleteRecord = async (recordInfo) => {
  console.log('deleteRecord recordInfo', recordInfo);

  try {
    const { data } = await fetchDataPost(`/record/deleteRecord`, recordInfo);
    return data;
  } catch (err) {
    console.error(err);
  }
};
