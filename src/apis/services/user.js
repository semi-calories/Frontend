//
//api 요청시 받아오는 데이터 정제
//

export const getPreferFood = (rawData) => {
  return rawData.map((food) => food.preferFoodCode);
};

export const getDislikeFood = (rawData) => {
  return rawData.map((food) => food.dislikeFoodCode);
};
