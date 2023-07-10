//
//사용자 정보에서 쓰이는 constants
//

export const UserInfo = {
    gender: 'gender',
    age:'age',
    height:'height',
    weight:'weight',
    targetWeight:'targetWeight',
    activity:'activity',
}

export const UserInfo_ko = {
    [UserInfo.gender]:'성별',
    [UserInfo.age]:'나이',
    [UserInfo.height]:'키',
    [UserInfo.weight]:'몸무게',
    [UserInfo.targetWeight]:'목표 몸무게',
    [UserInfo.activity]:'평소 활동량'
}

export const Gender = {
    female : 'F',
    male:'M',
};

export const Gender_ko ={
    [Gender.female] : '여성',
    [Gender.male]:'남성',
}

export const Activity ={
    less:'less',
    normal:'normal',
    much:'much',
}

export const Activity_ko = {
    [Activity.less]:'적음',
    [Activity.normal]: '보통',
    [Activity.much]: '많음',
}
