//
//사용자 정보에서 쓰이는 constants
//

export const UserInfo = {
  name: 'name',
  gender: 'gender',
  age: 'age',
  height: 'height',
  weight: 'weight',
  goalWeight: 'goalWeight',
  userActivity: 'userActivity',
};
export const UserInfo_ko = {
  [UserInfo.name]: '이름',
  [UserInfo.gender]: '성별',
  [UserInfo.age]: '나이',
  [UserInfo.height]: '키',
  [UserInfo.weight]: '몸무게',
  [UserInfo.goalWeight]: '목표 몸무게',
  [UserInfo.userActivity]: '평소 활동량',
};

export const Gender = {
  female: 'F',
  male: 'M',
};
export const Gender_ko = {
  [Gender.female]: '여성',
  [Gender.male]: '남성',
};
export const Gender_icon = {
  [Gender.female]: 'gender-female',
  [Gender.male]: 'gender-male',
};

export const Activity = {
  less: 'less',
  normal: 'normal',
  more: 'more',
};
export const Activity_ko = {
  [Activity.less]: '적음',
  [Activity.normal]: '보통',
  [Activity.more]: '많음',
};
export const Activity_icon = {
  [Activity.less]: 'emoticon-neutral-outline',
  [Activity.normal]: 'emoticon-happy-outline',
  [Activity.more]: 'emoticon-excited-outline',
};

export const Goal = {
  health: 'health',
  lose: 'lose',
  gain: 'gain',
};
export const Goal_ko = {
  [Goal.health]: '건강 식단',
  [Goal.lose]: '체지방 감소 식단',
  [Goal.gain]: '체중 증량 식단',
};
export const Goal_explain = {
  [Goal.health]: '탄단지 균형을 알맞게 유지해요',
  [Goal.lose]: '탄단지 균형을 유지하고 칼로리 섭취를 제한해요',
  [Goal.gain]: '탄단지 균형을 유지하고 칼로리 섭취를 늘려요',
};
export const Goal_icon = {
  [Goal.health]: 'noodles',
  [Goal.lose]: 'food-apple-outline',
  [Goal.gain]: 'food-turkey',
};
