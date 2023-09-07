//
//하드코딩된 test용 정보들
//
import { Nutrition } from '~/constants/food'

//User 정보
export const Null_img = require('@assets/null_img.png');
export const UserName = '김건국';

//영양섭취
export const TargetIntake = {
    kcal: 1929,
    carb: 198,
    protein: 193,
    fat: 43,
}

export const SpentAmount = 859;
export const TargetAmount = 1929;

export const SpentNutri = {
    [Nutrition.foodCarbo]: 82,
    [Nutrition.foodProtein]: 53,
    [Nutrition.foodFat]: 36
}
export const TargetNutri = {
    [Nutrition.foodCarbo]: 198,
    [Nutrition.foodProtein]: 198,
    [Nutrition.foodFat]: 43
}

//통계
export const WeekData = [
    [30, 20, 25],
    [40, 40, 20],
    [35, 20, 20],
    [20, 30, 20],
    [20, 20, 20],
]

export const MonthData = [
    [30, 20, 25],
    [40, 40, 20],
    [35, 20, 20],
    [20, 30, 20],
    [20, 20, 20],
    [30, 20, 25],
    [40, 40, 20],
    [35, 20, 20],
    [20, 30, 20],
    [20, 20, 20],
    [40, 40, 20],
    [35, 20, 20],
]

//영양성분
export const FoodTemp = [
    {
        name: '사과',
        [Nutrition.foodWeight]: 230,
        [Nutrition.foodKcal]: 110,
        [Nutrition.foodCarbo]: 29.3,
        [Nutrition.foodProtein]: 0.6,
        [Nutrition.foodFat]: 0.4,
        satisfaction: '',
    },
    {
        name: '계란후라이',
        [Nutrition.foodWeight]: 46,
        [Nutrition.foodKcal]: 89,
        [Nutrition.foodCarbo]: 0.4,
        [Nutrition.foodProtein]: 6.2,
        [Nutrition.foodFat]: 6.8,
        satisfaction: '',
    },
]

// 추천
export const RecommendFood = [
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',
        food_image: '',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
]

//식단 기록
export const FoodRecord = [
    {
        food_name: '육회비빔밥',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
    {
        food_name: '육회비빔밥',

        food_kcal: 450,
        food_carbo: 2.3,
        food_protein: 20,
        food_fat: 5,
    },
]