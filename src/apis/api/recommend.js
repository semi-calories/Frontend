import { fetchDataPost } from '~/apis/utils/instance';

//음식 추천 요청
export const recommendRequest = async (requestInfo) => {
  // console.log('recommendRequest requestInfo', requestInfo);

  try {
    const { data } = await fetchDataPost(`/recommend/request`, requestInfo);
    // console.log('recommendRequest data', data)

    return data;
  } catch (err) {
    console.log(err);
  }
};
