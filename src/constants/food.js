//
//영양성분 관련 상수들
//

export const Nutrition= {
    serving:'serving',
    kcal:'kcal',
    carbo:'carbo',
    protein:'protein',
    fat:'fat',
}
export const Nutrition_ko = {
    [Nutrition.serving]:'제공량',
    [Nutrition.carbo]:'탄수화물',
    [Nutrition.protein]:'단백질',
    [Nutrition.fat]:'지방',
    [Nutrition.kcal]:'열량'
}

export const Satisfaction = {
    dislike:1,
    normal:2,
    like:3,
}
export const Satisfaction_ko={
    [Satisfaction.dislike]:'별로',
    [Satisfaction.normal]:'보통',
    [Satisfaction.like]:'좋음',
}
export const Satisfaction_icon={
    [Satisfaction.dislike]: 'emoticon-sad-outline',
    [Satisfaction.normal]: 'emoticon-neutral-outline',
    [Satisfaction.like]: 'emoticon-happy-outline',
}