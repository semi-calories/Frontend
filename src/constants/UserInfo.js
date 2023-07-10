//
//사용자 정보에서 쓰이는 constants
//

export const UserInfo = {
    gender: 'gender',
    age: 'age',
    height: 'height',
    weight: 'weight',
    targetWeight: 'targetWeight',
    activity: 'activity',
}
export const UserInfo_ko = {
    [UserInfo.gender]: '성별',
    [UserInfo.age]: '나이',
    [UserInfo.height]: '키',
    [UserInfo.weight]: '몸무게',
    [UserInfo.targetWeight]: '목표 몸무게',
    [UserInfo.activity]: '평소 활동량'
}


export const Gender = {
    female: 'F',
    male: 'M',
};
export const Gender_ko = {
    [Gender.female]: '여성',
    [Gender.male]: '남성',
}
export const Gender_icon = {
    [Gender.female]: 'gender-female',
    [Gender.male]: 'gender-male'
}


export const Activity = {
    less: 'less',
    normal: 'normal',
    much: 'much',
}
export const Activity_ko = {
    [Activity.less]: '적음',
    [Activity.normal]: '보통',
    [Activity.much]: '많음',
}
export const Activity_icon = {
    [Activity.less]: 'emoticon-neutral-outline',
    [Activity.normal]: 'emoticon-happy-outline',
    [Activity.much]: 'emoticon-excited-outline',
}


export const Goal = {
    healthy: 'healthy',
    weightLoss: 'weightLoss',
    weightGain: 'weightGain',
}
export const Goal_ko = {
    [Goal.healthy]: '건강 식단',
    [Goal.weightLoss]: '체지방 감소 식단',
    [Goal.weightGain]: '체중 증량 식단',
}
export const Goal_explain = {
    [Goal.healthy]: '탄단지 균형을 알맞게 유지해요',
    [Goal.weightLoss]: '탄단지 균형을 유지하고 칼로리 섭취를 제한해요',
    [Goal.weightGain]: '탄단지 균형을 유지하고 칼로리 섭취를 늘려요'
}
export const Goal_icon = {
    [Goal.healthy]: 'noodles',
    [Goal.weightLoss]: 'food-apple-outline',
    [Goal.weightGain]: 'food-turkey'
}
