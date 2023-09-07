//
//영양성분 관련 상수들
//

export const Nutrition= {
    foodWeight:'foodWeight',
    foodKcal:'foodKcal',
    foodCarbo:'foodCarbo',
    foodProtein:'foodProtein',
    foodFat:'foodFat',
}
export const Nutrition_ko = {
    [Nutrition.foodWeight]:'제공량',
    [Nutrition.foodCarbo]:'탄수화물',
    [Nutrition.foodProtein]:'단백질',
    [Nutrition.foodFat]:'지방',
    [Nutrition.foodKcal]:'열량'
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