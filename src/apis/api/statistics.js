// 통계 관련 api
import { fetchDataGet, fetchDataPost } from '~/apis/utils/instance';

// 통계 - 월간 조회
export const getMonthStats = async (statInfo) => {
  console.log('getMonthStats statInfo', statInfo);

  try {
    const { data } = await fetchDataGet('/statistics/getMonthStats', {
      params: statInfo,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

// 통계 - 주간 조회
export const getWeekStats = async (userCode, month) => {
  console.log('getWeekStats  userCode month', userCode, month);

  try {
    const { data } = await fetchDataPost('/statistics/getWeekStats', month, {
      params: userCode,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

//몸무게 조회
export const getWeight = async (weightInfo) => {
  console.log('getWeight weightInfo', weightInfo);

  try {
    const { data } = await fetchDataGet('/statistics/getWeight', {
      params: weightInfo,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

//몸무게 저장/수정
export const saveWeight = async (weightInfo) => {
  console.log('saveWeight weightInfo', weightInfo);

  try {
    const { data } = await fetchDataPost('/statistics/saveWeight', weightInfo);
    return data;
  } catch (err) {
    console.error(err);
  }
};

//몸무게 기간 조회
export const getMonthRangeWeight = async (weightInfo) => {
  console.log('getMonthRangeWeight weightInfo', weightInfo);

  try {
    const { data } = await fetchDataGet('/statistics/getMonthRangeWeight', {
      params: weightInfo,
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

//몸무게 삭제
export const deleteWeight = async (weightInfo) => {
  console.log('deleteWeight weightInfo', weightInfo);

  try {
    const { data } = await fetchDataPost(
      '/statistics/deleteWeight',
      weightInfo,
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};

//예상 몸무게 저장
export const savePredictWeight = async (weightInfo) => {
  console.log('savePredictWeight weightInfo', weightInfo);
  try {
    const { data } = await fetchDataPost(
      '/statistics/savePredictWeight',
      weightInfo,
    );
    return data;
  } catch (e) {
    console.error(e);
  }
};
